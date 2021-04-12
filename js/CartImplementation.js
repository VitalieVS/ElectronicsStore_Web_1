document.addEventListener("DOMContentLoaded", () => {
    const service = new Service();
    const checkOut = new CheckOut(service);

    StyleManager.toggleMenu();
    StyleManager.renderCartCount();
    StyleManager.cartStateHandler(LocalStorage.cart === "empty");

    checkOut.showCheckOut().then(() => {
            checkOut.removeHandler();
        }
    );
});