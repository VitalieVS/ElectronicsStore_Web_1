class Cart {
    _cart = [];
    _products = [];

    addToCart(id) {
        if (this.isInCart(id)) {
            if (this.checkQuantity(id)) {
              StyleManager.triggerNotification();
              this.modifyValue(id);
              StyleManager.renderCartCount();
            } else {
               StyleManager.disableCard(id);
            }
        } else {
           StyleManager.triggerNotification();
           StyleManager.renderCartCount();
           this.pushToArray(id);
        }
        this.setCartToLocalStorage();
    }

    setCartToLocalStorage() {
        localStorage.clear();
        localStorage.setItem("cart", JSON.stringify(this._cart));
    }

    setProducts(products) {
        this._products = products
    }

    isInCart(id) {
        return this._cart.find(element => element.id === id);
    }

    pushToArray(id) {
        this._cart.push(
            {
                id: id,
                quantity: 1
            }
        )
    }

    checkQuantity(id) {
        return this._cart.find(
            item => item.id === id).quantity < this.stockCount(id);
    }

    stockCount(id) {
        return this._products.find(product => product.id === Number(id)).quantity;
    }

    modifyValue(id) {
        this._cart.map(element => {
            (element.id === id) ? element.quantity += 1 : 0;
        });
    }
}

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
    const shop = new Shop(new Cart());

    style.toggleMenu();
    shop.showCategories().then(() => {
        style.selectBoxHandler();
        shop.optionListClickHandler();
    });
});