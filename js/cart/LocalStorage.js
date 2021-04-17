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
        if (cart.length > 0) localStorage.setItem("cart", JSON.stringify(cart));
    }

    static setDiscount(discount) {
        localStorage.setItem("discount", JSON.stringify(discount));
    }

    static get discount() {
        return JSON.parse(localStorage.getItem("discount")) || null;
    }

}