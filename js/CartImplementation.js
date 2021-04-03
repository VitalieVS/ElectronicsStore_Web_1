document.addEventListener("DOMContentLoaded", () => {
    const manager = new StyleManager();
    const service = new Service();
    const checkOut = new CheckOut(service);

    manager.toggleMenu();
    StyleManager.renderCartCount();

    if (LocalStorage.cart === "empty") {
        document.querySelector("section .cart__container .cart__empty").classList.remove("disabled");
    } else {
        checkOut.showCheckOut();
    }
});