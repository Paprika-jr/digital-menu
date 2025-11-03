# 🍽️ Digital Menu & Ordering System

A real-time digital menu and ordering system for restaurants where customers can scan QR codes, browse menus, place orders, and track preparation status all from their phones.

**Status**: ✅ Production Ready with CI/CD
**Version**: 2.0
**Live Demo**: [https://digital-menu-nine-fawn.vercel.app](https://digital-menu-nine-fawn.vercel.app)
**Developer**: Khun Htet Lin Aung

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-22%20passing-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Firebase](https://img.shields.io/badge/Firebase-latest-orange) 

---

## ✨ Features

### Customer Side
- **Mobile-responsive digital menu** with modern glassmorphism design
- **Premium UI/UX** - Warm minimalist aesthetic with frosted glass effects
- **Bilingual support** - Switch between English & Finnish instantly
- **Shopping cart** with quantity management
- **Real-time preparation time** estimates for each item
- **Live order tracking** - Watch your order progress (Received → Preparing → Ready)
- **Today's Special** section with promotional pricing
- **Item badges** - Popular, Bestseller, New items highlighted
- **Special requests** - Add notes to your order

### Restaurant Admin Dashboard
- **Secure admin authentication** - Protected login system
- **Real-time order notifications** - Orders appear instantly
- **Order management** - Update status with one click
- **Order filtering** - View All, New, Cooking, or Ready orders
- **Customer details** - Name, table number, special requests
- **Order totals** - Automatic price calculation
- **Prep time tracking** - See estimated cooking time
- **Live sync** - Status updates reflected on customer side instantly

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with improved hooks
- **Vite 7** - Lightning-fast build tool
- **Glassmorphism CSS** - Premium frosted glass design with warm minimalist aesthetics
- **Custom Hooks** - Reusable state management (useCart, useAuth, useOrders, useLanguage)
- **Lucide React** - Beautiful icon library
- **Component Architecture** - Modular, maintainable structure with pages/ directory

### Backend & Infrastructure
- **Firebase Firestore** - Real-time NoSQL database with onSnapshot listeners
- **Firebase Authentication** - Secure admin login
- **Firestore Security Rules** - Public read, authenticated write
- **Multi-device Sync** - Real-time order updates across all devices

### Testing & Quality
- **Vitest 3** - Fast unit testing framework
- **React Testing Library** - Component testing
- **ESLint 9** - Code linting
- **Prettier 3** - Code formatting
- **22 Passing Tests** - Critical hooks and components covered

### Deployment & CI/CD
- **Vercel** - Production hosting with auto-deploy
- **GitHub Actions** - Automated CI/CD pipeline
- **Auto-deployment** - Push to main → Deploy to production
- **Preview Deployments** - Every PR gets a preview URL
- **Security Headers** - X-Frame-Options, CSP, etc.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase account

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/digital-menu.git

# Navigate to project
cd digital-menu/digital-menu-v2

# Install dependencies
npm install

# Set up environment variables (see below)

# Start development server
npm run dev
```

### Environment Setup

Create `.env` file in `digital-menu-v2/`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## 📁 Project Structure
```
digital-menu/
├── README.md                     # This file
├── LICENSE
│
├── digital-menu-v1/              # Initial prototype (archived)
│   └── (HTML/CSS/JS version)
│
└── digital-menu-v2/              # Production version ⭐
    ├── .github/workflows/       # CI/CD automation
    │   └── ci.yml               # GitHub Actions pipeline
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── pages/               # Top-level page components
    │   │   ├── App.jsx          # Customer menu (/)
    │   │   ├── AdminDashboard.jsx  # Admin panel (/admin)
    │   │   └── OrderStatus.jsx  # Order tracking (/status/:id)
    │   ├── components/          # Reusable UI components
    │   │   ├── admin/           # Admin components
    │   │   └── customer/        # Customer components
    │   ├── hooks/               # Custom React hooks
    │   │   ├── useCart.js       # Shopping cart
    │   │   ├── useAuth.js       # Authentication
    │   │   ├── useOrders.js     # Order CRUD + real-time
    │   │   └── useLanguage.js   # i18n support
    │   ├── data/                # Static data
    │   │   ├── menuData.json    # Menu items
    │   │   └── translations.json  # i18n strings
    │   ├── services/            # External services
    │   │   └── firebase.js      # Firebase config
    │   ├── test/                # Test setup
    │   ├── index.css            # Global styles
    │   └── main.jsx             # App entry + routing
    ├── firestore.rules          # Database security rules
    ├── vercel.json              # Deployment config
    ├── vitest.config.js         # Test configuration
    ├── FILE_GUIDE.md            # Quick reference
    ├── PROJECT_STRUCTURE.md     # Detailed docs
    ├── FIREBASE_SETUP.md        # Firebase guide
    ├── CICD_SETUP.md            # CI/CD guide
    └── package.json
```

**📚 Full Documentation:** See `digital-menu-v2/` directory for comprehensive guides

---

## 🌐 Live URLs

**Customer Menu:**  
https://digital-menu-nine-fawn.vercel.app/

**Admin Dashboard:**  
https://digital-menu-nine-fawn.vercel.app/admin

---

## 🔐 Security

- ✅ Firebase Authentication for admin access
- ✅ Firestore security rules configured
- ✅ Environment variables for sensitive data
- ✅ Protected admin routes
- ⚠️ Customer orders are publicly readable (by design for pilot)


---

## 📱 How It Works

### Customer Flow
1. Scan QR code on table → Opens digital menu
2. Browse menu with prices & prep times
3. Add items to cart
4. Enter name & table number
5. Submit order
6. Track status in real-time (Received → Preparing → Ready)

### Restaurant Flow
1. Admin logs in to dashboard
2. New orders appear automatically
3. Click "Start Cooking" → Customer sees "Preparing"
4. Click "Mark as Ready" → Customer sees "Ready"
5. Monitor all active orders by status

---

## 🚀 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Environment Variables in Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## 🔄 Development Roadmap

### ✅ Phase 1: Core Features (COMPLETED)
- [x] Digital menu display
- [x] Shopping cart functionality
- [x] Order placement
- [x] Real-time order tracking
- [x] Admin dashboard
- [x] Firebase integration
- [x] Admin authentication
- [x] Production deployment
- [x] Real-time status sync
- [x] Component architecture refactor
- [x] Custom React hooks implementation
- [x] Premium glassmorphism UI redesign
- [x] Test infrastructure setup (Vitest)
- [x] Unit tests for critical hooks

### ✅ Phase 2: Enhancement (COMPLETED)
- [x] CI/CD pipeline with GitHub Actions
- [x] Automated testing in pipeline
- [x] Preview deployments for PRs
- [x] Multi-device order synchronization fix
- [x] Comprehensive project documentation
- [x] Firestore security rules deployment
- [x] Error handling improvements
- [x] Code organization (pages/ directory)

### 🔄 Phase 3: Advanced Features (IN PROGRESS)
- [ ] QR code generation for tables
- [ ] Menu editor for restaurants
- [ ] Order history & analytics
- [ ] Email/SMS notifications
- [ ] Print receipt functionality
- [ ] Performance optimization (code splitting)

### 📅 Phase 3: Scaling (PLANNED)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Multi-restaurant support
- [ ] Kitchen printer integration
- [ ] Table reservation system
- [ ] Loyalty program
- [ ] Advanced analytics dashboard

---

## 💼 Business Model

### Target Market
Small to medium-sized cafés and restaurants in Central Finland, with focus on Viitasaari region.

### Pricing (Under Development)
- **Basic**: under development
- **Pro**: under development
- **Enterprise**: under development

### Pilot Program
- ✅ 2-week free trial
- ✅ Full setup & training included
- ✅ No commitment required
- ✅ Dedicated support

---

## 📊 Current Status

### Completed Features
- ✅ Full customer ordering flow
- ✅ Real-time admin dashboard
- ✅ Firebase backend integration
- ✅ Secure authentication
- ✅ Production deployment
- ✅ Mobile-responsive design
- ✅ Bilingual support (EN/FI)
- ✅ Premium glassmorphism UI
- ✅ Component-based architecture
- ✅ Custom React hooks
- ✅ Test infrastructure (22 tests)
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Automated deployments
- ✅ Multi-device synchronization
- ✅ Comprehensive documentation

### In Development
- 🔄 QR code generator
- 🔄 Restaurant onboarding docs
- 🔄 Marketing materials

### Next Milestone
First pilot restaurant launch - Target: Within 2 weeks

---

## 🤝 Contributing

This is a learning project developed during ICT studies. Feedback and suggestions are welcome!

---

## 📞 Contact & Support

**Developer**: Khun Htet Lin Aung  
**Organization**: Witas.oy Digikeskus  
**Location**: Viitasaari, Finland  

For inquiries about pilot program or collaboration, please reach out through GitHub.

---

## 🙏 Acknowledgments

- **Witas.oy Digikeskus** - For providing the training opportunity
- **Local Viitasaari cafés** - For feedback and inspiration
- **Open source community** - For amazing tools and libraries

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎯 Project Goals

1. **Learn** modern web development with React & Firebase
2. **Help** local businesses digitalize their operations
3. **Create** a portfolio-worthy project for job applications
4. **Launch** a real product used by actual restaurants

---

## 📈 Metrics

**Development Time**: October 2024 - Present
**Lines of Code**: ~4,500+
**Features Implemented**: 25+
**Technologies Used**: 12+
**Test Coverage**: 22 passing tests (critical hooks & components)
**CI/CD**: Automated with GitHub Actions
**Documentation**: 4 comprehensive guides
**Ready for Production**: ✅ YES

---

**Star this repo if you find it useful!**

**Found a bug? Open an issue!**

**Have suggestions? Let's discuss!**

---

## 🎨 Design Philosophy

The application features a **warm glassmorphism** design that blends modern aesthetics with inviting warmth:

- **Glassmorphism Effects**: Frosted glass cards with backdrop blur create depth and sophistication
- **Warm Color Palette**: Cream backgrounds, terracotta accents, and sage tones for a cozy feel
- **Minimalist Layout**: Generous whitespace and clean typography for easy reading
- **Premium Typography**: Serif headings (Georgia/Playfair) with modern sans-serif body text
- **Smooth Animations**: Subtle hover effects and transitions for polished interactions

This design approach creates an upscale yet approachable atmosphere perfect for modern restaurants.

---

*Built with ☕ and 💻 in Viitasaari, Finland*

*Last updated: November 3, 2024*