class Shop {

}

class UI {
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

        for (const key of response) {
            const colorContainer = template.content.querySelector(".color");
            const memoryContainer = template.content.querySelector(".size");

            memoryContainer.innerHTML = "<h3>Memory Size:</h3>";
            colorContainer.innerHTML = "<h3>Color:</h3>";

            template.content.querySelector(
                "img").setAttribute("src", `img/iphone/${key.imageUrl}`);

            template.content.querySelector(
                "h2"
            ).textContent = key.title;

            for (const colorKey of key.colors) {
                if (colorKey.available) {
                    const colorSpan = document.createElement("span");
                    colorSpan.style.background = `${colorKey.color}`;
                    colorContainer.append(colorSpan);
                }
            }

            for (const memoryKey of key.memoryCapacity) {
                if (memoryKey.available) {
                    const memorySpan = document.createElement("span");
                    console.log(memoryKey.size);
                    memorySpan.textContent = `${memoryKey.size}`;
                    memoryContainer.append(memorySpan);
                }
            }

            template.content.querySelector("a").innerHTML = `${key.price}$ <i class="material-icons">add_shopping_cart</i>`;
            template.content.querySelector("a").setAttribute("data-id", `${key.id}`);
            const content = template.content.cloneNode(true);
            container.append(content);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleMenu = new ToggleMenu();
    const style = new StyleManager();
    const ui = new UI();

    toggleMenu.toggleMenu();
    ui.renderCategories().then(() => {
        style.selectBoxHandler();
        ui.optionListClickHandler();
    });
});