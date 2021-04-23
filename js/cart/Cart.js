class Cart {
    _id;
    _color;
    _size;
    _price;
    _products = [];

    constructor(cart) {
        this._cart = (cart === null) ? [] : cart;
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
        this._color = color
    }

    set size(size) {
        this._size = size
    }

    set price(price) {
        this._price = price
    }

    set id(id) {
        this._id = id
    }

    get id() {
        return this._id
    }

    get color() {
        return this._color
    }

    get size() {
        return this._size
    }

    get price() {
        return this._price
    }

    setProducts(products) {
        this._products = products
    }

    inCart() {
        if (this._cart === null) return false;

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
        return this._cart.find(this.itemSearch, this).quantity < Cart.stockCount(this._products, this.id, this.color, this.size);
    }

    static stockCount(products, id, color, size) {
        const countArray = [];
        const element = products.find(product => product.id === Number(id));

        if (element.colors)
            countArray.push(element.colors.find(product => product.color === color).quantity);

        if (element.memoryCapacity)
            countArray.push(element.memoryCapacity.find(product => product.size === size).quantity);

        return Math.min(...countArray.filter(elem => elem !== null));
    }

    modifyValue() {
        this._cart.forEach(item => {
            if (this.itemSearch(item)) item.quantity += 1;
        });
    }
}