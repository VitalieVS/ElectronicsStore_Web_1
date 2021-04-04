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

    liClickHandler(evt) {

        if (evt.target.parentElement.classList[0] === "color") {
            StyleManager.resetColors(evt.target.parentElement);
            this._cart.color = evt.target.style.background;
            evt.target.style.borderRadius = "20%";
        }

        if (evt.target.parentElement.classList[0] === "size") {
            StyleManager.resetSize(evt.target.parentElement);
            this._cart.size = evt.target.innerHTML;
            evt.target.style.background = "#9bdc28";
        }


        if (evt.target.tagName === "A" || evt.target.tagName === "I") {
            console.log("ea tikal");
            this._cart.addToCart(evt.currentTarget.getAttribute("data-id"));
        }

       // this._cart.addToCart(currentId, evt.target.innerHTML,null);


        //console.log(this.cartItem);
        // this._cart.addToCart(evt.currentTarget.getAttribute("data-id"));
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