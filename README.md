# Foody — Resto App

A full-featured restaurant ordering web app built with Next.js. Users can browse restaurants, filter and search by category/price/rating/distance, view menus and reviews, manage a cart, check out with multiple payment methods, and track order history.

**Live Demo:** [resto-app-by-yusuf-ar.vercel.app](https://resto-app-by-yusuf-ar.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

## Screenshots

|                                     Login                                     |                                     Home                                     |                                         Filter & Category                                          |
| :----------------------------------------------------------------------------: | :---------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: |
| ![Login](docs/screenshots/01-login.png) | ![Home](docs/screenshots/02-home.png) | ![Filter & Category](docs/screenshots/03-category-filter.png) |

|                                       Restaurant Detail                                       |                                    Cart                                    |                                     Checkout                                     |
| :---------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: |
| ![Restaurant Detail](docs/screenshots/04-restaurant-detail.png) | ![Cart](docs/screenshots/05-cart.png) | ![Checkout](docs/screenshots/06-checkout.png) |

|                                      Payment Success                                      |                                   My Orders                                    |
| :-------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
| ![Payment Success](docs/screenshots/07-payment-success.png) | ![My Orders](docs/screenshots/08-my-orders.png) |

## Features

- **Auth** — register/login with token-based session, protected routes (cart, checkout, profile, orders) redirect to login when unauthenticated.
- **Browse & Discover** — home feed with recommended, best-seller and category sections; search by name.
- **Filter** — by category, price range, rating, and distance, synced to the URL so results stay shareable and survive a refresh.
- **Restaurant Detail** — menu grouped by food/drink, ratings, reviews, and a quantity stepper that stays in sync with the server cart.
- **Cart** — items grouped per restaurant, live quantity/price updates via TanStack Query.
- **Checkout** — delivery address, payment method selection, and an order summary with delivery/service fees.
- **Order History** — filterable by status (preparing, on the way, delivered, done, cancelled), with the ability to leave a review after delivery.
- **Profile** — update name, phone, avatar, and delivery address.

## Tech Stack

| Layer               | Tools                                       |
| ------------------- | -------------------------------------------- |
| Framework           | Next.js 15 (App Router)                      |
| Language            | TypeScript                                   |
| Server state        | TanStack Query                               |
| Client/UI state     | Zustand                                      |
| Forms & validation  | React Hook Form + Zod                        |
| HTTP client         | Axios                                        |
| UI primitives       | Radix UI                                     |
| Styling             | Tailwind CSS                                 |
| Animation           | Framer Motion                                |

## Getting Started

### Prerequisites

- Node.js 18.18+
- npm

### Installation

```bash
git clone https://github.com/Yusuf-98/Resto-App-by-Yusuf-AR.git
cd Resto-App-by-Yusuf-AR
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the API base URL:

```bash
cp .env.example .env.local
```

| Variable                     | Description                          |
| ----------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`   | Base URL of the backend REST API      |

### Run

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run start    # run the production build
npm run lint     # run ESLint
```

## API

This app consumes a REST API for restaurants, cart, orders, reviews, and auth. See the [Swagger docs](https://be-restaurant-production.up.railway.app/api-swagger/) for the full contract.

## License

Licensed under the [MIT License](LICENSE).
