document.addEventListener("DOMContentLoaded", () => {
    const manager = new StyleManager();
    StyleManager.toggleMenu();
    manager.liClickHandler();
    StyleManager.renderCartCount();
});