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
}