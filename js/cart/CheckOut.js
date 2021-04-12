class CheckOut {
    cart = LocalStorage.cart;

    constructor(service) {
        this._service = service;
    }

    async showCheckOut() {
        const toRender = [];
        for (const key in this.cart) {
            if (this.cart.hasOwnProperty(key)) {
                toRender.push(await this._service.getProduct(this.cart[key].id));
            }
        }

        StyleManager.renderCart(toRender);
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

        if (LocalStorage.cart === "empty") {

        }

    }
}