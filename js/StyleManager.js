class StyleManager {
    constructor() {
        this.mainImage = document.querySelector(".imgBox .iphone");
        this.h2Text = document.querySelector(".content .textBox h2 span");
        this.circle = document.querySelector(".circle");
        this.learnMore = document.querySelector(".content .textBox a");
    }

    setStyle(imageSource, color) {
        this.mainImage.src = imageSource;
        this.h2Text.style.color = color;
        this.circle.style.background = color;
        this.learnMore.style.background = color;
    }

    liClickHandler() {
        const thumbItems = document.querySelectorAll(".thumb li img");
        thumbItems.forEach(elem => {
            elem.addEventListener("click", () => {
                const index = elem.src.indexOf("img/");
                let imageSource = elem.src.substring(index);
                let color = imageSource.split("_")[2].split(".")[0];
                imageSource = imageSource.replace("_mini", "");
                if (color === "gold") color = "#fedfc6";
                this.setStyle(imageSource, color);
            });
        });
    }

    selectBoxHandler() {
        const selected = document.querySelector(".selected");
        const optionsContainer = document.querySelector("#options-container");

        selected.addEventListener("click", () => {
            optionsContainer.classList.toggle("active");
        });
    }

    toggleMenu() {
        const toggle = document.querySelector(".toggle");
        const navigation = document.querySelector(".navigation");

        toggle.addEventListener("click", () => {
            toggle.classList.toggle("active");
            navigation.classList.toggle("active");
        })
    }

    static triggerNotification() {
        document.querySelector(".notification").classList.remove("disabled");
        setTimeout(() => {
            document.querySelector(".notification").classList.add("disabled");
        }, 1000)
    }

    static getRenderedProducts() {
        return document.querySelectorAll("#products li");
    }

    static renderCategories(categories) {
        const container = document.getElementById("options-container");
        const template = document.getElementById("div-option");

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

    static increaseCartCount() {
        const cartIcon = document.querySelector("header em");
        let currentCount = parseInt(cartIcon.getAttribute("value")) + 1;
        cartIcon.setAttribute("value", String(currentCount));
    }

    static renderCartCount() {
        const cartIcon = document.querySelector("header em");
        cartIcon.setAttribute("value", String(LocalStorage.quantity || 0));
    }

    static disableCard(id) {
        const li = document.querySelectorAll("#products li");
        li.forEach(elem => {
            if (elem.getAttribute("data-id") === id) {
                elem.classList.add("disabled");
            }
        })
    }

    static renderCart(response) {
        const template = document.getElementById("item__template");
        const container = document.getElementById("cart__products");
        const cart = LocalStorage.cart;

        for (const key in response) {
            if (response.hasOwnProperty(key)) {
                const imageURL = response[key].imageUrl.split("_");
                const url = `${imageURL[0]}_${imageURL[1]}_${cart[key].color}.png`;

                template.content.querySelector("li").setAttribute("data-id", response[key].id);
                template.content.querySelector(
                    "img").setAttribute("src", `img/${response[key].category}/${url}`);
                template.content.querySelector(".item__title h2").textContent = `${response[key].title} ${cart[key].color}`;
                template.content.querySelector(".item__quantity .item__count").textContent = cart[key].quantity;
                template.content.querySelector(".item__price h2").textContent = `$${cart[key].price || response[key].price}`;
                const content = template.content.cloneNode(true);
                container.append(content);
            }
        }
    }

    static resetColors(parent) {
        parent.querySelectorAll("span").forEach(span => {
            span.style.borderRadius = "50%";
        })
    }

    static resetSize(parent) {
        parent.querySelectorAll("span").forEach(span => {
            span.style.background = "#fff";
        })
    }

    static modifyPrice(price, element) {
        element.querySelector("a").innerHTML = `$${price}`;
    }

    static renderProducts(response) {
        const template = document.getElementById("product-card");
        const container = document.getElementById("products");
        container.innerHTML = "";

        for (let key in response) {
            if (response.hasOwnProperty(key)) {
                const memoryContainer = template.content.querySelector(".size");
                const colorContainer = template.content.querySelector(".color");

                template.content.querySelector("li").setAttribute("data-id", response[key].id);
                template.content.querySelector("li").setAttribute(
                    "data-quantity", response[key].quantity);

                template.content.querySelector(
                    "img").setAttribute("src", `img/${response[key].category}/${response[key].imageUrl}`);

                template.content.querySelector(
                    "h2"
                ).textContent = response[key].title;

                colorContainer.innerHTML = response[key].colors ? "<h3>Color:</h3>" : "";
                for (let keyColor in response[key].colors) {
                    if (response[key].colors.hasOwnProperty(keyColor)) {
                        if (response[key].colors[keyColor].available) {
                            const colorSpan = document.createElement("span");
                            colorSpan.style.background = `${response[key].colors[keyColor].color}`;
                            colorContainer.append(colorSpan);
                        }
                    }
                }

                memoryContainer.innerHTML = response[key].memoryCapacity ? "<h3>Color:</h3>" : "";
                for (let memoryKey in response[key].memoryCapacity) {
                    if (response[key].memoryCapacity.hasOwnProperty(memoryKey)) {
                        if (response[key].memoryCapacity[memoryKey].available) {
                            const memorySpan = document.createElement("span");
                            memorySpan.textContent = `${response[key].memoryCapacity[memoryKey].size}`;
                            memoryContainer.append(memorySpan);
                        }
                    }
                }
                template.content.querySelector("a").innerHTML = `${response[key].price}$ <i class="fas fa-credit-card"></i>`;
                template.content.querySelector("a").setAttribute("data-id", `${response[key].id}`);
                const content = template.content.cloneNode(true);
                container.append(content);
            }
        }
    }
}
