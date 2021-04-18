document.addEventListener("DOMContentLoaded", () => {
    const service = new Service();
    const localStorageCart = localStorage.getItem("cart") || 0;
    const cartInstance =
        (localStorageCart.length > 0) ? new Cart(JSON.parse(localStorageCart)) : new Cart();
    const shop = new Shop(cartInstance, service);

    StyleManager.renderCartCount();

    StyleManager.toggleMenu();
    shop.showCategories().then(() => {
        StyleManager.selectBoxHandler();
        shop.optionListClickHandler();
    });
});