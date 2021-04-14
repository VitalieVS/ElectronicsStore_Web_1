class CheckOut {
    _cart = LocalStorage.cart;
    _products = [];
    _id;
    _color;
    _size;

    constructor(service) {
        this._service = service;
    }

    async showCheckOut() {
        if (this._cart === "empty") return;
        for (const key in this._cart) {
            if (this._cart.hasOwnProperty(key)) {
                this._products.push(await this._service.getProduct(this._cart[key].id));
            }
        }

        StyleManager.renderCart(this._products);
    }

    quantityHandler() {
        const incrementBtns = document.querySelectorAll(".increment__btn");
        const decrement = document.querySelectorAll(".decrement__btn");

        incrementBtns.forEach(btn => {
            btn.addEventListener("click", evt => this.increaseQuantity(evt))
        });

        decrement.forEach(btn => {
            btn.addEventListener("click", evt => this.decreaseQuantity(evt))
        })
    }

    increaseQuantity(e) {
        const increase = e.target.parentNode.querySelector("span");
        let count = parseInt(increase.innerHTML) + 1;



        increase.innerHTML = `${count}`;
    }

    searchPredicate(item) {
        return item.id === this._id && item.color === this._color && item.size === this._size;
    }

    decreaseQuantity(e) {
        const decrease = e.target.parentNode.querySelector("span");
        let count = parseInt(decrease.innerHTML) - 1;
        decrease.innerHTML = `${count}`;
    }

    removeHandler() {
        const removeButtons = document.querySelectorAll(".remove__btn");
        removeButtons.forEach(btn => {
            btn.addEventListener('click', e => this.removeFromCart(e));
        })
    }

    setSpecs(node) {
        this._color = node.querySelector(".item__color").innerHTML;
        this._size = node.querySelector(".item__size").innerHTML;
        this._id = node.getAttribute("data-id");
    }

    removeFromCart(e) {
        const node = e.target.closest("li");
        this.setSpecs(node);

        this._cart.splice(this._cart.findIndex(this.searchPredicate, this), 1);
        LocalStorage.setCart(this._cart);
        StyleManager.renderCartCount();
        node.remove();
        StyleManager.cartStateHandler(LocalStorage.cart === "empty");
    }
}