# Digital Menu v2

A modern, real-time digital menu system built with React and Firebase. Customers can browse menus, place orders, and track order status in real-time. Restaurant staff can manage orders through an admin dashboard.

**Live Demo:** https://digital-menu-nine-fawn.vercel.app

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-29%20passing-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Firebase](https://img.shields.io/badge/Firebase-latest-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

### Customer Features
- Browse menu with categorized items (Coffee, Food, Desserts)
- Bilingual support (English/Finnish)
- Menu customization with sizes, extras, removals, and spice levels
- Real-time price calculation as you customize
- Shopping cart with quantity management
- Real-time order tracking with live updates
- QR code access - Scan table QR code for instant menu access
- Auto-filled table number from QR code
- Special offers and daily specials
- Estimated preparation times
- Mobile-responsive warm glassmorphism UI

### Admin Features
- Real-time order dashboard with auto-refresh
- Order status management (Received → Preparing → Ready)
- Order filtering by status (All, New, Cooking, Ready)
- Customization visibility for kitchen preparation
- QR code generator for tables (configurable 1-100 tables)
- Print & download QR codes (individual or bulk)
- Secure authentication with Firebase Auth
- Clean kitchen-focused interface
- Multi-device synchronization

## Tech Stack

- **Frontend**: React 19, React Router 6
- **Backend**: Firebase (Firestore, Authentication)
- **Build Tool**: Vite 7
- **Testing**: Vitest 3, React Testing Library
- **Code Quality**: ESLint 9, Prettier 3
- **Icons**: Lucide React
- **QR Codes**: qrcode.react
- **Deployment**: Vercel (Auto-deploy via CI/CD)
- **CI/CD**: GitHub Actions

## Project Structure

```
src/
├── pages/                  # Top-level page components
│   ├── App.jsx            # Customer menu page (/)
│   ├── AdminDashboard.jsx # Admin dashboard (/admin)
│   └── OrderStatus.jsx    # Order tracking (/status/:id)
├── components/
│   ├── customer/
│   │   ├── Cart/          # Shopping cart components
│   │   ├── Menu/          # Menu display components
│   │   └── Order/         # Order form and status
│   └── admin/
│       ├── Dashboard/     # Order management
│       └── Login/         # Admin authentication
├── hooks/                  # Custom React hooks
│   ├── useCart.js         # Shopping cart logic
│   ├── useLanguage.js     # i18n language management
│   ├── useAuth.js         # Firebase authentication
│   └── useOrders.js       # Order CRUD + real-time sync
├── data/
│   ├── menuData.json      # Menu items database
│   └── translations.json  # UI translations (EN/FI)
├── services/
│   └── firebase.js        # Firebase configuration
├── test/
│   └── setup.js           # Vitest configuration
└── main.jsx               # App entry point & routing
```

**📚 Documentation:**
- **[FILE_GUIDE.md](FILE_GUIDE.md)** - Quick reference for common tasks
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Detailed architecture guide
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Firebase configuration & troubleshooting
- **[CICD_SETUP.md](CICD_SETUP.md)** - CI/CD pipeline setup instructions

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase project

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd digital-menu-v2
```

2. Install dependencies
```bash
npm install
```

3. Configure Firebase
```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Launch interactive test UI
- `npm run test:run` - Run tests once (CI mode)
- `npm run test:coverage` - Generate coverage reports

### Code Quality
- `npm run lint` - Check code for linting errors
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Testing

The project includes comprehensive test coverage:
- **22 tests** covering hooks and components
- Custom hooks (useCart, useLanguage)
- UI components (MenuItem, CartItem)
- All tests passing with React 19 compatibility

Run tests with:
```bash
npm run test
```

## Firebase Setup

### Firestore Collections

**orders**
- `customerName`: string
- `tableNumber`: number
- `notes`: string
- `items`: array of objects
- `totalPrice`: number
- `estimatedPrepTime`: number
- `status`: "received" | "preparing" | "ready"
- `timestamp`: timestamp
- `language`: "en" | "fi"

### Authentication

Admin access requires Firebase Authentication. Create an admin user in Firebase Console:
1. Go to Firebase Console → Authentication
2. Add user with email/password
3. Use these credentials to access `/admin`

### Security Rules

**IMPORTANT:** Deploy Firestore security rules for multi-device order tracking:

1. Via Firebase Console:
   - Go to Firestore Database → Rules
   - Copy rules from `firestore.rules`
   - Click Publish

2. Via Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules
   ```

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions and troubleshooting.

## Deployment

This project includes **automated CI/CD** via GitHub Actions:

### Automatic Deployment (Recommended)

1. Push to `main` branch → Automatically deploys to production
2. Create Pull Request → Automatically creates preview deployment
3. All tests, linting, and builds run automatically

**Setup:** See [CICD_SETUP.md](CICD_SETUP.md) for GitHub Actions + Vercel configuration.

### Manual Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Project Settings → Environment Variables
```

### Manual Deployment to Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Initialize and deploy
firebase init hosting
npm run build
firebase deploy
```

**Current Deployment:** https://digital-menu-nine-fawn.vercel.app

## Customization

### Menu Items

Edit `src/data/menuData.json` to modify menu items, prices, and categories.

### Translations

Edit `src/data/translations.json` to modify UI text or add new languages.

### Styling

Global styles are in `src/index.css`. Components use CSS classes defined there.

## Architecture Highlights

- **Component-based architecture** with reusable UI components
- **Custom hooks** for business logic separation
- **Menu customization system** with real-time price calculation and deep comparison
- **QR code system** with table-specific URLs and auto-fill functionality
- **Real-time updates** via Firebase Firestore listeners (onSnapshot)
- **Multi-device synchronization** for customer and admin views
- **Form validation** with comprehensive error handling
- **localStorage persistence** for cart and language preferences
- **Environment-based configuration** for secure credential management
- **Warm glassmorphism UI** with modern design system
- **Automated CI/CD** with GitHub Actions
- **Security headers** and performance optimizations via Vercel

## Design System

- **Color Palette:** Warm creams, terracotta, sage/teal
- **Typography:** Georgia/Playfair Display serif headings
- **Effects:** Frosted glass (backdrop-filter blur)
- **Responsive:** Mobile-first design
- **Accessibility:** Semantic HTML, ARIA labels

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

Built with React, Firebase, and modern web development best practices.
