class CheckOut {
    _cart = LocalStorage.cart;
    _products = [];
    _id;
    _color;
    _size;
    _shippingPrice = 0;
    _discount = (LocalStorage.discount) ? LocalStorage.discount.value : 0;

    constructor(service, cart) {
        this._service = service;
        this._cartObject = cart;
    }

    async showCheckOut() {
        if (this._cart === "empty") return;
        for (const key in this._cart) {
            if (this._cart.hasOwnProperty(key)) {
                this._products.push(await this._service.getProduct(this._cart[key].id));
            }
        }

        StyleManager.renderCart(this._products);
        this.renderPrice("calculate");
    }

    quantityHandler() {
        const incrementBtns = document.querySelectorAll(".increment__btn");
        const decrement = document.querySelectorAll(".decrement__btn");

        incrementBtns.forEach(btn => {
            btn.addEventListener("click", e => {
                this.setSpecs(e.target.closest("li"));
                this.increaseQuantity(e);
            })
        });

        decrement.forEach(btn => {
            btn.addEventListener("click", e => {
                this.setSpecs(e.target.closest("li"));
                this.decreaseQuantity(e);
            })
        });
    }

    increaseQuantity(e) {
        const increase = e.target.parentNode.querySelector("span");
        let count = parseInt(increase.innerHTML) + 1;

        if (this.searchProducts() >= count) {
            this.modifyValue(1);
            increase.innerHTML = `${count}`;
            this.renderPrice("calculate");
        }
        this.renderPrice("renderSetCart");
    }

    searchPredicate(item) {
        return item.id === this._id && item.color === this._color && item.size === this._size;
    }

    decreaseQuantity(e) {
        const decrease = e.target.parentNode.querySelector("span");
        let count = parseInt(decrease.innerHTML) - 1;

        if (this.searchProducts() > count && count > 0) {
            this.modifyValue();
            decrease.innerHTML = `${count}`;
            this.renderPrice("calculate");
        }
        this.renderPrice("renderSetCart");
    }

    searchProducts() { // to fix -> DRY
        let colorQuantity = null;
        let memoryQuantity = null;

        const product = this._products.find(({id}) => id === Number(this._id));

        if (product.colors)
            colorQuantity = product.colors.find(({color}) => color === this._color).quantity;

        if (product.memoryCapacity)
            memoryQuantity = product.memoryCapacity.find(({size}) => size === this._size).quantity;

        if (memoryQuantity && colorQuantity) return Math.min(colorQuantity, memoryQuantity);

        if (!memoryQuantity && colorQuantity) return colorQuantity;

        if (memoryQuantity && !colorQuantity) return memoryQuantity;

        return product.quantity;
    }

    removeHandler() {
        const removeButtons = document.querySelectorAll(".remove__btn");
        removeButtons.forEach(btn => {
            btn.addEventListener('click', e => this.removeFromCart(e));
        })
    }

    setSpecs(node) {
        this._color = node.querySelector(".item__color").innerHTML || null;
        this._size = node.querySelector(".item__size").innerHTML || null;
        this._id = node.getAttribute("data-id");
    }

    modifyValue(value) {
        if (value === 1) {
            this._cart.forEach(item => {
                if (this.searchPredicate(item)) item.quantity += 1;
            });
            return;
        }
        this._cart.forEach(item => {
            if (this.searchPredicate(item)) item.quantity -= 1;
        });
        this.renderPrice();
    }

    renderPrice(state) {
        switch (state) {
            case "calculate" : {
                StyleManager.renderSubTotal(this.calculateSubTotal());
                StyleManager.renderTotal(this.calculateTotal());
                break;
            }
            case "renderSetCart" : {
                LocalStorage.setCart(this._cart);
                StyleManager.renderCartCount();
                break;
            }
        }
    }

    removeFromCart(e) {
        const node = e.target.closest("li");
        this.setSpecs(node);
        this._cart.splice(this._cart.findIndex(this.searchPredicate, this), 1);
        this.renderPrice("calculate");
        this.renderPrice("renderSetCart");
        node.remove();
        StyleManager.cartStateHandler(LocalStorage.cart === "empty");
    }

    calculateSubTotal() {
        return this._cart.reduce((accumulator, value) => accumulator + value.quantity * value.price, 0)
    }

    calculateTotal() {
        return this._cart.reduce((accumulator, value) => accumulator + value.quantity * value.price, 0)
            - this._shippingPrice - this._discount
    }

    shippingListHandler() {
        const list = document.querySelector(".shipping__companies").children;
        for (let listElement of list) {
            listElement.addEventListener("click", (e) => {
                this._shippingPrice = parseFloat(e.target.getAttribute("data-price"));
                document.querySelector(".shipping__price span").innerHTML = `$${this._shippingPrice}`;
                this.renderPrice("calculate");
                LocalStorage.setShipping(e.target.innerHTML, this._shippingPrice);
            })
        }
    }

    discount() {
        const discount = document.getElementById("discount__btn");

        discount.addEventListener("click", async () => {
            const discountCode = document.getElementById("discount__holder");
            const discountResponse = (discountCode.value.length === 12) ?
                await this._service.getDiscount(discountCode.value) : null;

            if (discountResponse === null || discountResponse.code === null) {
                discountCode.value = "";
                return;
            }

            this._discount = discountResponse.value;
            await this._service.deleteDiscount(discountResponse.id);
            this._cartObject.addDiscount(discountResponse.id, discountResponse.value, discountResponse.code);
            this.renderPrice("calculate");
            LocalStorage.setDiscount(discountResponse);
            StyleManager.discountStateHandler(true);
        })
    }

}