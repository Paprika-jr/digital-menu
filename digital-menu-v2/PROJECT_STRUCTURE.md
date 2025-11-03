# Digital Menu - Project Structure Guide

## 📁 Complete File Structure

```
digital-menu-v2/
├── 📄 Configuration Files (Root)
│   ├── package.json              ⭐ Dependencies & scripts
│   ├── vite.config.js            ⚙️ Build tool configuration
│   ├── eslint.config.js          ✅ Code quality rules
│   ├── vercel.json               🚀 Deployment configuration
│   ├── firestore.rules           🔒 Database security rules
│   └── .env                      🔐 Environment variables (SECRET!)
│
├── 📂 src/ (All application code)
│   │
│   ├── 📄 main.jsx               🚪 Application entry point (MOST IMPORTANT!)
│   ├── 📄 index.css              🎨 Global styles
│   │
│   ├── 📂 pages/                 📄 Top-level page components
│   │   ├── App.jsx               🏠 Customer menu page (main)
│   │   ├── AdminDashboard.jsx    👨‍💼 Admin order management
│   │   └── OrderStatus.jsx       📊 Order tracking page
│   │
│   ├── 📂 components/            🧩 Reusable UI components
│   │   ├── customer/             👤 Customer-facing components
│   │   │   ├── Menu/
│   │   │   │   ├── MenuItem.jsx         🍔 Individual menu item card
│   │   │   │   ├── MenuCategory.jsx     📑 Category section
│   │   │   │   └── TodaySpecial.jsx     ⭐ Special item highlight
│   │   │   ├── Cart/
│   │   │   │   ├── CartModal.jsx        🛒 Shopping cart popup
│   │   │   │   ├── CartItem.jsx         📦 Item in cart
│   │   │   │   └── CartSummary.jsx      💰 Price summary
│   │   │   └── Order/
│   │   │       ├── OrderForm.jsx        📝 Customer info form
│   │   │       └── OrderStatusView.jsx  ⏱️ Status display
│   │   │
│   │   └── admin/                🔐 Admin-only components
│   │       ├── Login/
│   │       │   └── LoginForm.jsx        🔑 Admin authentication
│   │       └── Dashboard/
│   │           ├── OrderCard.jsx        📋 Single order card
│   │           └── OrderFilters.jsx     🔍 Filter buttons
│   │
│   ├── 📂 hooks/                 🪝 Custom React hooks (STATE MANAGEMENT)
│   │   ├── index.js              📦 Export all hooks
│   │   ├── useCart.js            🛒 Shopping cart logic
│   │   ├── useOrders.js          📊 Order CRUD & real-time sync
│   │   ├── useAuth.js            🔐 Authentication logic
│   │   └── useLanguage.js        🌍 i18n language switching
│   │
│   ├── 📂 services/              🔌 External service integrations
│   │   └── firebase.js           🔥 Firebase configuration (CRITICAL!)
│   │
│   ├── 📂 data/                  📊 Static data files
│   │   ├── menuData.json         🍽️ Menu items database
│   │   └── translations.json     🌍 Language translations
│   │
│   ├── 📂 test/                  🧪 Test configuration
│   │   └── setup.js              ⚙️ Vitest test setup
│   │
│   ├── 📂 assets/                🖼️ Static assets
│   │   └── react.svg             🖼️ Images/icons
│   │
│   ├── 📂 contexts/              (Empty - for future Context API)
│   ├── 📂 utils/                 (Empty - for future utility functions)
│   └── 📂 styles/                (Empty - currently using index.css)
│
├── 📂 .github/                   🤖 GitHub Actions CI/CD
│   └── workflows/
│       └── ci.yml                🚀 Automated testing & deployment
│
├── 📂 dist/                      📦 Built files (auto-generated)
├── 📂 node_modules/              📚 Dependencies (auto-generated)
│
└── 📄 Documentation Files
    ├── README.md                 📖 Project overview
    ├── FIREBASE_SETUP.md         🔥 Firebase deployment guide
    ├── CICD_SETUP.md             🚀 CI/CD setup instructions
    └── PROJECT_STRUCTURE.md      📁 This file!
```

---

## 🌟 Most Important Files (Priority Order)

### 1. ⭐⭐⭐ CRITICAL - Application Core

#### `src/main.jsx` - The Entry Point
**What it does:** The first file that runs when your app starts
- Sets up React Router (URL routing)
- Defines all routes (/, /admin, /status/:id)
- Renders the entire application

**Key Code:**
```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/status/:id" element={<OrderStatus />} />
    </Routes>
  </BrowserRouter>
)
```

**When to edit:** When adding new pages/routes

---

#### `src/services/firebase.js` - Database Connection
**What it does:** Connects your app to Firebase (database + authentication)
- Initializes Firebase app
- Exports `db` (database) and `auth` (authentication)
- Used by ALL components that need data

**Key Code:**
```javascript
export const db = getFirestore(app);    // For orders, menu data
export const auth = getAuth(app);        // For admin login
```

**When to edit:** NEVER (unless changing Firebase project)

**⚠️ CRITICAL:** Without this, nothing works!

---

### 2. ⭐⭐ IMPORTANT - Page Components

#### `src/pages/App.jsx` (will be moved here)
**What it does:** Main customer-facing page
- Displays menu items
- Handles cart functionality
- Order submission flow

**Current location:** `src/App.jsx` → Will move to `src/pages/App.jsx`

**Functionality:**
- Shows menu with categories
- Language switcher (EN/FI)
- Cart modal
- Order form
- Redirects to order status page

---

#### `src/pages/AdminDashboard.jsx` (will be moved here)
**What it does:** Kitchen staff order management interface
- Real-time order list
- Status updates (Received → Preparing → Ready)
- Filter orders by status

**Current location:** `src/AdminDashboard.jsx` → Will move to `src/pages/AdminDashboard.jsx`

**Functionality:**
- Requires admin login
- Real-time Firebase listener
- Update order status with one click

---

#### `src/pages/OrderStatus.jsx` (will be moved here)
**What it does:** Customer order tracking page
- Shows order progress in real-time
- Displays estimated wait time
- Updates automatically when kitchen changes status

**Current location:** `src/OrderStatus.jsx` → Will move to `src/pages/OrderStatus.jsx`

**URL:** `/status/{orderId}`

---

### 3. ⭐ MEDIUM PRIORITY - Hooks (Business Logic)

#### `src/hooks/useCart.js`
**What it does:** Manages shopping cart state
- Add/remove items
- Update quantities
- Calculate total price
- Persist cart in localStorage

**Used by:** App.jsx, CartModal.jsx, MenuItem.jsx

---

#### `src/hooks/useOrders.js`
**What it does:** Order management + Firebase real-time sync
- Submit new orders
- Track order status (customer view)
- Update order status (admin view)
- Real-time listeners for live updates

**Contains 3 hooks:**
1. `useOrders()` - Admin: Get all orders with filters
2. `useOrderTracking()` - Customer: Track single order
3. `useOrderSubmit()` - Customer: Submit new order

**Used by:** AdminDashboard.jsx, OrderStatus.jsx, OrderForm.jsx

---

#### `src/hooks/useAuth.js`
**What it does:** Admin authentication
- Login with email/password
- Logout
- Check if user is logged in

**Used by:** AdminDashboard.jsx, LoginForm.jsx

---

#### `src/hooks/useLanguage.js`
**What it does:** Multi-language support (EN/FI)
- Get translations
- Switch language
- Persist language choice

**Used by:** App.jsx, OrderStatus.jsx

---

### 4. 🧩 Components (UI Building Blocks)

#### Customer Components (`src/components/customer/`)

**Menu Components:**
- `MenuItem.jsx` - Single menu item card with price, add to cart button
- `MenuCategory.jsx` - Category header (Starters, Mains, etc.)
- `TodaySpecial.jsx` - Highlighted special item

**Cart Components:**
- `CartModal.jsx` - Popup showing cart contents
- `CartItem.jsx` - Single item in cart with quantity controls
- `CartSummary.jsx` - Total price calculation

**Order Components:**
- `OrderForm.jsx` - Customer name + table number form
- `OrderStatusView.jsx` - Status visualization component

---

#### Admin Components (`src/components/admin/`)

**Dashboard Components:**
- `OrderCard.jsx` - Single order with items + status update buttons
- `OrderFilters.jsx` - Filter tabs (All, New, Cooking, Ready)

**Login Components:**
- `LoginForm.jsx` - Email/password login form

---

### 5. 📊 Data Files

#### `src/data/menuData.json`
**What it does:** Contains all menu items
```json
{
  "starters": [
    {
      "id": "bruschetta",
      "name": "Bruschetta",
      "price": 8.50,
      "description": "Toasted bread with tomatoes",
      "image": "...",
      "prepTime": 10
    }
  ]
}
```

**When to edit:** To add/remove/modify menu items

---

#### `src/data/translations.json`
**What it does:** All UI text in multiple languages
```json
{
  "en": {
    "menu": "Menu",
    "cart": "Cart",
    "checkout": "Checkout"
  },
  "fi": {
    "menu": "Valikko",
    "cart": "Ostoskori",
    "checkout": "Kassa"
  }
}
```

**When to edit:** To add new languages or change text

---

### 6. ⚙️ Configuration Files

#### `package.json`
**What it does:** Lists all dependencies and npm scripts
```json
{
  "scripts": {
    "dev": "vite",              // Start development server
    "build": "vite build",      // Build for production
    "test": "vitest",           // Run tests
    "lint": "eslint ."          // Check code quality
  }
}
```

---

#### `vercel.json`
**What it does:** Deployment configuration for Vercel
- Routing rules (SPA support)
- Security headers
- Build commands

---

#### `firestore.rules`
**What it does:** Firebase security rules
- Who can read/write orders
- Authentication requirements

---

#### `.env` (NOT in git - SECRET!)
**What it does:** Environment variables
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
```

**⚠️ NEVER commit this file to git!**

---

## 🔄 Data Flow Explanation

### Customer Orders Food:

```
1. Customer opens App.jsx
   └─> Loads menu from menuData.json

2. Customer adds items to cart
   └─> useCart() hook manages state
   └─> CartModal.jsx shows cart contents

3. Customer clicks checkout
   └─> OrderForm.jsx collects name/table
   └─> useOrderSubmit() sends to Firebase
   └─> Redirects to /status/{orderId}

4. OrderStatus.jsx displays status
   └─> useOrderTracking() listens to Firebase
   └─> Updates in real-time
```

### Admin Updates Order:

```
1. Admin opens /admin
   └─> LoginForm.jsx checks credentials
   └─> useAuth() verifies with Firebase

2. AdminDashboard.jsx loads
   └─> useOrders() fetches all orders
   └─> Real-time listener for new orders

3. Admin clicks "Start Cooking"
   └─> updateOrderStatus() in useOrders()
   └─> Firebase updates order status
   └─> Customer's OrderStatus.jsx auto-updates!
```

---

## 🎯 Quick Reference: "I Want To..."

| Task | File(s) to Edit |
|------|----------------|
| Add menu item | `src/data/menuData.json` |
| Change UI text | `src/data/translations.json` |
| Add new language | `src/data/translations.json` + `useLanguage.js` |
| Modify menu item design | `src/components/customer/Menu/MenuItem.jsx` + `index.css` |
| Change admin dashboard design | `src/pages/AdminDashboard.jsx` + `index.css` |
| Add new page/route | `src/main.jsx` (add route) + create new page component |
| Change Firebase project | `src/services/firebase.js` + `.env` |
| Modify order flow | `src/hooks/useOrders.js` |
| Change cart behavior | `src/hooks/useCart.js` |
| Update security rules | `firestore.rules` |
| Change deployment settings | `vercel.json` |
| Add npm package | `package.json` (run `npm install <package>`) |

---

## 🚀 Planned Reorganization

We will move files to this cleaner structure:

**Before:**
```
src/
├── App.jsx
├── AdminDashboard.jsx
├── OrderStatus.jsx
└── ...
```

**After:**
```
src/
├── pages/
│   ├── App.jsx
│   ├── AdminDashboard.jsx
│   └── OrderStatus.jsx
└── ...
```

This makes it crystal clear that these are top-level pages, not components!

---

## 📝 Naming Conventions

- **Components:** PascalCase (e.g., `MenuItem.jsx`)
- **Hooks:** camelCase with "use" prefix (e.g., `useCart.js`)
- **Utilities:** camelCase (e.g., `formatPrice.js`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_URL`)
- **Test files:** Same name + `.test.js` (e.g., `MenuItem.test.jsx`)

---

## 🧪 Testing Structure

Tests are co-located with components:
```
MenuItem.jsx
MenuItem.test.jsx  ← Test for MenuItem
```

Test setup lives in:
```
src/test/setup.js  ← Vitest configuration
```

---

## 🎨 Styling Approach

Currently using **one big CSS file:**
```
src/index.css  ← All styles here
```

**Future consideration:** Split into modules:
```
src/styles/
├── components/
│   ├── menu-item.css
│   ├── cart-modal.css
│   └── ...
└── pages/
    ├── app.css
    ├── admin.css
    └── ...
```

---

## 📦 Build Output

Running `npm run build` creates:
```
dist/
├── index.html           ← Single HTML file
├── assets/
│   ├── index-[hash].css ← Bundled CSS
│   └── index-[hash].js  ← Bundled JavaScript
```

This gets deployed to Vercel automatically via CI/CD!

---

## 🔒 Security Notes

**Files that MUST NOT be in git:**
- `.env` - Contains Firebase secrets
- `node_modules/` - Dependencies (too large)
- `dist/` - Build output (regenerated)
- `.vercel/` - Vercel configuration (local)

**Files that SHOULD be in git:**
- Everything else!
- Including `firestore.rules` (not secret, just configuration)

---

## 🎓 Learning Path

**If you're new to the project, read files in this order:**

1. `README.md` - Understand what the project does
2. `src/main.jsx` - See how routes are set up
3. `src/services/firebase.js` - Understand the database connection
4. `src/pages/App.jsx` - See the main customer flow
5. `src/hooks/useCart.js` - Understand state management
6. `src/hooks/useOrders.js` - Understand order flow
7. `src/components/customer/Menu/MenuItem.jsx` - See component structure
8. `src/data/menuData.json` - See the data structure

---

## 🛠️ Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# → Opens http://localhost:5173

# 3. Make changes (files auto-reload)

# 4. Run tests
npm test

# 5. Check code quality
npm run lint

# 6. Build for production
npm run build

# 7. Commit changes
git add .
git commit -m "your message"

# 8. Push (CI/CD auto-deploys!)
git push origin main
```

---

**Questions? Check the specific .md files:**
- Firebase issues → `FIREBASE_SETUP.md`
- Deployment issues → `CICD_SETUP.md`
- General questions → `README.md`
