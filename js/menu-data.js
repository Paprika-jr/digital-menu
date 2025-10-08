// menu-data.js - Restaurant menu data
// You can easily modify this to add/remove/edit menu items

const menuData = {
    coffee: [
        {
            id: 1,
            name: {
                en: "Espresso",
                fi: "Espresso"
            },
            price: 2.50,
            description: {
                en: "Strong Italian coffee",
                fi: "Vahva italialainen kahvi"
            },
            category: "coffee",
            available: true
        },
        {
            id: 2,
            name: {
                en: "Cappuccino",
                fi: "Cappuccino"
            },
            price: 3.80,
            description: {
                en: "Espresso with steamed milk",
                fi: "Espresso höyrytetyllä maidolla"
            },
            category: "coffee",
            available: true
        },
        {
            id: 3,
            name: {
                en: "Latte",
                fi: "Latte"
            },
            price: 4.00,
            description: {
                en: "Smooth espresso with milk",
                fi: "Pehmeä espresso maidolla"
            },
            category: "coffee",
            available: true
        },
        {
            id: 4,
            name: {
                en: "Americano",
                fi: "Americano"
            },
            price: 3.00,
            description: {
                en: "Espresso with hot water",
                fi: "Espresso kuumalla vedellä"
            },
            category: "coffee",
            available: true
        }
    ],
    food: [
        {
            id: 5,
            name: {
                en: "Salmon Soup",
                fi: "Lohikeitto"
            },
            price: 12.50,
            description: {
                en: "Traditional Finnish salmon soup",
                fi: "Perinteinen suomalainen lohikeitto"
            },
            category: "food",
            available: true
        },
        {
            id: 6,
            name: {
                en: "Club Sandwich",
                fi: "Club-voileipä"
            },
            price: 9.90,
            description: {
                en: "Triple-decker with chicken",
                fi: "Kolmikerroksinen kanavoileipä"
            },
            category: "food",
            available: true
        },
        {
            id: 7,
            name: {
                en: "Caesar Salad",
                fi: "Caesar-salaatti"
            },
            price: 10.50,
            description: {
                en: "Fresh salad with chicken",
                fi: "Tuore salaatti kanalla"
            },
            category: "food",
            available: true
        },
        {
            id: 8,
            name: {
                en: "Burger & Fries",
                fi: "Burgeri & Ranskalaiset"
            },
            price: 11.90,
            description: {
                en: "Juicy beef burger with fries",
                fi: "Mehukas naudanlihaburgeri ranskalaisilla"
            },
            category: "food",
            available: true
        }
    ],
    desserts: [
        {
            id: 9,
            name: {
                en: "Blueberry Pie",
                fi: "Mustikkapiirakka"
            },
            price: 5.50,
            description: {
                en: "Homemade Finnish pie",
                fi: "Kotitekoinen suomalainen piirakka"
            },
            category: "desserts",
            available: true
        },
        {
            id: 10,
            name: {
                en: "Cinnamon Bun",
                fi: "Korvapuusti"
            },
            price: 3.50,
            description: {
                en: "Classic Finnish pastry",
                fi: "Klassinen suomalainen leivos"
            },
            category: "desserts",
            available: true
        },
        {
            id: 11,
            name: {
                en: "Chocolate Cake",
                fi: "Suklaakakku"
            },
            price: 6.00,
            description: {
                en: "Rich chocolate layer cake",
                fi: "Runsas suklaakerrokskakku"
            },
            category: "desserts",
            available: true
        }
    ]
};

// Function to get all menu items
function getAllMenuItems() {
    return menuData;
}

// Function to get items by category
function getMenuByCategory(category) {
    return menuData[category] || [];
}

// Function to get single item by ID
function getMenuItemById(id) {
    for (const category in menuData) {
        const item = menuData[category].find(item => item.id === id);
        if (item) return item;
    }
    return null;
}