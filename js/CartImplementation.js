document.addEventListener("DOMContentLoaded", () => {
    const service = new Service();
    const checkOut = new CheckOut(service);

    StyleManager.toggleMenu();
    StyleManager.renderCartCount();

    // if (LocalStorage.cart === "empty") {
    //     document.querySelector("section .cart__container .cart__empty").classList.remove("disabled");
    //     document.querySelector("section .cart__container .cart__review").classList.add("disabled");
    // }

    StyleManager.cartStateHandler(LocalStorage.cart === "empty");

    checkOut.showCheckOut().then(() => {
            checkOut.removeHandler();
        }
    );
});