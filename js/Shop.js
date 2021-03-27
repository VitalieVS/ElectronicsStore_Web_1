class Shop {
    constructor(cart, style) {
        this.cart = cart;
        this.style = style;
    }

    getCategories(API) {
        return new Promise((resolve) => {
            API.GET("http://localhost:8080/categories")
                .then(response => {
                    resolve(response.data)
                }).catch();
        });
    }

    getProducts(API, category) {
        return new Promise((resolve) => {
            API.GET(`http://localhost:8080/products/${category}`)
                .then(response => {
                    resolve(response.data);
                })
        })
    }

    async showCategories() {
        const categories = await this.getCategories(new Service());
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
        const response = await this.getProducts(new Service(), category);
        this.cart.setProducts(response);
        StyleManager.renderProducts(response);

        StyleManager.getRenderedProducts().forEach(element => {
            element.addEventListener("click", evt => {
                this.liClickHandler(evt);
            })
        })
    }

    liClickHandler(evt) {
        this.cart.addToCart(evt.currentTarget.getAttribute("data-id"));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const style = new StyleManager();
    const localStorageCart = localStorage.getItem("cart");
    let shop;

    if (localStorageCart.length > 0) {
        shop = new Shop(new Cart(JSON.parse(localStorageCart)));
    } else {
        shop = new Shop(new Cart());
    }

    StyleManager.renderCartCount();

    style.toggleMenu();
    shop.showCategories().then(() => {
        style.selectBoxHandler();
        shop.optionListClickHandler();
    });
});