class Shop {

}

class UI {
    getCategories() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const API = new Service();
                API.GET("http://localhost:8080/categories")
                    .then(response => {
                        resolve(response.data)
                    });
            }, 300)
        });
    }

    getProducts(category) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const API = new Service();
                API.GET(`http://localhost:8080/products/${category}`)
                    .then(response => {
                        resolve(response.data);
                    })
            }, 300)
        })
    }

    renderCategories(categories) {
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

    optionListClickHandler() {
        return new Promise(resolve => {
            setTimeout(() => {
                const optionsList = document.querySelectorAll(".option");
                const selected = document.querySelector(".selected");
                const optionsContainer = document.querySelector("#options-container");

                optionsList.forEach(option => {
                    option.addEventListener("click", () => {
                        selected.innerHTML = option.querySelector("label").innerHTML;
                        optionsContainer.classList.remove("active");

                        this.renderCategoryProduct(selected.innerHTML.trim().toLowerCase());
                    })
                });
                resolve();
            }, 300)
        })
    }

    renderCategoryProduct(category) {
        const template = document.getElementById("product-card");
        const container = document.getElementById("products");

        this.getProducts(category)
            .then(response => {
                container.innerHTML = "";

                response.forEach(elem =>  {
                    const colorContainer = template.content.querySelector(".color");
                    const memoryContainer = template.content.querySelector(".size");

                    memoryContainer.innerHTML = "<h3>Color:</h3>";
                    colorContainer.innerHTML = "<h3>Memory Size:</h3>";

                    template.content.querySelector(
                        "img").setAttribute("src", `img/iphone/${elem.imageUrl}`);

                    template.content.querySelector(
                        "h2"
                    ).textContent = elem.title;

                    elem.colors.forEach(color => {
                        if (color.available === true) {
                            const colorSpan = document.createElement("span");
                            colorSpan.style.background = `${color.color}`;
                            colorContainer.append(colorSpan);
                        }
                    });

                    elem.memoryCapacity.forEach(memory => {
                        if (memory.available === true) {
                            const memorySpan = document.createElement("span");
                            memorySpan.textContent = `${memory.size}`;
                            memoryContainer.append(memorySpan);
                        }
                    });

                    template.content.querySelector("a").innerHTML = `${elem.price}$ <i class="material-icons">add_shopping_cart</i>`;
                    template.content.querySelector("a").setAttribute("data-id", `${elem.id}`);
                    const content = template.content.cloneNode(true);
                    container.append(content);
                });
            })
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const toggleMenu = new ToggleMenu();
    const style = new StyleManager();
    const ui = new UI();

    toggleMenu.toggleMenu();
    ui.getCategories()
        .then(response => {
            ui.renderCategories(response);
            style.selectBoxHandler();
            ui.optionListClickHandler();
        });


});