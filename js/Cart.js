class Cart {
    constructor(cart) {
        this._cart = (typeof cart === "undefined") ? [] : cart;
        this._products = [];
    }

    addToCart(id) {
        if (this.isInCart(id)) {
            if (this.checkQuantity(id)) StyleManager.increaseCartCount();
        } else {
            StyleManager.increaseCartCount();
        }
        const canTriggerNotification = (this.isInCart(id) && this.checkQuantity(id)) || !this.isInCart(id);
        this.isInCart(id) ? this.checkQuantity(id) ? this.modifyValue(id) : StyleManager.disableCard(id) : this.pushToArray(id);
        if (canTriggerNotification) StyleManager.triggerNotification();

        this.setCartToLocalStorage();
    }

    setCartToLocalStorage() {
        localStorage.clear();
        localStorage.setItem("cart", JSON.stringify(this._cart));
    }

    setProducts(products) {
        this._products = products
    }

    isInCart(id) {
        if (typeof this._cart === "undefined") return false;

        return this._cart.find(element => element.id === id);
    }

    pushToArray(id) {
        this._cart.push(
            {
                id: id,
                quantity: 1
            }
        )
    }

    checkQuantity(id) {
        return this._cart.find(
            item => item.id === id).quantity < this.stockCount(id);
    }

    stockCount(id) {
        return this._products.find(product => product.id === Number(id)).quantity;
    }

    modifyValue(id) {
        this._cart.map(element => {
            if (element.id === id) {
                element.quantity += 1;
            }
    });
    }
}
