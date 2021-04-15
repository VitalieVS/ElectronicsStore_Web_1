document.addEventListener("DOMContentLoaded", () => {
    const service = new Service();
    const checkOut = new CheckOut(service);

    StyleManager.toggleMenu();
    StyleManager.discountHandler();
    StyleManager.renderCartCount();
    StyleManager.cartStateHandler(LocalStorage.cart === "empty");

    checkOut.showCheckOut().then(() => {
            checkOut.shippingListHandler();
            StyleManager.shippingHandler();
            checkOut.removeHandler();
            checkOut.quantityHandler();
            checkOut.discount();
        }
    );
});