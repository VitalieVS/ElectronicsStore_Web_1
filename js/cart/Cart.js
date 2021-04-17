class Cart {
    _id;
    _color;
    _size;
    _price;

    constructor(cart) {
        this._cart = (typeof cart === "undefined") ? [] : cart;
        this._products = [];
    }

    addToCart() {
        const validItem = this.inCart() && this.checkQuantity();
        const canIncreaseCount = validItem || !this.inCart();
        const quantityInCart = this.inCart() && this.checkQuantity();
        const canAddItem = quantityInCart || !this.inCart();
        const stockOut = this.inCart() && !this.checkQuantity();

        if (stockOut) StyleManager.triggerOutOfStockNotification();
        if (canAddItem) StyleManager.triggerNotification();
        if (canIncreaseCount) StyleManager.increaseCartCount();
        if (validItem) this.modifyValue();
        if (!this.inCart()) this.pushToArray();

        LocalStorage.setCart(this._cart);
    }

    set color(color) {
        this._color = color;
    }

    addDiscount(id, value, code) {
        this._cart.push({
            id: id,
            value: value,
            code: code
        })
    }

    set size(size) {
        this._size = size;
    }

    set price(price) {
        this._price = price;
    }

    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
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

    setProducts(products) {
        this._products = products
    }

    inCart() {
        if (typeof this._cart === "undefined") return false;

        return this._cart.find(this.itemSearch, this);
    }

    itemSearch(item) {
        return item.id === this.id &&
            item.color === this.color &&
            item.size === this.size
    }

    pushToArray() {
        this._cart.push({
            id: this.id,
            color: this.color,
            size: this.size,
            quantity: 1,
            price: this.price
        });
    }

    checkQuantity() {
        return this._cart.find(this.itemSearch, this).quantity < this.stockCount();
    }

    stockCount() {
        let colorQuantity = null;
        let memoryQuantity = null;

        const element = this._products.find(({id}) => id === Number(this.id));

        if (element.colors)
            colorQuantity = element.colors.find(({color}) => color === this.color).quantity;

        if (element.memoryCapacity)
            memoryQuantity = element.memoryCapacity.find(({size}) => size === this.size).quantity;

        if (memoryQuantity && colorQuantity) return Math.min(colorQuantity, memoryQuantity);

        if (!memoryQuantity && colorQuantity) return colorQuantity;

        if (memoryQuantity && !colorQuantity) return memoryQuantity;

        return element.quantity;
    }

    modifyValue() {
        this._cart.forEach(item => {
            if (this.itemSearch(item)) item.quantity += 1;
        });
    }
}