class Cart {
    _color;
    _size;
    _price;

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

    set color(color) {
        this._color = color;
    }

    set size(size) {
        this._size = size;
    }

    set price(price) {
        this._price = price;
    }

    get color() {
        return this._color;
    }

    get size() {
        return this._size;
    }

    get price() {
        return this._price;
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


        return this._cart.find(element =>
            element.id === id &&
            element.color === this.color &&
            element.size === this.size);
    }

    pushToArray(id) {
        this._cart.push({
            id: id,
            color: this.color,
            size: this.size,
            quantity: 1,
            price: this.price
        });
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
