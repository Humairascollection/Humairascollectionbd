# API-ready structure

Recommended production endpoints:

## Public

GET `/api/products`
GET `/api/products/:id`
GET `/api/categories`
GET `/api/offers`
GET `/api/flash-sales`

## Authentication

POST `/api/auth/register`
POST `/api/auth/login`
POST `/api/auth/logout`
GET `/api/auth/me`

## Customer

GET `/api/cart`
POST `/api/cart/items`
PUT `/api/cart/items/:id`
DELETE `/api/cart/items/:id`

GET `/api/wishlist`
POST `/api/wishlist`
DELETE `/api/wishlist/:productId`

POST `/api/coupons/apply`
POST `/api/orders`
GET `/api/orders`
GET `/api/orders/:id`

## Admin

GET `/api/admin/products`
POST `/api/admin/products`
PUT `/api/admin/products/:id`
DELETE `/api/admin/products/:id`

POST `/api/admin/products/:id/images`
DELETE `/api/admin/products/:id/images/:imageId`

GET `/api/admin/orders`
GET `/api/admin/orders/:id`
PUT `/api/admin/orders/:id/status`
PUT `/api/admin/orders/:id/payment`

POST `/api/admin/offers`
PUT `/api/admin/offers/:id`
DELETE `/api/admin/offers/:id`

POST `/api/admin/coupons`
PUT `/api/admin/coupons/:id`
DELETE `/api/admin/coupons/:id`

## Security

Never trust client-side price, discount, stock, coupon or total values. Recalculate and validate them on the backend before creating an order.

Admin routes must be protected by server-side role checks.
