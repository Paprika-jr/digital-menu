// app.js - Main application logic with EmailJS integration

// Shopping cart state
let cart = [];

// DOM Elements
const menuContainer = document.getElementById('menu-container');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartFooter = document.getElementById('cart-footer');
const cartCount = document.getElementById('cart-count');
const totalPrice = document.getElementById('total-price');
const backdrop = document.getElementById('backdrop');
const orderModal = document.getElementById('order-modal');
const successModal = document.getElementById('success-modal');
const loadingModal = document.getElementById('loading-modal');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCartUI();
    setupEventListeners();
    updatePageLanguage();
    lucide.createIcons();
});

// Setup all event listeners
function setupEventListeners() {
    // Language toggle
    document.getElementById('lang-toggle').addEventListener('click', () => {
        switchLanguage();
        lucide.createIcons();
    });

    // Cart toggle
    document.getElementById('cart-toggle').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);

    // Order flow
    document.getElementById('place-order-btn').addEventListener('click', openOrderForm);
    document.getElementById('cancel-order').addEventListener('click', closeOrderForm);
    document.getElementById('submit-order').addEventListener('click', submitOrder);

    // Backdrop click
    backdrop.addEventListener('click', () => {
        closeCart();
        closeOrderForm();
    });
}

// Render menu items
function renderMenu() {
    menuContainer.innerHTML = '';
    
    const categories = ['coffee', 'food', 'desserts'];
    
    categories.forEach(category => {
        const items = getMenuByCategory(category);
        
        if (items.length === 0) return;
        
        const section = document.createElement('div');
        section.className = 'menu-section';
        
        const title = document.createElement('h2');
        title.textContent = t(`categories.${category}`);
        
        const grid = document.createElement('div');
        grid.className = 'menu-grid';
        
        items.forEach(item => {
            if (item.available) {
                grid.appendChild(createMenuItem(item));
            }
        });
        
        section.appendChild(title);
        section.appendChild(grid);
        menuContainer.appendChild(section);
    });
    
    lucide.createIcons();
}

// Create menu item card
function createMenuItem(item) {
    const card = document.createElement('div');
    card.className = 'menu-item';
    
    card.innerHTML = `
        <div class="item-header">
            <h3>${item.name[currentLang]}</h3>
            <span class="item-price">€${item.price.toFixed(2)}</span>
        </div>
        <p class="item-description">${item.description[currentLang]}</p>
        <button class="btn btn-primary btn-block" onclick="addToCart(${item.id})">
            <i data-lucide="plus"></i>
            ${t('addToCart')}
        </button>
    `;
    
    return card;
}

// Add item to cart
function addToCart(itemId) {
    const item = getMenuItemById(itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification('Item added to cart!');
}

// Remove item from cart
function removeFromCart(itemId) {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        if (existingItem.quantity > 1) {
            existingItem.quantity--;
        } else {
            cart = cart.filter(cartItem => cartItem.id !== itemId);
        }
    }
    
    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    // Update cart count badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.classList.remove('hidden');
    } else {
        cartCount.classList.add('hidden');
    }
    
    // Update cart items display
    if (cart.length === 0) {
        cartEmpty.classList.remove('hidden');
        cartFooter.classList.add('hidden');
        cartItemsContainer.innerHTML = '';
    } else {
        cartEmpty.classList.add('hidden');
        cartFooter.classList.remove('hidden');
        renderCartItems();
    }
    
    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = `€${total.toFixed(2)}`;
}

// Render cart items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.name[currentLang]}</h3>
                <p>€${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn minus" onclick="removeFromCart(${item.id})">
                    <i data-lucide="minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" onclick="addToCart(${item.id})">
                    <i data-lucide="plus"></i>
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    lucide.createIcons();
}

// Cart operations
function openCart() {
    cartSidebar.classList.add('active');
    backdrop.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    backdrop.classList.remove('active');
}

// Order form operations
function openOrderForm() {
    if (cart.length === 0) return;
    
    closeCart();
    orderModal.classList.add('active');
    backdrop.classList.add('active');
}

function closeOrderForm() {
    orderModal.classList.remove('active');
    backdrop.classList.remove('active');
}

// Submit order with EmailJS
async function submitOrder() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const notes = document.getElementById('order-notes').value.trim();
    
    // Validation
    if (!name || !phone) {
        alert(currentLang === 'en' ? 
            'Please fill in name and phone number' : 
            'Täytä nimi ja puhelinnumero');
        return;
    }
    
    // Prepare order data
    const orderData = {
        customer: { name, phone, email, notes },
        items: cart.map(item => ({
            name: item.name[currentLang],
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date()
    };
    
    // Show loading
    closeOrderForm();
    showLoading();
    
    // Send email via EmailJS
    try {
        await sendOrderEmail(orderData);
        hideLoading();
        showSuccessModal();
        
        // Clear cart and form
        cart = [];
        updateCartUI();
        clearOrderForm();
        
    } catch (error) {
        hideLoading();
        console.error('Order failed:', error);
        alert(currentLang === 'en' ? 
            'Failed to send order. Please try again or call us.' : 
            'Tilauksen lähetys epäonnistui. Yritä uudelleen tai soita meille.');
    }
}

// Send order via EmailJS
function sendOrderEmail(orderData) {
    return new Promise((resolve, reject) => {
        // Format order items for email
        const itemsList = orderData.items.map(item => 
            `${item.name} x${item.quantity} - €${item.total.toFixed(2)}`
        ).join('\n');
        
        // Format date and time
        const orderTime = orderData.timestamp.toLocaleString(
            currentLang === 'en' ? 'en-GB' : 'fi-FI',
            { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit', 
                minute: '2-digit' 
            }
        );
        
        // Prepare template parameters
        const templateParams = {
            customer_name: orderData.customer.name,
            customer_phone: orderData.customer.phone,
            customer_email: orderData.customer.email || 'Not provided',
            order_items: itemsList,
            order_total: `€${orderData.total.toFixed(2)}`,
            order_notes: orderData.customer.notes || 'None',
            order_time: orderTime
        };
        
        // Check if EmailJS is configured
        if (typeof EMAILJS_CONFIG === 'undefined' || 
            EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY_HERE') {
            console.warn('EmailJS not configured! Order data:', orderData);
            // Simulate success for testing
            setTimeout(() => resolve(), 1000);
            return;
        }
        
        // Send via EmailJS
        emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        )
        .then(response => {
            console.log('Email sent successfully!', response);
            resolve(response);
        })
        .catch(error => {
            console.error('EmailJS error:', error);
            reject(error);
        });
    });
}

// Loading modal functions
function showLoading() {
    loadingModal.classList.add('active');
    backdrop.classList.add('active');
}

function hideLoading() {
    loadingModal.classList.remove('active');
}

// Show success modal
function showSuccessModal() {
    successModal.classList.add('active');
    backdrop.classList.add('active');
    lucide.createIcons();
    
    setTimeout(() => {
        successModal.classList.remove('active');
        backdrop.classList.remove('active');
    }, 3000);
}

// Clear order form
function clearOrderForm() {
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-email').value = '';
    document.getElementById('order-notes').value = '';
}

// Show notification (simple version)
function showNotification(message) {
    console.log('Notification:', message);
}

// Export functions for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.renderMenu = renderMenu;