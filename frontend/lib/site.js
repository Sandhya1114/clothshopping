export const categories = [
  {
    slug: 'men',
    title: 'Men',
    description: 'Sharply layered essentials built for clean weekday polish and easy weekend texture.',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    accent: 'Copper'
  },
  {
    slug: 'women',
    title: 'Women',
    description: 'Fluid silhouettes, tailored separates, and statement pieces with quiet confidence.',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    accent: 'Blush'
  },
  {
    slug: 'kids',
    title: 'Kids',
    description: 'Play-ready layers and soft staples made for movement, color, and comfort.',
    image:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80',
    accent: 'Sky'
  },
  {
    slug: 'accessories',
    title: 'Accessories',
    description: 'The finishing details that pull an outfit together without trying too hard.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    accent: 'Stone'
  }
];

export const valuePoints = [
  {
    title: 'Thoughtful Collections',
    text: 'Capsule-minded drops with strong silhouettes, practical fabrics, and styling range.'
  },
  {
    title: 'Flexible Checkout',
    text: 'Fast ordering with guest checkout by default, plus optional accounts for returning shoppers.'
  },
  {
    title: 'Curated Everyday Quality',
    text: 'Pieces selected for repeat wear, from polished outerwear to soft daily essentials.'
  }
];

export const faqItems = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping usually arrives in 3 to 7 business days. Processing time is typically 24 hours.'
  },
  {
    question: 'Can I place an order without creating an account?',
    answer: 'Yes. Guest checkout still works, and account signup is optional if you want a faster returning-customer flow.'
  },
  {
    question: 'How do I choose the right size?',
    answer: 'Use the size guide page for a quick reference chart, then compare it with the size options shown on each product.'
  },
  {
    question: 'What payment methods are supported?',
    answer: 'This starter focuses on order capture and guest checkout flow. You can connect your preferred payment gateway next.'
  }
];

export const sizeGuideRows = [
  { size: 'XS', chest: '32-34', waist: '26-28', hips: '34-36' },
  { size: 'S', chest: '34-36', waist: '28-30', hips: '36-38' },
  { size: 'M', chest: '36-39', waist: '30-33', hips: '38-41' },
  { size: 'L', chest: '39-42', waist: '33-36', hips: '41-44' },
  { size: 'XL', chest: '42-45', waist: '36-39', hips: '44-47' }
];

export const blogPosts = [
  {
    slug: 'building-a-capsule-wardrobe',
    title: 'Building a Capsule Wardrobe That Still Feels Personal',
    date: 'April 29, 2026',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'A practical approach to fewer pieces, better combinations, and stronger daily style decisions.',
    paragraphs: [
      'A strong capsule wardrobe is less about owning less and more about owning better combinations. Start with a palette you naturally reach for, then layer in texture and shape rather than random color.',
      'The easiest way to keep things personal is to choose one signature element. That could be structured outerwear, wide-leg trousers, bold accessories, or soft monochrome layering.',
      'When every item pairs with at least three others, your wardrobe becomes calmer, faster to use, and more expressive at the same time.'
    ]
  },
  {
    slug: 'styling-light-layers-for-transition-weather',
    title: 'Styling Light Layers for Transition Weather',
    date: 'April 22, 2026',
    image:
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'The easiest way to dress for shifting mornings, warm afternoons, and cooler evenings.',
    paragraphs: [
      'Transition dressing works best when every layer can stand on its own. Begin with a breathable base, add one piece with structure, and finish with a flexible outer layer.',
      'Instead of bulky combinations, think in weight contrast. A crisp shirt under a soft knit or a light jacket over a fitted tee creates shape without overheating.',
      'Accessories matter here. A scarf, cap, or tote can make a functional look feel intentionally styled.'
    ]
  }
];

export const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/account', label: 'Account' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' }
];

export const footerGroups = [
  {
    title: 'Shop',
    links: [
      { href: '/men', label: 'Men' },
      { href: '/women', label: 'Women' },
      { href: '/kids', label: 'Kids' },
      { href: '/accessories', label: 'Accessories' }
    ]
  },
  {
    title: 'Support',
    links: [
      { href: '/faq', label: 'FAQ' },
      { href: '/returns-policy', label: 'Returns Policy' },
      { href: '/size-guide', label: 'Size Guide' },
      { href: '/contact', label: 'Contact' }
    ]
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/terms', label: 'Terms' },
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/blog', label: 'Journal' }
    ]
  }
];
