# Quick Shop - React Native E-commerce App

A mobile-first e-commerce app built with React Native and Expo, featuring a clean architecture and modern development practices.

## 🛠️ Technologies Used

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe development
- **NativeWind** - Tailwind CSS for React Native
- **TanStack Query** - Server state management
- **Expo Router** - File-based navigation
- **Zod** - Runtime type validation
- **Lucide React Native** - Icon library

## 📁 Project Structure

```
src/
├── app/                 # Expo Router file-based routing
│   ├── (tabs)/         # Tab-based navigation
│   ├── products/       # Product pages
│   └── debug/          # Development tools
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── header/         # Header-specific components
│   └── home-page/      # Home page components
├── features/            # Feature-based modules
│   ├── cart/           # Shopping cart functionality
│   ├── categories/     # Product categories
│   └── products/       # Product catalog
├── api/                # API client and endpoints
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── query/              # TanStack Query configuration
├── layout/             # Layout components
├── context/            # React contexts
├── types/              # Global TypeScript definitions
└── utils/              # Utility functions
```

## 🔄 API Integration

The project uses the WooCommerce REST API for:

- Product listings with pagination and filtering
- Category management and navigation
- Shopping cart operations
- Product search functionality

## 🧱 Architecture

- **Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: TanStack Query for server state
- **Navigation**: Expo Router (file-based routing)
- **Type Safety**: TypeScript throughout
- **UI Components**: Custom components with shadcn/ui patterns
- **Backend**: WordPress + WooCommerce (headless)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Expo CLI (`npm install -g @expo/cli`)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/quick-shop.git
cd quick-shop
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure environment variables:

Create a `.env` file with your API credentials (see `.env.example` for reference).

### Development

Start the development server:

```bash
pnpm dev
```

For specific platforms:

```bash
# Android
pnpm android

# iOS
pnpm ios

# Web
pnpm web
```

## 📱 Features

### ✅ **Implemented**

- **Product Catalog**: Browse products with infinite scroll and filtering
- **Categories**: Hierarchical category navigation with expandable sections
- **Responsive Design**: Mobile-first with RTL support for Hebrew/Arabic
- **Offline Support**: Smart caching with TanStack Query
- **Performance**: Infinite scroll pagination and smart caching with TanStack Query
- **Debug Tools**: Built-in network diagnostics and debug screens

### 🚧 **In Development**

- **Shopping Cart**: Add/remove items with optimistic updates
- **Search**: Real-time product search functionality

### 🔮 **Planned Features**

- User authentication and profiles
- Order history and tracking
- Push notifications
- Payment integration
