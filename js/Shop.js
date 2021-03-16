class Shop {

}

class Cart {
    cart = [];

    addToCart(id) {
        if (this.isInCart(id)) {
            for (const value of Object.values(this.cart)) {
                if (value.id === id) {
                    value.quantity += 1;
                }
            }
        } else {
            this.cart.push(
                {
                    id: id,
                    quantity: 1
                }
            )
        }
    }

    isInCart(id) {
        for (const value of Object.values(this.cart)) {
            if (value.id === id) {
                return true;
            }
        }
        return false;
    }

    showCart() {
        return this.cart;
    }
}

class UI {
    constructor(cart) {
        this.cart = cart;
    }

    getCategories() {
        return new Promise((resolve) => {
            const API = new Service();
            API.GET("http://localhost:8080/categories")
                .then(response => {
                    resolve(response.data)
                });
        });
    }

    getProducts(category) {
        return new Promise((resolve) => {
            const API = new Service();
            API.GET(`http://localhost:8080/products/${category}`)
                .then(response => {
                    resolve(response.data);
                })
        })
    }

    async renderCategories() {
        const container = document.getElementById("options-container");
        const template = document.getElementById("div-option");
        const categories = await this.getCategories();

        categories.forEach(elem => {
            template.content.querySelector(
                ".option input").setAttribute("id", `${elem.name.toLowerCase()}`);
            template.content.querySelector(
                ".option label").setAttribute("for", `${elem.name.toLowerCase()}`);
            template.content.querySelector(".option label").textContent = elem.name;
            const content = template.content.cloneNode(true);
            container.append(content);
        });
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
                    this.renderCategoryProduct(selected.innerHTML.trim().toLowerCase()).then();
                })
            }
            resolve();
        })
    }

    async renderCategoryProduct(category) {
        const template = document.getElementById("product-card");
        const container = document.getElementById("products");
        const response = await this.getProducts(category);

        container.innerHTML = "";

        for (let key in response) {
            if (response.hasOwnProperty(key)) {
                const colorContainer = template.content.querySelector(".color");
                const memoryContainer = template.content.querySelector(".size");
                template.content.querySelector("li").setAttribute("data-id", response[key].id);

                memoryContainer.innerHTML = "<h3>Memory Size:</h3>";
                colorContainer.innerHTML = "<h3>Color:</h3>";

                template.content.querySelector(
                    "img").setAttribute("src", `img/iphone/${response[key].imageUrl}`);

                template.content.querySelector(
                    "h2"
                ).textContent = response[key].title;

                for (let keyColor in response[key].colors) {
                    if (response[key].colors.hasOwnProperty(keyColor)) {
                        if (response[key].colors[keyColor].available) {
                            const colorSpan = document.createElement("span");
                            colorSpan.style.background = `${response[key].colors[keyColor].color}`;
                            colorContainer.append(colorSpan);
                        }
                    }
                }

                for (let memoryKey in response[key].memoryCapacity) {
                    if (response[key].memoryCapacity.hasOwnProperty(memoryKey)) {
                        if (response[key].memoryCapacity[memoryKey].available) {
                            const memorySpan = document.createElement("span");
                            memorySpan.textContent = `${response[key].memoryCapacity[memoryKey].size}`;
                            memoryContainer.append(memorySpan);
                        }
                    }
                }

                template.content.querySelector("a").innerHTML = `${response[key].price}$ <i class="material-icons">add_shopping_cart</i>`;
                template.content.querySelector("a").setAttribute("data-id", `${response[key].id}`);
                const content = template.content.cloneNode(true);
                container.append(content);
            }
        }

        this.getRenderedProducts().forEach(element => {
            element.addEventListener("click", evt => {
                this.liClickHandler(evt);
            })
        })
    }

    getRenderedProducts() {
        return document.querySelectorAll("#products li");
    }

    liClickHandler(evt) {
        this.cart.addToCart(evt.currentTarget.getAttribute("data-id"));
        console.log(this.cart.showCart());
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleMenu = new ToggleMenu();
    const style = new StyleManager();
    const ui = new UI(new Cart());

    toggleMenu.toggleMenu();
    ui.renderCategories().then(() => {
        style.selectBoxHandler();
        ui.optionListClickHandler();
    });
});