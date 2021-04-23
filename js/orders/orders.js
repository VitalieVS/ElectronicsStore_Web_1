class Orders {
    _orders;

    constructor() {
        this.init().then(() => this.renderOrders());
    }

    async init() {
        this._orders = await this.getOrders();
    }

    GET(url) {
        try {
            return axios.get(url)
        } catch (e) {
            return e;
        }
    }

    getOrders() {
        return new Promise(resolve => {
            this.GET('http://localhost:8080/orders/getOrders').then(response => {
                resolve(response.data);
            })
        })
    }

    renderOrders() {
        const template = document.getElementById("orders__template");
        const container = document.getElementById("orders");
        container.innerHTML = "";

        for (let key in this._orders) {
            if (this._orders.hasOwnProperty(key)) {
                template.content.querySelector(".id__holder").textContent = this._orders[key].id;
                template.content.querySelector(".product__color span").textContent = "";
                template.content.querySelector(".product__size span").textContent = "";

                for (let productKey in this._orders[key].products) {
                    if (this._orders[key].products.hasOwnProperty(productKey)) {
                        template.content.querySelector(".product__id span").textContent =
                            this._orders[key].products[productKey].id;

                        template.content.querySelector(".product__price span").textContent =
                            `$${this._orders[key].products[productKey].price}`;

                        template.content.querySelector(".product__quantity span").textContent =
                            `QTY: ${this._orders[key].products[productKey].quantity}`;

                        (this._orders[key].products[productKey].color) ?
                            template.content.querySelector(".product__color span").textContent =
                                this._orders[key].products[productKey].color :
                            template.content.querySelector(".product__color span").textContent = "";

                        (this._orders[key].products[productKey].size) ?
                            template.content.querySelector(".product__size span").textContent =
                                this._orders[key].products[productKey].size :
                            template.content.querySelector(".product__color span").textContent = "";
                    }

                    template.content.querySelector(".name span").textContent =
                        this._orders[key].contact.name;

                    template.content.querySelector(".surname span").textContent =
                        this._orders[key].contact.surname;

                    template.content.querySelector(".address span").textContent =
                        this._orders[key].contact.address;

                    template.content.querySelector(".phone span").textContent =
                        this._orders[key].contact.phone;

                    template.content.querySelector(".city span").textContent =
                        this._orders[key].contact.city;

                    template.content.querySelector(".country span").textContent =
                        this._orders[key].contact.country;

                    template.content.querySelector(".shipping__price__holder span").textContent =
                        `$${this._orders[key].shippingPrice}`;

                    template.content.querySelector(".payment__method__holder span").textContent =
                        this._orders[key].paymentMethod;

                    (this._orders[key].discount) ?
                        template.content.querySelector(".discount__holder").textContent =
                            `$${this._orders[key].discount.value} : ${this._orders[key].discount.code}` :
                        template.content.querySelector(".discount__holder").textContent =
                            `$0.00`;

                    template.content.querySelector(".total__price__holder span").textContent =
                        this._orders[key].totalPrice;

                    const content = template.content.cloneNode(true);
                    container.append(content);
                }
            }
        }
    }


}

document.addEventListener("DOMContentLoaded", () => {
    new Orders();
});