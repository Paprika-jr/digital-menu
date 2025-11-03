# Quick File Guide - What's What?

## 🎯 I Want To...

### Change Menu Items
**File:** `src/data/menuData.json`
```json
{
  "starters": [
    {
      "id": "bruschetta",
      "name": "Bruschetta",
      "price": 8.50,
      "description": "Toasted bread with tomatoes"
    }
  ]
}
```

### Change UI Text (English/Finnish)
**File:** `src/data/translations.json`
```json
{
  "en": { "menu": "Menu", "cart": "Cart" },
  "fi": { "menu": "Valikko", "cart": "Ostoskori" }
}
```

### Style the Customer Menu
**File:** `src/index.css` (search for "Menu Item Card")
- Lines ~100-200: Menu item styles
- Lines ~200-300: Cart styles
- Lines ~300-400: Button styles

### Style the Admin Dashboard
**File:** `src/index.css` (search for "ADMIN DASHBOARD STYLES")
- Lines ~900-1100: Admin dashboard
- Lines ~1100-1200: Order cards
- Lines ~1200-1300: Admin login

### Change How Orders Work
**File:** `src/hooks/useOrders.js`
- `submitOrder()` - Customer places order
- `useOrderTracking()` - Customer tracks order
- `useOrders()` - Admin sees all orders
- `updateOrderStatus()` - Admin changes status

### Change Firebase/Database
**File:** `src/services/firebase.js`
⚠️ Only edit if changing Firebase project!

### Add a New Page
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/main.jsx`:
```javascript
<Route path="/new-page" element={<NewPage />} />
```

---

## 📂 File Tree (Clean Structure)

```
src/
├── 🚪 main.jsx                    ← App entry point (routes)
├── 🎨 index.css                   ← All styles
│
├── 📄 pages/                      ← Top-level pages
│   ├── App.jsx                    ← Customer menu (/)
│   ├── AdminDashboard.jsx         ← Kitchen orders (/admin)
│   └── OrderStatus.jsx            ← Track order (/status/:id)
│
├── 🧩 components/
│   ├── customer/                  ← Customer UI
│   │   ├── Menu/
│   │   │   ├── MenuItem.jsx
│   │   │   ├── MenuCategory.jsx
│   │   │   └── TodaySpecial.jsx
│   │   ├── Cart/
│   │   │   ├── CartModal.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── CartSummary.jsx
│   │   └── Order/
│   │       ├── OrderForm.jsx
│   │       └── OrderStatusView.jsx
│   │
│   └── admin/                     ← Admin UI
│       ├── Login/
│       │   └── LoginForm.jsx
│       └── Dashboard/
│           ├── OrderCard.jsx
│           └── OrderFilters.jsx
│
├── 🪝 hooks/                      ← Business logic
│   ├── useCart.js                 ← Shopping cart
│   ├── useOrders.js               ← Order management
│   ├── useAuth.js                 ← Admin login
│   └── useLanguage.js             ← EN/FI switch
│
├── 🔌 services/
│   └── firebase.js                ← Database connection
│
├── 📊 data/
│   ├── menuData.json              ← Menu items
│   └── translations.json          ← UI text (EN/FI)
│
└── 🧪 test/
    └── setup.js                   ← Test configuration
```

---

## 🌟 Most Important Files (Read These First!)

### 1. `src/main.jsx` - Routing
Defines all pages and URLs:
- `/` → Customer menu
- `/admin` → Kitchen dashboard
- `/status/:id` → Order tracking

### 2. `src/services/firebase.js` - Database
Connects to Firebase. Exports:
- `db` - Database for orders
- `auth` - Admin authentication

### 3. `src/pages/App.jsx` - Customer Experience
Main customer page:
- Menu display
- Cart functionality
- Order placement

### 4. `src/pages/AdminDashboard.jsx` - Kitchen View
Kitchen staff interface:
- See incoming orders
- Update order status
- Real-time updates

### 5. `src/hooks/useOrders.js` - Order Logic
All order-related functions:
- Create orders
- Track status
- Real-time sync

---

## 🎨 Styling System

**One big CSS file:** `src/index.css`

Sections:
- Lines 1-100: Global styles
- Lines 100-500: Customer UI
- Lines 500-900: Cart & forms
- Lines 900-1300: Admin dashboard

**CSS Class Pattern:**
```css
.menu-item { }           /* Component */
.menu-item-title { }     /* Component part */
.menu-item:hover { }     /* State */
```

---

## 🔄 Data Flow

### Customer Orders:
```
1. Customer: App.jsx
   └─> Add to cart: useCart()

2. Customer: Click checkout
   └─> OrderForm.jsx
   └─> Submit: useOrderSubmit()
   └─> Save to Firebase

3. Redirect to: /status/{orderId}
   └─> OrderStatus.jsx
   └─> Track: useOrderTracking()
```

### Admin Updates:
```
1. Admin: AdminDashboard.jsx
   └─> Login: useAuth()
   └─> Load orders: useOrders()

2. Admin: Click "Start Cooking"
   └─> updateOrderStatus()
   └─> Update Firebase

3. Customer's OrderStatus.jsx
   └─> Automatically updates!
```

---

## 🧪 Testing

**Run tests:**
```bash
npm test              # Watch mode
npm run test:run      # One-time
npm run test:coverage # With coverage
```

**Test files:** Next to components
```
MenuItem.jsx
MenuItem.test.jsx  ← Tests
```

---

## 🚀 Common Tasks

### Add a Menu Item
1. Edit `src/data/menuData.json`
2. Add to appropriate category:
```json
{
  "id": "new-item",
  "name": "New Item",
  "price": 12.50,
  "description": "Delicious new item",
  "prepTime": 15,
  "category": "mains",
  "image": "https://..."
}
```
3. Done! Auto-appears on menu

### Change Colors
Edit `src/index.css`:
```css
:root {
  --warm-cream: #faf8f5;
  --terracotta: #e07856;
  --sage: #6b9080;
}
```

### Add Translation
Edit `src/data/translations.json`:
```json
{
  "en": { "newKey": "New Text" },
  "fi": { "newKey": "Uusi Teksti" }
}
```

Use in component:
```javascript
const { t } = useLanguage();
<p>{t.newKey}</p>
```

---

## 🔐 Security

**SECRET files (NOT in git):**
- `.env` - Firebase credentials
- `node_modules/` - Dependencies
- `dist/` - Build output

**PUBLIC files (IN git):**
- Everything else
- Including `firestore.rules`

---

## 📱 Routes (URLs)

| URL | Page | Who |
|-----|------|-----|
| `/` | Menu | Customer |
| `/admin` | Dashboard | Admin |
| `/status/abc123` | Track Order | Customer |
| `*` (anything else) | → Redirect to `/` | - |

---

## 🎓 Learning Order

If you're new, read in this order:

1. `README.md` - What is this?
2. `PROJECT_STRUCTURE.md` - Full breakdown
3. `src/main.jsx` - How does routing work?
4. `src/data/menuData.json` - What's the data structure?
5. `src/pages/App.jsx` - How does the customer view work?
6. `src/hooks/useCart.js` - How does the cart work?
7. Pick a component and read it!

---

## 🐛 Debugging

**Browser Console:**
Press F12 → Console tab

Look for:
```
[OrderStatus] Setting up listener...  ← Good
FirebaseError: permission-denied      ← Bad (check rules)
```

**Common Issues:**
- "Order not found" → Check Firestore rules
- "Permission denied" → Deploy firestore.rules
- Cart not updating → Check useCart()
- Orders not syncing → Check Firebase connection

---

## 💡 Tips

1. **Search for text:** Use Ctrl+Shift+F in VS Code
2. **Find component:** Search for class name (e.g., `.menu-item`)
3. **Trace data:** Add `console.log()` in hooks
4. **Test locally:** `npm run dev` → http://localhost:5173
5. **Check build:** `npm run build` before pushing

---

**Need more details?** See `PROJECT_STRUCTURE.md`!
