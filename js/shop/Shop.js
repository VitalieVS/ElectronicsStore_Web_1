class Shop {
    constructor(cart, service) {
        this._cart = cart;
        this._service = service;
        this.init();
    }

    init() {
        StyleManager.renderCartCount();
        StyleManager.toggleMenu();
        this.showCategories().then(() => {
            StyleManager.selectBoxHandler();
            this.optionListClickHandler();
        });
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

        StyleManager.getRenderedProducts().forEach(product => {
            product.addEventListener("click", evt => {
                this.liClickHandler(evt);
            })
        })
    }

    resetFields(state) {
        if (state) {
            this._cart.color = null;
            this._cart.size = null;
            this._cart.price = null;
            return;
        }
        this._cart.size = null;
        this._cart.price = null;
    }

    async liClickHandler(evt) {
        const currTarget = evt.currentTarget;
        const target = evt.target;
        const item = await this._service.getProduct(currTarget.getAttribute("data-id"));

        if (currTarget.getAttribute("data-configurable") === "false") this.resetFields(true);


        if (currTarget.getAttribute("data-configurable") === "color-only") this.resetFields(false);

        if (target.parentElement.classList[0] === "color") { // too lazy to refactor :)
            StyleManager.resetColors(evt.target.parentElement);
            this._cart.color = target.style.background;
            evt.target.style.borderRadius = "20%";
        }

        if (target.parentElement.classList[0] === "size") {
            const itemPrice = this.getPrice(item, target.innerHTML);

            StyleManager.modifyPrice(itemPrice, currTarget);
            StyleManager.resetSize(target.parentElement);
            this._cart.size = target.innerHTML;
            this._cart.price = itemPrice;
            target.style.background = "#9bdc28";
        }

        if (this._cart.price === null) {
            this._cart.price = item.price;
        }

        if ((target.tagName === "A" || target.tagName === "I") && this._cart.size !== undefined) {
            this._cart.id = currTarget.getAttribute("data-id");
            this._cart.addToCart();
        }
    }

    getPrice(item, price) {
        return item.memoryCapacity.find(({size}) => size === price).price;
    }
}
