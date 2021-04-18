document.addEventListener("DOMContentLoaded", () => {
    new Shop(new Cart(LocalStorage.cart), new Service());
});