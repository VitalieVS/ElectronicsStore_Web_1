document.addEventListener("DOMContentLoaded", () => {
    const manager = new StyleManager();
    manager.toggleMenu();
    StyleManager.renderCartCount();
    StyleManager.renderCart(LocalStorage.cart);
});