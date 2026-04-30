# NorthStitch Clothing Store

Full-stack eCommerce clothing website built with:

- `frontend`: Next.js App Router, JavaScript, CSS
- `backend`: Node.js, Express.js REST API
- `database`: Supabase PostgreSQL
- `auth`: Custom email/password auth with Express, JWT, and Supabase user storage

## Folder Structure

```text
ClothingWebsite/
├── backend/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   ├── package.json
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   └── lib/
├── supabase/
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

## Features

- Responsive home page with hero, featured products, and category preview
- Shop page with search, category filter, size filter, price filter, sorting, and pagination
- Category landing pages for Men, Women, Kids, and Accessories
- Dynamic product detail pages
- Cart stored in `localStorage`
- Guest checkout form with order summary
- Login, signup, logout, and account page
- Order save flow to Supabase through Express
- About, Contact, FAQ, Terms, Privacy, Returns, Size Guide, Blog, and custom 404 pages

## API Endpoints

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/orders`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Supported Product Query Params

- `search`
- `category`
- `size`
- `minPrice`
- `maxPrice`
- `sort`
- `page`
- `limit`

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run [supabase/schema.sql](/d:/ClothingWebsite/supabase/schema.sql).
4. Run [supabase/seed.sql](/d:/ClothingWebsite/supabase/seed.sql).
5. Run [supabase/seed-more-products.sql](/d:/ClothingWebsite/supabase/seed-more-products.sql) if you want the expanded 40-product catalog.

If you already created the original database before auth was added:

1. Open the SQL editor.
2. Run [supabase/add-users-table.sql](/d:/ClothingWebsite/supabase/add-users-table.sql).

Note:
To support the required size filter, the `products` table includes a `sizes text[]` column in addition to the fields you listed.

## Environment Variables

### Backend

Copy [backend/.env.example](/d:/ClothingWebsite/backend/.env.example) to `backend/.env` and fill in:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=replace-with-a-long-random-secret
```

### Frontend

Copy [frontend/.env.example](/d:/ClothingWebsite/frontend/.env.example) to `frontend/.env`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

## Run Locally

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Start the backend:

```bash
cd backend
npm run dev
```

4. Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

5. Open `http://localhost:3000`.

## Key Frontend Files

- [frontend/app/page.js](/d:/ClothingWebsite/frontend/app/page.js)
- [frontend/app/shop/page.js](/d:/ClothingWebsite/frontend/app/shop/page.js)
- [frontend/app/product/[id]/page.js](/d:/ClothingWebsite/frontend/app/product/[id]/page.js)
- [frontend/context/CartContext.js](/d:/ClothingWebsite/frontend/context/CartContext.js)
- [frontend/context/AuthContext.js](/d:/ClothingWebsite/frontend/context/AuthContext.js)
- [frontend/components/shop/ShopClient.js](/d:/ClothingWebsite/frontend/components/shop/ShopClient.js)
- [frontend/components/checkout/CheckoutClient.js](/d:/ClothingWebsite/frontend/components/checkout/CheckoutClient.js)
- [frontend/components/auth/AuthForm.js](/d:/ClothingWebsite/frontend/components/auth/AuthForm.js)
- [frontend/app/globals.css](/d:/ClothingWebsite/frontend/app/globals.css)

## Key Backend Files

- [backend/src/app.js](/d:/ClothingWebsite/backend/src/app.js)
- [backend/src/routes/authRoutes.js](/d:/ClothingWebsite/backend/src/routes/authRoutes.js)
- [backend/src/services/authService.js](/d:/ClothingWebsite/backend/src/services/authService.js)
- [backend/src/services/productService.js](/d:/ClothingWebsite/backend/src/services/productService.js)
- [backend/src/services/orderService.js](/d:/ClothingWebsite/backend/src/services/orderService.js)
- [backend/src/config/supabase.js](/d:/ClothingWebsite/backend/src/config/supabase.js)

## Next Steps You Can Add

- Payment gateway integration
- Admin dashboard
- Inventory management
- CMS-backed content
- Order status tracking
