class LocalStorage {
    static get cart() {
        return JSON.parse(localStorage.getItem("cart")) || "empty";
    }

    static get quantity() {
        const currentCart = this.cart;
        let sum = 0;
        for (const property in currentCart) {
            if (currentCart.hasOwnProperty(property)) {
                sum += currentCart[property].quantity;
            }
        }
        return sum;
    }

    static setCart(cart) {
        localStorage.clear();
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}