# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` or `ng serve` - Start dev server at http://localhost:4200
- `npm run build` or `ng build` - Production build to `dist/`
- `npm test` or `ng test` - Run unit tests with Vitest
- `ng generate component <name>` - Generate new component

## Architecture

Angular 21 application using **NgModule-based architecture** (not standalone components). All components, directives, and pipes must be declared in `AppModule`.

### Project Structure
```
src/app/
├── app-module.ts           # Root NgModule with declarations
├── app-routing-module.ts   # Route configuration
├── components/             # All UI components
│   ├── app/               # Root App component
│   ├── home/              # Home page
│   ├── list/              # Demo list component
│   ├── profile/           # Profile page
│   └── products/          # Products catalog
│       ├── fruits/        # Fruits category
│       ├── vegetables/    # Vegetables category
│       ├── meat/          # Meat category
│       └── dairy/         # Dairy category
├── models/                 # TypeScript interfaces
│   └── product.model.ts   # Product interface
└── services/              # Angular services
    └── product.service.ts # Product data & business logic
```

### Key Files
- `src/main.ts` - Bootstrap entry point using `platformBrowser().bootstrapModule()`
- `src/app/app-module.ts` - Root module with all component declarations
- `src/app/app-routing-module.ts` - Route configuration
- `src/app/models/product.model.ts` - Product data model interface
- `src/app/services/product.service.ts` - Centralized product service

### Routing Structure
- `/home` - Home page (default)
- `/list` - List component
- `/profile` - Profile component
- `/products` - Products with nested child routes:
  - `/products/fruits` (default child)
  - `/products/vegetables`
  - `/products/meat`
  - `/products/dairy`

### Data Model
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: 'fruits' | 'vegetables' | 'meat' | 'dairy';
}
```

### ProductService API
- `getProductsByCategory(category)` - Get products for a category
- `getLowStockProducts()` - Get products with stock <= 10
- `getTotalInventoryValue()` - Calculate total inventory value
- `getStockStatus(product)` - Returns 'in-stock' | 'low-stock' | 'out-of-stock'

### Styling
- SCSS for component styles (configured in `angular.json`)
- Tailwind CSS available via `src/styles.scss`
- Prettier configured with single quotes and Angular HTML parser

### Component Naming
Components use simplified names without "Component" suffix (e.g., `Home`, `List`, `Products`).
