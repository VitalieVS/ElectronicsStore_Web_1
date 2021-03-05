document.addEventListener("DOMContentLoaded", () => {
    const manager = new StyleManager();
    const toggleMenu = new ToggleMenu();
    toggleMenu.toggleMenu();
    manager.liClickHandler();
});