class Shop {
    constructor(cart, service) {
        this._cart = cart;
        this._service = service;
    }

    async showCategories() {
        const categories = await this._service.getCategories();
        StyleManager.renderCategories(categories);
    }

    optionListClickHandler() {
        return new Promise(resolve => {
            const optionsList = document.querySelectorAll(".option");
            const selected = document.querySelector(".selected");
            const optionsContainer = document.querySelector("#options-container");

            for (const option of optionsList) {
                option.addEventListener("click", () => {
                    selected.innerHTML = option.querySelector("label").innerHTML;
                    optionsContainer.classList.remove("active");
                    this.showProducts(selected.innerHTML.trim().toLowerCase()).then();
                })
            }
            resolve();
        })
    }

    async showProducts(category) {
        const response = await this._service.getProducts(category);

        this._cart.setProducts(response);
        StyleManager.renderProducts(response);

        StyleManager.getRenderedProducts().forEach(element => {
            element.addEventListener("click", evt => {
                this.liClickHandler(evt);
            })
        })
    }

    async liClickHandler(evt) {
        const currID = evt.currentTarget.getAttribute("data-id");
        const currTarget = evt.currentTarget;
        const target = evt.target;

        if (target.parentElement.classList[0] === "color") {
            StyleManager.resetColors(evt.target.parentElement);
            this._cart.color = target.style.background;
            evt.target.style.borderRadius = "20%";
        }

        if (target.parentElement.classList[0] === "size") {
            const item = await this._service.getProduct(currID);
            StyleManager.modifyPrice(this.getPrice(item, target.innerHTML), currTarget);
            StyleManager.resetSize(target.parentElement);
            this._cart.size = target.innerHTML;
            target.style.background = "#9bdc28";
        }

        if (target.tagName === "A" || target.tagName === "I") {
            this._cart.addToCart(currTarget.getAttribute("data-id"));
        }

    }

    getPrice(item, price) {
      return item.memoryCapacity.find(element => element.size === price).price;
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const style = new StyleManager();
    const service = new Service();
    const localStorageCart = localStorage.getItem("cart") || 0;
    const cartInstance =
        (localStorageCart.length > 0) ? new Cart(JSON.parse(localStorageCart)) : new Cart();
    const shop = new Shop(cartInstance, service);

    StyleManager.renderCartCount();

    style.toggleMenu();
    shop.showCategories().then(() => {
        style.selectBoxHandler();
        shop.optionListClickHandler();
    });
});