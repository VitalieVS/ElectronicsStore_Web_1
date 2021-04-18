document.addEventListener("DOMContentLoaded", () => {
    const cartInstance = ((localStorage.getItem("cart") || 0).length > 0) ?
        new Cart(JSON.parse(localStorage.getItem("cart") || 0)) : new Cart();

    const shop = new Shop(cartInstance, new Service());

    shop.showCategories().then(() => {
        StyleManager.selectBoxHandler();
        shop.optionListClickHandler();
    });
});