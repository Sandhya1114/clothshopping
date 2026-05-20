import { categories, faqItems, sizeGuideRows } from '@/lib/site';
import { formatCurrency, titleCase } from '@/lib/format';

const SITE_NAME = 'NorthStitch';
const BACKEND_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'
).replace(/\/$/, '');
const REMOTE_CHATBOT_URL = (
  process.env.NEXT_PUBLIC_CHATBOT_URL || 'https://chatbot-v697.onrender.com'
).replace(/\/$/, '');

const CONTACT_DETAILS = {
  email: 'support@northstitch.com',
  phone: '+1 (555) 240-1122',
  address: '214 Market Street, New York, NY 10012'
};

const QUICK_REPLIES = [
  { id: 'shipping', question: 'How long does shipping take?' },
  { id: 'guest-checkout', question: 'Can I place an order without creating an account?' },
  { id: 'size-guide', question: 'How do I choose the right size?' },
  { id: 'returns', question: 'What is the return policy?' },
  { id: 'payment', question: 'What payment methods are supported?' },
  { id: 'contact', question: 'How can I contact support?' },
  { id: 'categories', question: 'What categories are available?' },
  { id: 'recommend', question: 'Can you recommend a few products?' }
];

const GENERAL_SUGGESTIONS = [
  { question: 'What is the return policy?' },
  { question: 'How do I choose the right size?' },
  { question: 'Can you recommend a few products?' }
];

const PRODUCT_QUERY_WORDS = new Set([
  'a',
  'about',
  'an',
  'and',
  'any',
  'are',
  'available',
  'best',
  'buy',
  'can',
  'collection',
  'collections',
  'compare',
  'cost',
  'description',
  'details',
  'do',
  'for',
  'from',
  'get',
  'have',
  'how',
  'i',
  'in',
  'info',
  'information',
  'is',
  'it',
  'item',
  'its',
  'like',
  'me',
  'much',
  'of',
  'on',
  'or',
  'our',
  'please',
  'price',
  'product',
  'products',
  'recommend',
  'sale',
  'search',
  'show',
  'similar',
  'size',
  'sizes',
  'spec',
  'specs',
  'stock',
  'suggest',
  'tell',
  'that',
  'the',
  'them',
  'there',
  'this',
  'to',
  'us',
  'what',
  'which',
  'with',
  'you'
]);

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value = '') {
  return normalizeText(value)
    .split(' ')
    .filter(Boolean);
}

function uniqueQuestions(items = []) {
  const seen = new Set();

  return items.filter((item) => {
    const key = item.question;

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function buildResponse({
  reply,
  source = 'faq',
  sourceUrl = null,
  faqQuestion = null,
  suggestions = GENERAL_SUGGESTIONS
}) {
  return {
    messageId: crypto.randomUUID(),
    reply,
    source,
    sourceUrl,
    faqQuestion,
    suggestions: uniqueQuestions(suggestions).slice(0, 3),
    timestamp: new Date().toISOString()
  };
}

function categoryLabel(category) {
  return titleCase(category || '');
}

function detectCategory(message) {
  const normalized = normalizeText(message);

  for (const category of categories) {
    const slug = normalizeText(category.slug);
    const title = normalizeText(category.title);
    const possessive = title.endsWith('s') ? `${title}` : `${title} s`;

    if (
      normalized.includes(slug) ||
      normalized.includes(title) ||
      normalized.includes(`${title} collection`) ||
      normalized.includes(`${title} category`) ||
      normalized.includes(possessive)
    ) {
      return category.slug;
    }
  }

  return null;
}

function getCategoryProducts(products, category) {
  return products.filter((product) => normalizeText(product.category) === normalizeText(category));
}

async function fetchCatalogProducts() {
  const url = new URL(`${BACKEND_API_BASE_URL}/products`);
  url.searchParams.set('limit', '100');
  url.searchParams.set('page', '1');

  const response = await fetch(url.toString(), {
    cache: 'no-store'
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Unable to load products');
  }

  return Array.isArray(data.products) ? data.products : [];
}

function exactProductMatches(message, products) {
  const normalizedMessage = normalizeText(message);

  return products.filter((product) =>
    normalizedMessage.includes(normalizeText(product.name))
  );
}

function tokenProductMatches(message, products) {
  const queryTokens = tokenize(message).filter((token) => !PRODUCT_QUERY_WORDS.has(token));

  if (queryTokens.length === 0) {
    return [];
  }

  return products
    .map((product) => {
      const nameTokens = tokenize(product.name);
      const score = queryTokens.reduce((total, token) => {
        return total + (nameTokens.includes(token) ? 1 : 0);
      }, 0);

      return { product, score };
    })
    .filter(({ score }) => score >= Math.min(2, queryTokens.length))
    .sort((left, right) => right.score - left.score)
    .map(({ product }) => product);
}

function findContextProduct(conversationHistory, products) {
  const recentMessages = [...(conversationHistory || [])]
    .reverse()
    .map((entry) => entry?.content || '');

  for (const entry of recentMessages) {
    const matches = exactProductMatches(entry, products);

    if (matches.length > 0) {
      return matches[0];
    }
  }
  return null;
}

function findProductMatches(message, conversationHistory, products) {
  const exactMatches = exactProductMatches(message, products);

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  const tokenMatches = tokenProductMatches(message, products);

  if (tokenMatches.length > 0) {
    return tokenMatches;
  }

  const contextProduct = findContextProduct(conversationHistory, products);

  return contextProduct ? [contextProduct] : [];
}

function isGreeting(message) {
  return /^(hi|hello|hey|good morning|good evening|good afternoon)\b/.test(
    normalizeText(message)
  );
}

function isAboutWebsiteQuestion(message) {
  const normalized = normalizeText(message);

  if (
    normalized.includes('about northstitch') ||
    normalized.includes('what is northstitch') ||
    normalized.includes('about the store') ||
    normalized.includes('about your store') ||
    normalized.includes('about your website') ||
    normalized.includes('about the website') ||
    normalized.includes('what is this website') ||
    normalized.includes('what is your website') ||
    normalized.includes('tell me about your website') ||
    normalized.includes('tell me about the website') ||
    normalized.includes('tell me about the store')
  ) {
    return true;
  }

  return (
    normalized.includes('website') &&
    (normalized.includes('about') || normalized.includes('what does it'))
  );
}

function isProductIntent(message, matches, category) {
  const normalized = normalizeText(message);
  const hasProductKeyword =
    /\b(product|products|item|items|catalog|collection|collections|price|cost|stock|available|availability|size|sizes|fit|compare|comparison|recommend|suggest|similar|buy)\b/.test(
      normalized
    );
  const hasProductReference =
    matches.length > 0 ||
    Boolean(category) ||
    /\b(this one|that one|it|its)\b/.test(normalized);

  if (isAboutWebsiteQuestion(message)) {
    return false;
  }

  return hasProductKeyword || hasProductReference;
}

function isWebsiteRelated(message, products) {
  const normalized = normalizeText(message);

  if (isGreeting(message)) {
    return true;
  }

  const websiteKeywords = [
    'northstitch',
    'shipping',
    'delivery',
    'return',
    'refund',
    'exchange',
    'size',
    'payment',
    'checkout',
    'account',
    'order',
    'support',
    'contact',
    'category',
    'collection',
    'price',
    'stock',
    'available',
    'discount',
    'offer',
    'product',
    'products',
    'cart',
    'shop',
    'store'
  ];

  if (websiteKeywords.some((keyword) => normalized.includes(keyword))) {
    return true;
  }

  if (detectCategory(message)) {
    return true;
  }

  return findProductMatches(message, [], products).length > 0;
}

function getFaqAnswer(message) {
  const normalized = normalizeText(message);

  if (
    normalized.includes('shipping') ||
    normalized.includes('delivery') ||
    normalized.includes('how long') ||
    normalized.includes('arrive')
  ) {
    return {
      question: faqItems[0].question,
      answer: faqItems[0].answer,
      sourceUrl: '/faq',
      suggestions: [{ question: 'What is the return policy?' }, { question: 'How can I contact support?' }]
    };
  }

  if (
    normalized.includes('guest checkout') ||
    normalized.includes('without creating an account') ||
    normalized.includes('without an account') ||
    normalized.includes('create an account') ||
    normalized.includes('sign up')
  ) {
    return {
      question: faqItems[1].question,
      answer: faqItems[1].answer,
      sourceUrl: '/faq',
      suggestions: [{ question: 'What payment methods are supported?' }, { question: 'How long does shipping take?' }]
    };
  }

  if (
    normalized.includes('size') ||
    normalized.includes('fit') ||
    normalized.includes('measurement')
  ) {
    const sizeLine = sizeGuideRows
      .map((row) => `${row.size}: chest ${row.chest}, waist ${row.waist}, hips ${row.hips}`)
      .join('; ');

    return {
      question: faqItems[2].question,
      answer: `${faqItems[2].answer} Current guide: ${sizeLine}.`,
      sourceUrl: '/size-guide',
      suggestions: [{ question: 'Can you recommend a few products?' }, { question: 'What is the return policy?' }]
    };
  }

  if (
    normalized.includes('payment') ||
    normalized.includes('pay') ||
    normalized.includes('card') ||
    normalized.includes('upi')
  ) {
    return {
      question: faqItems[3].question,
      answer: faqItems[3].answer,
      sourceUrl: '/faq',
      suggestions: [{ question: 'Can I place an order without creating an account?' }]
    };
  }

  return null;
}

function getPolicyAnswer(message) {
  const normalized = normalizeText(message);

  if (
    normalized.includes('return') ||
    normalized.includes('refund') ||
    normalized.includes('exchange')
  ) {
    return buildResponse({
      reply:
        'Customers may request a return within 14 days of delivery for unworn items with original tags attached. Returned items should be clean, undamaged, and packaged safely. You can request a return through the contact page or by emailing support.',
      sourceUrl: '/returns-policy',
      faqQuestion: 'What is the return policy?',
      suggestions: [{ question: 'How can I contact support?' }, { question: 'How long does shipping take?' }]
    });
  }

  if (
    normalized.includes('contact') ||
    normalized.includes('email') ||
    normalized.includes('phone') ||
    normalized.includes('address') ||
    normalized.includes('call')
  ) {
    return buildResponse({
      reply: `You can reach ${SITE_NAME} at ${CONTACT_DETAILS.email}, ${CONTACT_DETAILS.phone}, or visit ${CONTACT_DETAILS.address}.`,
      sourceUrl: '/contact',
      faqQuestion: 'How can I contact support?',
      suggestions: [{ question: 'What is the return policy?' }, { question: 'How long does shipping take?' }]
    });
  }

  if (normalized.includes('order status') || normalized.includes('track my order') || normalized.includes('tracking')) {
    return buildResponse({
      reply: `I can help with store information, but I can't see live order-tracking details from the current website data. For a specific order update, please contact ${CONTACT_DETAILS.email} or call ${CONTACT_DETAILS.phone}.`,
      sourceUrl: '/contact',
      faqQuestion: 'How can I contact support?',
      suggestions: [{ question: 'How long does shipping take?' }, { question: 'What is the return policy?' }]
    });
  }

  if (
    normalized.includes('discount') ||
    normalized.includes('offer') ||
    normalized.includes('coupon') ||
    normalized.includes('promo')
  ) {
    return buildResponse({
      reply:
        "I couldn't find a confirmed discount, coupon, or live promotion in the current website data. Please check the product page or cart for any active offers, and I can help you compare similar items if you want.",
      source: 'ai',
      suggestions: [{ question: 'Can you recommend a few products?' }, { question: 'What categories are available?' }]
    });
  }

  return null;
}

function buildCategoryRangeReply(products, category) {
  const categoryProducts = getCategoryProducts(products, category);

  if (categoryProducts.length === 0) {
    return null;
  }

  const prices = categoryProducts.map((product) => Number(product.price || 0));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return `${categoryLabel(category)} products in the current catalog range from ${formatCurrency(minPrice)} to ${formatCurrency(maxPrice)}.`;
}

function buildProductSummary(product) {
  return `${product.name} is in the ${categoryLabel(product.category)} collection. It is priced at ${formatCurrency(product.price)}, available in ${(product.sizes || ['ONE SIZE']).join(', ')}, and currently shows ${product.stock} in stock. ${product.description}`;
}

function getProductSuggestions(product, products) {
  const similarProducts = getCategoryProducts(products, product.category)
    .filter((item) => String(item.id) !== String(product.id))
    .slice(0, 3);

  const suggestions = similarProducts.map((item) => ({
    question: `Tell me about ${item.name}.`
  }));

  if (suggestions.length === 0) {
    suggestions.push({ question: 'What categories are available?' });
  }

  return suggestions;
}

function compareProducts(productsToCompare) {
  return productsToCompare
    .map(
      (product) =>
        `${product.name}: ${formatCurrency(product.price)}, ${categoryLabel(product.category)}, sizes ${(product.sizes || ['ONE SIZE']).join(', ')}, stock ${product.stock}.`
    )
    .join(' ');
}

function getProductAnswer(message, conversationHistory, products) {
  const normalized = normalizeText(message);
  const category = detectCategory(message);
  const matches = findProductMatches(message, conversationHistory, products);
  const asksForComparison = /\b(compare|comparison|vs|versus|difference)\b/.test(normalized);
  const asksForPrice = /\b(price|cost|how much)\b/.test(normalized);
  const asksForAvailability = /\b(stock|available|availability|in stock)\b/.test(normalized);
  const asksForSizes = /\b(size|sizes|fit)\b/.test(normalized);
  const asksForDescription = /\b(tell me|about|details|description|spec|specs|material)\b/.test(normalized);
  const asksForRecommendation = /\b(recommend|suggest|best|similar)\b/.test(normalized);
  const productIntent = isProductIntent(message, matches, category);

  if (!productIntent) {
    return null;
  }

  if (asksForComparison && matches.length >= 2) {
    return buildResponse({
      reply: `Here's a quick comparison: ${compareProducts(matches.slice(0, 2))}`,
      sourceUrl: `/shop/${matches[0].category}`,
      faqQuestion: 'Product comparison',
      suggestions: matches.slice(0, 2).map((product) => ({
        question: `What is the price of ${product.name}?`
      }))
    });
  }

  if (matches.length > 0) {
    const product = matches[0];

    if (asksForPrice) {
      return buildResponse({
        reply: `${product.name} is currently listed at ${formatCurrency(product.price)}.`,
        sourceUrl: `/product/${product.id}`,
        faqQuestion: `What is the price of ${product.name}?`,
        suggestions: getProductSuggestions(product, products)
      });
    }

    if (asksForAvailability) {
      return buildResponse({
        reply: `${product.name} currently shows ${product.stock} in stock.`,
        sourceUrl: `/product/${product.id}`,
        faqQuestion: `Is ${product.name} available?`,
        suggestions: [
          { question: `What sizes are available for ${product.name}?` },
          { question: `Tell me about ${product.name}.` }
        ]
      });
    }

    if (asksForSizes) {
      return buildResponse({
        reply: `${product.name} is available in ${(product.sizes || ['ONE SIZE']).join(', ')}.`,
        sourceUrl: `/product/${product.id}`,
        faqQuestion: `What sizes are available for ${product.name}?`,
        suggestions: getProductSuggestions(product, products)
      });
    }

    if (asksForDescription || normalized.includes(product.name.toLowerCase())) {
      return buildResponse({
        reply: buildProductSummary(product),
        sourceUrl: `/product/${product.id}`,
        faqQuestion: `Tell me about ${product.name}.`,
        suggestions: getProductSuggestions(product, products)
      });
    }
  }

  if (category && (asksForRecommendation || normalized.includes('products') || normalized.includes('collection'))) {
    const categoryProducts = getCategoryProducts(products, category).slice(0, 4);

    if (categoryProducts.length > 0) {
      return buildResponse({
        reply: `Here are a few ${categoryLabel(category)} picks from the current catalog: ${categoryProducts
          .map((product) => `${product.name} (${formatCurrency(product.price)})`)
          .join(', ')}.`,
        sourceUrl: `/${category}`,
        faqQuestion: `What products are available in the ${categoryLabel(category)} collection?`,
        suggestions: categoryProducts.slice(0, 3).map((product) => ({
          question: `Tell me about ${product.name}.`
        }))
      });
    }
  }

  if (asksForRecommendation) {
    const picks = products.slice(0, 4);

    return buildResponse({
      reply: `A few good starting points are ${picks
        .map((product) => `${product.name} (${formatCurrency(product.price)})`)
        .join(', ')}. If you want, I can narrow that down by category, size, or budget.`,
      sourceUrl: '/shop',
      faqQuestion: 'Can you recommend a few products?',
      suggestions: [{ question: 'What categories are available?' }, { question: 'Show me some women products.' }]
    });
  }

  if (asksForPrice && category) {
    const rangeReply = buildCategoryRangeReply(products, category);

    if (rangeReply) {
      return buildResponse({
        reply: `${rangeReply} If you want, I can also suggest a few specific ${categoryLabel(category)} items.`,
        sourceUrl: `/${category}`,
        source: 'ai',
        suggestions: [{ question: `What products are available in the ${categoryLabel(category)} collection?` }]
      });
    }
  }

  if (asksForPrice || asksForDescription || asksForAvailability || asksForSizes) {
    if (normalized.includes('shoe') || normalized.includes('shoes') || normalized.includes('nike')) {
      return buildResponse({
        reply:
          "I couldn't find that exact item in the current NorthStitch catalog. This store currently focuses on clothing and accessories rather than branded shoes. I can help you explore jackets, dresses, kidswear, or accessories available on the website.",
        source: 'ai',
        sourceUrl: '/shop',
        suggestions: [{ question: 'What categories are available?' }, { question: 'Can you recommend a few products?' }]
      });
    }

    return buildResponse({
      reply:
        "I couldn't find that exact product in the current catalog, but I can help you explore similar items available on the website by category, size, or budget.",
      source: 'ai',
      sourceUrl: '/shop',
      suggestions: [{ question: 'What categories are available?' }, { question: 'Can you recommend a few products?' }]
    });
  }

  return null;
}

function getStoreAnswer(message) {
  const normalized = normalizeText(message);

  if (isGreeting(message)) {
    return buildResponse({
      reply:
        'Hi! I can help with NorthStitch products, pricing, sizing, shipping, returns, and other store questions.',
      source: 'ai',
      suggestions: QUICK_REPLIES.slice(0, 3).map(({ question }) => ({ question }))
    });
  }

  if (
    normalized.includes('what categories') ||
    normalized.includes('collections') ||
    normalized.includes('categories available')
  ) {
    return buildResponse({
      reply: `NorthStitch currently has four main collections: ${categories
        .map((category) => category.title)
        .join(', ')}.`,
      sourceUrl: '/shop',
      faqQuestion: 'What categories are available?',
      suggestions: categories.slice(0, 3).map((category) => ({
        question: `What products are available in the ${category.title} collection?`
      }))
    });
  }

  if (isAboutWebsiteQuestion(message)) {
    return buildResponse({
      reply:
        'NorthStitch is a modern clothing store with Men, Women, Kids, and Accessories collections. The website helps customers browse products, check prices and sizes, use guest checkout or optional accounts, and get support for shipping, returns, and contact information.',
      sourceUrl: '/about',
      source: 'ai',
      suggestions: [{ question: 'What categories are available?' }, { question: 'Can I place an order without creating an account?' }]
    });
  }

  return null;
}

function buildFallbackPrompt(message, conversationHistory = []) {
  const historySummary = conversationHistory
    .slice(-6)
    .map((entry) => `${entry.role === 'assistant' ? 'Assistant' : 'User'}: ${entry.content}`)
    .join('\n');

  return [
    `You are the customer support assistant for ${SITE_NAME}, a clothing store website.`,
    'Business context: Men, Women, Kids, and Accessories collections; guest checkout is available; account signup is optional; standard shipping is 3 to 7 business days with about 24 hours processing time; returns can be requested within 14 days of delivery for unworn items with original tags; support contact is support@northstitch.com and +1 (555) 240-1122.',
    'Behavior rules:',
    '- Answer only about the website, its products, services, orders, pricing, shipping, returns, contact details, and related store topics.',
    '- If exact facts are not confirmed in the provided context, be honest and say that the exact detail is not currently available.',
    '- Never invent discounts, order details, policies, stock, or payment methods.',
    '- Keep the response friendly, professional, clear, and concise.',
    historySummary ? `Conversation so far:\n${historySummary}` : '',
    `Current user question: ${message}`
  ]
    .filter(Boolean)
    .join('\n\n');
}

async function fetchRemoteFallback({ message, conversationHistory, siteOrigin, pageUrl }) {
  const response = await fetch(`${REMOTE_CHATBOT_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: buildFallbackPrompt(message, conversationHistory),
      sessionId: `fallback-${crypto.randomUUID()}`,
      appId: process.env.NEXT_PUBLIC_CHATBOT_APP_ID || 'northstitch-clothing-store',
      conversationHistory: conversationHistory || [],
      siteOrigin,
      pageUrl
    }),
    cache: 'no-store'
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Fallback chat request failed');
  }

  return buildResponse({
    reply:
      typeof data.reply === 'string' && data.reply.trim()
        ? data.reply.trim()
        : "I couldn't find an exact answer in the current website data, but I can still help you browse products, shipping, returns, or sizing information.",
    source: 'ai',
    sourceUrl: data.sourceUrl || null,
    suggestions: Array.isArray(data.suggestions) ? data.suggestions : GENERAL_SUGGESTIONS
  });
}

export function getQuickReplies() {
  return QUICK_REPLIES;
}

export async function getChatReply({
  message,
  conversationHistory = [],
  siteOrigin = '',
  pageUrl = ''
}) {
  const trimmedMessage = String(message || '').trim();

  if (!trimmedMessage) {
    return buildResponse({
      reply: 'Please send a question about NorthStitch products, orders, shipping, returns, or support.',
      source: 'ai'
    });
  }

  let products = [];

  try {
    products = await fetchCatalogProducts();
  } catch {
    products = [];
  }

  const localAnswer =
    getFaqAnswer(trimmedMessage) ||
    getPolicyAnswer(trimmedMessage) ||
    getStoreAnswer(trimmedMessage) ||
    getProductAnswer(trimmedMessage, conversationHistory, products);

  if (localAnswer) {
    return localAnswer.answer
      ? buildResponse({
          reply: localAnswer.answer,
          sourceUrl: localAnswer.sourceUrl,
          faqQuestion: localAnswer.question,
          suggestions: localAnswer.suggestions
        })
      : localAnswer;
  }

  if (!isWebsiteRelated(trimmedMessage, products)) {
    return buildResponse({
      reply:
        'I can help with NorthStitch products, pricing, sizing, shipping, returns, support, and other store-related questions.',
      source: 'ai',
      suggestions: QUICK_REPLIES.slice(0, 3).map(({ question }) => ({ question }))
    });
  }

  try {
    return await fetchRemoteFallback({
      message: trimmedMessage,
      conversationHistory,
      siteOrigin,
      pageUrl
    });
  } catch {
    return buildResponse({
      reply: `I couldn't find an exact answer in the website data right now. For direct help, please contact ${CONTACT_DETAILS.email} or call ${CONTACT_DETAILS.phone}.`,
      source: 'ai',
      sourceUrl: '/contact',
      suggestions: [{ question: 'How can I contact support?' }, { question: 'What is the return policy?' }]
    });
  }
}

export async function proxyEscalation(payload) {
  const response = await fetch(`${REMOTE_CHATBOT_URL}/api/escalate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    cache: 'no-store'
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Escalation request failed');
  }

  return data;
}
