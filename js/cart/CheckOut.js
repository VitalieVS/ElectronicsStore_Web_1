class CheckOut {
    cart = LocalStorage.cart;

    constructor(service) {
        this._service = service;
    }

    async showCheckOut() {
        if (this.cart === "empty") return;
        const toRender = [];
        for (const key in this.cart) {
            if (this.cart.hasOwnProperty(key)) {
                toRender.push(await this._service.getProduct(this.cart[key].id));
            }
        }

        StyleManager.renderCart(toRender);
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
        console.log(e.target.parentNode.querySelector("span"));
        e.target.parentNode.querySelector("span").innerHTML += 1; // rework here
    }

    decreaseQuantity(e) {
        console.log(e.target.closest(".item__count"));
    }

    removeHandler() {
        const removeButtons = document.querySelectorAll(".remove__btn");
        removeButtons.forEach(btn => {
            btn.addEventListener('click', e => this.removeFromCart(e));
        })
    }

    removeFromCart(e) {
        const node = e.target.closest("li");
        const color = node.querySelector(".item__color").innerHTML;
        const size = node.querySelector(".item__size").innerHTML;
        const id = node.getAttribute("data-id");

        this.cart.splice(this.cart.findIndex(item => item.id === id && item.color === color && item.size === size), 1);
        LocalStorage.setCart(this.cart);
        StyleManager.renderCartCount();
        node.remove();
        StyleManager.cartStateHandler(LocalStorage.cart === "empty");
    }
}