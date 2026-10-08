const API_BASE = 'http://localhost:5000/api';
const USER_ID = 'hackathon_user_1'; // Hardcoded for simplicity

// Load initial data
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    fetchCart();
});

async function fetchProducts() {
    const res = await fetch(`${API_BASE}/products`);
    const products = await res.json();
    const grid = document.getElementById('product-grid');
    
    grid.innerHTML = products.map(p => `
        <div class="card">
            <div class="icon">${p.image}</div>
            <h3>${p.name}</h3>
            <div class="price">$${p.price.toFixed(2)}</div>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

async function fetchCart() {
    const res = await fetch(`${API_BASE}/cart/${USER_ID}`);
    const data = await res.json();
    
    const cartContainer = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    if (data.cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cartContainer.innerHTML = data.cart.map(item => `
            <div class="cart-item">
                <span>${item.image} ${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
    totalPrice.innerText = data.total.toFixed(2);
}

async function addToCart(productId) {
    await fetch(`${API_BASE}/cart/${USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId })
    });
    fetchCart(); // Refresh cart UI
    showMessage("Item added!", "#4ecdc4");
}

async function checkout() {
    const res = await fetch(`${API_BASE}/checkout/${USER_ID}`, { method: 'POST' });
    const data = await res.json();
    
    if (res.ok) {
        showMessage(`🎉 ${data.message} ID: ${data.order_id.substring(0,8)}`, "#4ecdc4");
        fetchCart(); // Clear cart UI
    } else {
        showMessage("❌ Cart is empty!", "#ff6b6b");
    }
}

function showMessage(msg, color) {
    const box = document.getElementById('message-box');
    box.style.color = color;
    box.innerText = msg;
    setTimeout(() => box.innerText = '', 3000);
}