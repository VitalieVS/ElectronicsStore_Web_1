class Shop {
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

    getProducts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const API = new Service();
                API.GET("http://localhost:8080/products")
                    .then(response => {
                        resolve(response.data);
                    })
            }, 300)
        })
    }

    renderProducts(products) {
        //container for cards
        const container = document.getElementById("products");
        const template = document.getElementById("product-card");

        const optionsList = document.querySelectorAll(".option");
        const selected = document.querySelector(".selected");
        const optionsContainer = document.querySelector("#options-container");

        optionsList.forEach(option => {
            option.addEventListener("click", () => {
                selected.innerHTML = option.querySelector("label").innerHTML;
                optionsContainer.classList.remove("active");

            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleMenu = new ToggleMenu();
    const style = new StyleManager();
    const shop = new Shop();

    toggleMenu.toggleMenu();
    shop.getCategories()
        .then(response => {
            shop.renderCategories(response);
            style.selectBoxHandler();
        });

    shop.getProducts()
        .then(response => {
            shop.renderProducts(response);
        });
    console.log("rendering done");
});