class LocalStorage {
    static get cart() {
        return JSON.parse(localStorage.getItem("cart")) || "empty";
    }

    static get quantity() {
        if (this.cart === "empty") return 0;

        return this.cart.reduce((prev, cur) => {
            return prev + cur.quantity;
        }, 0);
    }

    static setCart(cart) {
        localStorage.clear();
        if (cart.length > 0) localStorage.setItem("cart", JSON.stringify(cart));
    }
}