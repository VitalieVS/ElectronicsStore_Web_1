class Cart {
    _color;
    _size;
    _price;

    constructor(cart) {
        this._cart = (typeof cart === "undefined") ? [] : cart;
        this._products = [];
    }

    addToCart(id) {
        const validItem = this.inCart(id) && this.checkQuantity(id);
        const canIncreaseCount = validItem || !this.inCart(id);
        const quantityInCart = this.inCart(id) && this.checkQuantity(id);
        const canAddItem = quantityInCart || !this.inCart(id);
        const stockOut = this.inCart(id) && !this.checkQuantity(id);

        if (stockOut) StyleManager.triggerOutOfStockNotifcation();
        if (canAddItem) StyleManager.triggerNotification();
        if (canIncreaseCount) StyleManager.increaseCartCount();
        if (validItem) this.modifyValue(id);
        if (!this.inCart(id)) this.pushToArray(id);

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

    inCart(id) {
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
            item => item.id === id &&
                item.color === this.color &&
                item.size === this.size).quantity < this.stockCount(id);

    }

    stockCount(id) {
        let colorQuantity = null;
        let memoryQuantity = null;

        const element = this._products.find(element => element.id === Number(id));

        if (element.colors) {
            colorQuantity = element.colors.find(element => element.color === this.color).quantity;
        }

        if (element.memoryCapacity) {
            memoryQuantity = element.memoryCapacity.find(element => element.size === this.size).quantity;
        }

        if (memoryQuantity && colorQuantity) {
            return Math.min(colorQuantity, memoryQuantity)
        }

        if (!memoryQuantity && colorQuantity) {
            return colorQuantity
        }

        if (memoryQuantity && !colorQuantity) {
            return memoryQuantity
        }

        return element.quantity;
    }

    modifyValue(id) {
        this._cart.map(element => {
            if (element.id === id
                && element.color === this.color
                && element.size === this.size) {
                element.quantity += 1;
            }
        });
    }
}
