# Digital Menu v2

A modern, real-time digital menu system built with React and Firebase. Customers can browse menus, place orders, and track order status in real-time. Restaurant staff can manage orders through an admin dashboard.

## Features

### Customer Features
- Browse menu with categorized items (Coffee, Food, Desserts)
- Bilingual support (English/Finnish)
- Shopping cart with quantity management
- Real-time order tracking
- Special offers and daily specials
- Estimated preparation times

### Admin Features
- Real-time order dashboard
- Order status management (Received → Preparing → Ready)
- Order filtering by status
- Secure authentication

## Tech Stack

- **Frontend**: React 19, React Router
- **Backend**: Firebase (Firestore, Authentication)
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library
- **Code Quality**: ESLint, Prettier
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── customer/
│   │   ├── Cart/          # Shopping cart components
│   │   ├── Menu/          # Menu display components
│   │   └── Order/         # Order form and status
│   └── admin/
│       ├── Dashboard/     # Order management
│       └── Login/         # Admin authentication
├── hooks/
│   ├── useCart.js         # Shopping cart logic
│   ├── useLanguage.js     # Language management
│   ├── useAuth.js         # Authentication
│   └── useOrders.js       # Order management
├── data/
│   ├── menuData.json      # Menu items
│   └── translations.json  # UI translations
├── services/
│   └── firebase.js        # Firebase configuration
└── test/
    └── setup.js           # Test configuration
```

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

Configure Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI
```bash
npm i -g vercel
```

2. Deploy
```bash
vercel
```

3. Add environment variables in Vercel dashboard
- Go to Project Settings → Environment Variables
- Add all Firebase configuration variables

### Deploy to Firebase Hosting

1. Install Firebase CLI
```bash
npm i -g firebase-tools
```

2. Initialize Firebase
```bash
firebase init hosting
```

3. Build and deploy
```bash
npm run build
firebase deploy
```

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
- **Real-time updates** via Firebase Firestore listeners
- **Form validation** with error handling
- **localStorage persistence** for cart and language preferences
- **Environment-based configuration** for secure credential management

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
