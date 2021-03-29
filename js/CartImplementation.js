document.addEventListener("DOMContentLoaded", () => {
    const manager = new StyleManager();
    manager.toggleMenu();
    StyleManager.renderCartCount();
    console.log(LocalStorage.cart);
});