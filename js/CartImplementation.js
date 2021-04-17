document.addEventListener("DOMContentLoaded", () => {
    const service = new Service();
    const cart = new Cart();
    const checkOut = new CheckOut(service, cart);

    StyleManager.toggleMenu();
    StyleManager.renderCartCount();
    StyleManager.cartStateHandler(LocalStorage.cart === "empty");
    StyleManager.discountStateHandler(LocalStorage.discount);

    checkOut.showCheckOut().then(() => {
            checkOut.shippingListHandler();
            StyleManager.shippingHandler();
            checkOut.removeHandler();
            checkOut.quantityHandler();
            checkOut.discount();
        }
    );
});