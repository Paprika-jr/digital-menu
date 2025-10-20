# 🍽️ Restaurant Digital Menu System

A modern, real-time digital menu and ordering system for restaurants and cafés. Customers can scan QR codes, browse the menu, place orders, and track preparation time - all from their phones!

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌟 Features

### ✅ Completed Features:
- **Digital Menu Display** - Beautiful, mobile-first menu interface
- **Multilingual Support** - Switch between English and Finnish with one click
- **Shopping Cart** - Add/remove items with quantity management
- **Preparation Time Tracking** - See estimated cook time for each item
- **Smart Time Calculation** - Calculates max prep time (parallel cooking)
- **Order Placement** - Customers can submit orders with table number
- **Order Status Tracking** - Real-time status updates (Received → Preparing → Ready)
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Clean UI** - Modern, intuitive interface with smooth animations

### 🚧 In Progress:
- Firebase backend integration
- Restaurant admin dashboard
- Real-time order notifications
- Kitchen display system

### 📅 Planned Features:
- QR code generation for tables
- Payment integration
- Order history
- Analytics dashboard
- Multi-restaurant management
- Email/SMS notifications

---

## 🛠️ Tech Stack

### Frontend:
- **React 18** - UI framework
- **Vite** - Build tool and dev server (fast, modern)
- **Pure CSS** - Custom styling (no framework dependencies)
- **Lucide React** - Beautiful icon library

### Backend (Coming Soon):
- **Firebase Firestore** - Real-time database
- **Firebase Authentication** - Admin login
- **Firebase Hosting** - Deployment

---

## 🚀 Quick Start

### Prerequisites:
- Node.js 16+ installed
- npm or yarn package manager

### Installation:
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/digital-menu.git
cd digital-menu

# Navigate to v2 (production version)
cd digital-menu-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173/`

---

## 📁 Project Structure
```
digital-menu/
├── README.md                    # This file
│
├── digital-menu-v1/            # Archive - Initial HTML/CSS/JS prototype
│   └── (old files)
│
└── digital-menu-v2/            # Current Production Version
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.jsx             # Main application component
    │   ├── index.css           # Global styles
    │   └── main.jsx            # Entry point
    ├── package.json
    └── vite.config.js
```

---

## 📱 How It Works

### Customer Flow:
1. **Scan QR Code** → Opens digital menu on their phone
2. **Browse Menu** → View items with prices and prep times
3. **Add to Cart** → Select items and quantities
4. **Place Order** → Enter name and table number
5. **Track Status** → Watch order progress in real-time
6. **Get Notified** → When food is ready!

### Restaurant Flow (Coming Soon):
1. **Receive Orders** → New orders appear in admin dashboard
2. **Start Cooking** → Mark order as "Preparing"
3. **Complete** → Mark as "Ready" when done
4. **Notify Customer** → Automatic status update

---

## 🎨 Screenshots

### Customer Menu View
- Clean, modern interface
- Item cards with emojis and prep times
- Easy-to-use shopping cart

### Order Tracking
- Visual progress indicator
- Real-time status updates
- Estimated completion time

### Multi-language Support
- Toggle between EN/FI instantly
- All text and UI elements translate

*(Screenshots coming soon)*

---

## 🔧 Development

### Available Scripts:
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Adding New Menu Items:

Edit the `menuData` object in `src/App.jsx`:
```javascript
const menuData = {
  coffee: [
    { 
      id: 1, 
      name: { en: "Espresso", fi: "Espresso" }, 
      price: 3.50, 
      prepTime: 3, 
      image: "☕" 
    },
    // Add more items...
  ],
  // Add more categories...
};
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended):
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd digital-menu-v2
vercel
```

### Deploy to Netlify:
```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
# Or connect GitHub repo for automatic deployments
```

---

## 📊 Development Roadmap

### Phase 1: Frontend (Week 1-2) ✅ **COMPLETED**
- [x] Menu display with categories
- [x] Shopping cart functionality
- [x] Bilingual support (EN/FI)
- [x] Prep time tracking
- [x] Order form
- [x] Order status visualization
- [x] Responsive design

### Phase 2: Backend Integration (Week 3-4) 🔄 **IN PROGRESS**
- [ ] Set up Firebase project
- [ ] Firestore database structure
- [ ] Save orders to database
- [ ] Real-time order updates
- [ ] Admin authentication

### Phase 3: Admin Dashboard (Week 5-6)
- [ ] Order management interface
- [ ] Kitchen display system
- [ ] Menu editor
- [ ] Order history
- [ ] Basic analytics

### Phase 4: Production Features (Week 7-8)
- [ ] QR code generation
- [ ] Payment integration
- [ ] Email notifications
- [ ] Multi-restaurant support
- [ ] Advanced analytics

### Phase 5: Launch (Week 9+)
- [ ] Beta testing with real restaurant
- [ ] Bug fixes and optimization
- [ ] Marketing materials
- [ ] Documentation
- [ ] Official launch

---

## 💼 Business Model

### Pricing Options (Draft):
- **Basic**: €20/month - Digital menu only
- **Pro**: €40/month - Menu + Ordering + Admin dashboard
- **Premium**: €70/month - All features + Analytics + Priority support

### Target Market:
- Small to medium-sized cafés and restaurants in Finland
- Focus on Viitasaari and Central Finland region
- Partnership with Witas.oy Digikeskus

---

## 🤝 Contributing

This is a learning project developed as part of ICT studies at Witas.oy Digikeskus.

### Development Team:
- **Developer**: Khun Htet Linn Aung
- **Organization**: Witas.oy - Digikeskus Viitasaari
- **Purpose**: Second-year ICT student trainee project

---

## 📝 Version History

### Version 2.0 (Current) - October 2025
- Complete rebuild with React + Vite
- Pure CSS styling (removed Tailwind dependency)
- Enhanced user experience
- Preparation time tracking
- Order status system
- Production-ready frontend

### Version 1.0 - October 2025
- Initial HTML/CSS/JS prototype
- Basic menu display
- Email integration
- GitHub Pages deployment
- **Status**: Archived in `digital-menu-v1/`

---

## 📄 License

MIT License - Feel free to use for learning purposes

---

## 📞 Contact & Support

- **Developer**: Khun Htet Lin Aung
- **Organization**: Witas.oy Digikeskus
- **Location**: Viitasaari, Finland

---

## 🙏 Acknowledgments

- Witas.oy Digikeskus for the opportunity
- Open source community for amazing tools
- Local restaurants for feedback and support

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Lucide Icons](https://lucide.dev)

---

**⭐ Star this repo if you find it useful!**

**🐛 Found a bug? Open an issue!**

**💡 Have suggestions? Let's chat!**

---

*Last updated: October 20, 2025*