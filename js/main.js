const imgSlider = source => {
    console.log(source);
};

const liClickHandler = () => {
    const thumbItems = document.querySelectorAll(".thumb li img");
    console.log(thumbItems);
    thumbItems.forEach(elem => {
        elem.addEventListener("click", () => {
            console.log(elem.src.length);
            console.log(elem.src.substring(15,534));
            //imgSlider(elem.getAttribute("src"));
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    liClickHandler();
});