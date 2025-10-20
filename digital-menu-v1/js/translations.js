// translations.js - Bilingual support for EN and FI

const translations = {
    en: {
        welcome: "Welcome",
        menu: "Menu",
        cart: "Cart",
        total: "Total",
        addToCart: "Add to Cart",
        removeFromCart: "Remove",
        emptyCart: "Your cart is empty",
        placeOrder: "Place Order",
        contactInfo: "Contact Information",
        name: "Name",
        phone: "Phone",
        email: "Email",
        notes: "Special requests",
        submitOrder: "Submit Order",
        cancel: "Cancel",
        orderSuccess: "Order sent successfully!",
        categories: {
            coffee: "Coffee & Drinks",
            food: "Food",
            desserts: "Desserts"
        }
    },
    fi: {
        welcome: "Tervetuloa",
        menu: "Menu",
        cart: "Ostoskori",
        total: "Yhteensä",
        addToCart: "Lisää koriin",
        removeFromCart: "Poista",
        emptyCart: "Ostoskorisi on tyhjä",
        placeOrder: "Tee tilaus",
        contactInfo: "Yhteystiedot",
        name: "Nimi",
        phone: "Puhelin",
        email: "Sähköposti",
        notes: "Erityistoiveet",
        submitOrder: "Lähetä tilaus",
        cancel: "Peruuta",
        orderSuccess: "Tilaus lähetetty onnistuneesti!",
        categories: {
            coffee: "Kahvi & Juomat",
            food: "Ruoka",
            desserts: "Jälkiruoat"
        }
    }
};

// Get current language from localStorage or default to 'en'
let currentLang = localStorage.getItem('language') || 'en';

// Function to get translation
function t(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
        value = value[k];
        if (!value) return key;
    }
    
    return value;
}

// Function to switch language
function switchLanguage() {
    currentLang = currentLang === 'en' ? 'fi' : 'en';
    localStorage.setItem('language', currentLang);
    updatePageLanguage();
}

// Function to update all text on page
function updatePageLanguage() {
    // Update header
    document.getElementById('welcome-text').textContent = t('welcome');
    document.getElementById('current-lang').textContent = currentLang.toUpperCase();
    document.getElementById('cart-title').textContent = t('cart');
    document.getElementById('total-label').textContent = t('total') + ':';
    document.querySelector('#place-order-btn').textContent = t('placeOrder');
    
    // Update order form
    document.getElementById('order-form-title').textContent = t('contactInfo');
    document.getElementById('customer-name').placeholder = t('name');
    document.getElementById('customer-phone').placeholder = t('phone');
    document.getElementById('customer-email').placeholder = t('email');
    document.getElementById('order-notes').placeholder = t('notes');
    document.getElementById('cancel-order').textContent = t('cancel');
    document.getElementById('submit-order').textContent = t('submitOrder');
    document.getElementById('success-message').textContent = t('orderSuccess');
    
    // Update cart empty message
    const emptyMsg = document.querySelector('.cart-empty p');
    if (emptyMsg) emptyMsg.textContent = t('emptyCart');
    
    // Re-render menu with new language
    if (typeof renderMenu === 'function') {
        renderMenu();
    }
}