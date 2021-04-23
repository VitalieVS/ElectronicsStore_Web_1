class CheckOut {
    _cart = LocalStorage.cart;
    _products = [];
    _id;
    _color;
    _size;
    _shippingPrice = (LocalStorage.shipping) ? LocalStorage.shipping.value : 0;
    _discount = (LocalStorage.discount) ? LocalStorage.discount.value : 0;
    _paymentMethod = "Cash";

    constructor(service) {
        this._service = service;
        this.init();
    }

    init() {
        this.showCheckOut().then(() => {
            this.shippingListHandler();
            StyleManager.shippingHandler();
            this.removeHandler();
            this.quantityHandler();
            this.discount();
        });
        StyleManager.toggleMenu();
        StyleManager.renderCartCount();
        StyleManager.cartStateHandler(LocalStorage.cart === null);
        StyleManager.discountStateHandler(LocalStorage.discount);
        this.paymentMethodHandler();
        this.checkOutHandler();
    }

    async showCheckOut() {
        if (this._cart === null) return;
        for (const key in this._cart) {
            if (this._cart.hasOwnProperty(key)) {
                this._products.push(await this._service.getProduct(this._cart[key].id));
            }
        }

        StyleManager.renderCart(this._products);
        this.renderPrice("calculate");
        this.renderPrice("shipping");
    }

    quantityHandler() {
        const incrementBtns = document.querySelectorAll(".increment__btn");
        const decrementBtns = document.querySelectorAll(".decrement__btn");

        incrementBtns.forEach(btn => {
            btn.addEventListener("click", e => {
                this.setSpecs(e.target.closest("li"));
                this.increaseQuantity(e);
            })
        });

        decrementBtns.forEach(btn => {
            btn.addEventListener("click", e => {
                this.setSpecs(e.target.closest("li"));
                this.decreaseQuantity(e);
            })
        });
    }

    increaseQuantity(e) {
        const countContainer = e.target.parentNode.querySelector("span");
        const count = parseInt(countContainer.innerHTML) + 1;

        if (Cart.stockCount(this._products, this._id, this._color, this._size) >= count) {
            this.modifyValue('+');
            countContainer.innerHTML = `${count}`;
            this.renderPrice("calculate");
        }
        this.renderPrice("renderSetCart");
    }

    searchPredicate(item) {
        return item.id === this._id && item.color === this._color && item.size === this._size;
    }

    decreaseQuantity(e) {
        const countContainer = e.target.parentNode.querySelector("span");
        const count = parseInt(countContainer.innerHTML) - 1;

        if (Cart.stockCount(this._products, this._id, this._color, this._size) > count && count > 0) {
            this.modifyValue('-');
            countContainer.innerHTML = `${count}`;
            this.renderPrice("calculate");
        }
        this.renderPrice("renderSetCart");
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
        this._cart.forEach(item => {
            if (this.searchPredicate(item)) item.quantity = eval(`${item.quantity}${value}1`);
        });
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
            case "shipping" : {
                StyleManager.renderShipping();
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
        if (!LocalStorage.cart) LocalStorage.clearStorage();
        StyleManager.cartStateHandler(!LocalStorage.cart);
        node.remove();
    }

    calculateSubTotal() {
        return this._cart.reduce((accumulator, value) => accumulator + value.quantity * value.price, 0)
    }

    calculateTotal() {
        return this._cart.reduce((accumulator, value) => accumulator + value.quantity * value.price, 0)
            + this._shippingPrice - this._discount
    }

    shippingListHandler() {
        const list = document.querySelector(".shipping__companies").children;
        for (let listElement of list) {
            listElement.addEventListener("click", (e) => {
                this._shippingPrice = parseFloat(e.target.getAttribute("data-price"));
                this.renderPrice("calculate");
                LocalStorage.setShipping(e.target.innerHTML, this._shippingPrice);
                StyleManager.renderShipping();
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
            this.renderPrice("calculate");
            LocalStorage.setDiscount(discountResponse);
            StyleManager.discountStateHandler(true);
        })
    }

    checkOutHandler() {
        const checkOutBtn = document.getElementById("check__out__btn");
        const popUp = document.querySelector(".check__out__window");
        checkOutBtn.addEventListener("click", () => {
            popUp.classList.remove("disabled");
            this.popUpHandler(popUp);
        });
    }

    popUpHandler(poUup) {
        const closeBtn = document.getElementById("check__out__close");

        StyleManager.popupHandler();
        closeBtn.addEventListener("click", () => {
            poUup.classList.add("disabled");
        });
        this.validatePopup();
    }

    async sendOrder(userInfo) {
        const result = {
            "products": this._cart,
            "contact": userInfo,
            "shippingPrice": this._shippingPrice,
            "discount": LocalStorage.discount,
            "totalPrice": this.calculateTotal(),
            "paymentMethod": this._paymentMethod
        };
        if (LocalStorage.discount !== null) await this._service.deleteDiscount(LocalStorage.discount.id);
        await this._service.addOrder(result);
    }

    validatePopup() {
        const errorContainer = document.getElementById("error__container");
        const address = document.getElementById("address");
        const addressRegexp = /^[a-zA-Z0-9\s,'-]{4,}$/;
        const validate = document.getElementById("order");
        const phone = document.getElementById("phone");
        const phoneRegexp = /^[\+373|373]*[0]*[0-9]{7,8}$/;
        const forms = [
            document.getElementById("name"),
            document.getElementById("surname"),
            document.getElementById("city"),
            document.getElementById("country")
        ];

        forms.forEach(element => {
            element.addEventListener("keyup", () => {
                element.value = element.value.replace(/[^a-zA-Z]/g, '');
            })
        });

        validate.addEventListener("click", () => {
            if (!(new RegExp(addressRegexp).test(address.value) && address.value.length < 20)) {
                errorContainer.innerHTML = "Wrong address";
                return;
            }

            if (!(new RegExp(phoneRegexp).test(phone.value))) {
                errorContainer.innerHTML = "Wrong phone";
                return;
            }
            errorContainer.innerHTML = "";
            const popUp = document.querySelector(".check__out__window");

            const userInfo = {
                "name": forms[0].value,
                "surname": forms[1].value,
                "address": address.value,
                "phone": phone.value,
                "city": forms[2].value,
                "country": forms[3].value
            };

            this.sendOrder(userInfo).then(_ => _);
            LocalStorage.clearStorage();
            popUp.classList.add("disabled");
            StyleManager.cartStateHandler(true);
            document.getElementById("cart__products").innerHTML = "";
        });

    }

    paymentMethodHandler() {
        const paymentSelectorBtns = document.querySelectorAll(".payment__container a");
        paymentSelectorBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                StyleManager.resetPaymentMethodBtns();
                btn.style.border = '1px solid blue';
                this._paymentMethod = btn.innerHTML;
            })
        })
    }
}