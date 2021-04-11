class CheckOut {
    constructor(service) {
        this._service = service;
    }

    async showCheckOut() {
        const cart = LocalStorage.cart;
        const toRender = [];
        for (const key in cart) {
            if (cart.hasOwnProperty(key)) {
                toRender.push(await this._service.getProduct(cart[key].id));
            }
        }

        StyleManager.renderCart(toRender);
    }

    removeHandler() {
        const removeBtns = document.querySelectorAll(".remove__btn");
        removeBtns.forEach(btn => {
            btn.addEventListener('click', e => this.removeFromCart(e));
        })
    }

    removeFromCart(e) {
        const node = e.target.parentNode.parentNode.parentNode;
       // console.log(e.target);
        console.log(e.target.closest("li"));
     //   console.log(e.target.parentNode.parentNode.parentNode);
        //e.target.parentNode.parentNode.parentNode.removeChild);
    }
}