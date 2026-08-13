# Humaira's Collection — GitHub-ready E-commerce

A responsive frontend prototype with a customer storefront and admin panel. It is intentionally **backend/database-ready**: the frontend currently uses localStorage so it works immediately on GitHub Pages, while `data/schema.sql` provides a PostgreSQL/Supabase-compatible schema for the next production step.

## Project

```text
humairas_collection_complete/
├── index.html
├── admin.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── admin.js
├── data/
│   ├── products.json
│   ├── orders.json
│   ├── categories.json
│   └── schema.sql
├── assets/
│   └── images/
├── docs/
│   └── API.md
└── README.md
```

## Current features

### Customer
- Search
- Category filtering
- Featured products
- Flash sale
- Offers
- Pre-order
- MRP / selling price / automatic discount
- Wishlist UI
- Cart drawer
- Quantity controls
- localStorage cart persistence
- Checkout-ready button

### Admin
- Dashboard
- Product CRUD using localStorage
- Add/Edit/Delete product
- MRP / selling price / discount
- Stock
- Featured / New Arrival / Flash Sale / Pre-order
- Product search
- Order table

## GitHub Pages

1. Create a GitHub repository.
2. Upload the project files.
3. Commit to `main`.
4. Open **Settings → Pages**.
5. Choose **Deploy from a branch**.
6. Select `main` and `/ (root)`.
7. Save.

The storefront will be available at:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

## Important

GitHub Pages is static hosting. It cannot safely run a real database, admin authentication, payment gateway, or server-side order validation by itself.

For production, connect this frontend to Supabase/Firebase or a custom backend. The SQL schema and API plan are included for that migration.
