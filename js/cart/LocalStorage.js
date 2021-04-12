class LocalStorage {
    static get cart() {
        return JSON.parse(localStorage.getItem("cart")) || "empty";
    }

    static get quantity() {
        let quantity = 0;
        for (const property in this.cart) {
            if (this.cart.hasOwnProperty(property)) {
                quantity += this.cart[property].quantity;
            }
        }
        return quantity;
    }

    static setCart(cart) {
        localStorage.clear();
        if (cart.length > 0) localStorage.setItem("cart", JSON.stringify(cart));
    }
}