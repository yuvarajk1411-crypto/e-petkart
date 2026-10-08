from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app) # Crucial: Allows the frontend to communicate with this API

PRODUCTS = [
    {"id": 1, "name": "Premium Dog Food", "price": 45.99, "image": "🐕"},
    {"id": 2, "name": "Multi-Level Cat Tree", "price": 89.50, "image": "🐈"},
    {"id": 3, "name": "Interactive Laser Toy", "price": 12.99, "image": "🔦"},
    {"id": 4, "name": "Orthopedic Pet Bed", "price": 35.00, "image": "🛏️"},
    {"id": 5, "name": "Squeaky Bone", "price": 8.50, "image": "🦴"},
    {"id": 6, "name": "Aquarium Filter", "price": 22.00, "image": "🐟"}
]

CARTS = {}

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(PRODUCTS), 200

@app.route('/api/cart/<user_id>', methods=['GET'])
def get_cart(user_id):
    cart = CARTS.get(user_id, [])
    total = sum(item['price'] * item['quantity'] for item in cart)
    return jsonify({"cart": cart, "total": round(total, 2)}), 200

@app.route('/api/cart/<user_id>', methods=['POST'])
def add_to_cart(user_id):
    data = request.json
    product_id = data.get('product_id')
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    
    if not product:
        return jsonify({"error": "Product not found"}), 404

    if user_id not in CARTS:
        CARTS[user_id] = []

    for item in CARTS[user_id]:
        if item['id'] == product_id:
            item['quantity'] += 1
            return jsonify({"message": "Quantity updated"}), 200

    cart_item = product.copy()
    cart_item['quantity'] = 1
    CARTS[user_id].append(cart_item)
    return jsonify({"message": "Added to cart"}), 201

@app.route('/api/checkout/<user_id>', methods=['POST'])
def checkout(user_id):
    if user_id not in CARTS or not CARTS[user_id]:
        return jsonify({"error": "Cart is empty"}), 400
    
    CARTS[user_id] = [] 
    return jsonify({"message": "Order placed successfully!", "order_id": str(uuid.uuid4())}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)