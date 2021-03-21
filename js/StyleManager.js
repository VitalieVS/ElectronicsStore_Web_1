class StyleManager {
    mainImage = document.querySelector(".imgBox .iphone");
    h2Text = document.querySelector(".content .textBox h2 span");
    circle = document.querySelector(".circle");
    learnMore = document.querySelector(".content .textBox a");

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
                let color = imageSource.split("_")[1];
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
    };

    static triggerNotification() {
        document.querySelector(".notification").classList.remove("disabled");
        setTimeout(() => {
            document.querySelector(".notification").classList.add("disabled");
        }, 1000)
    }
}
