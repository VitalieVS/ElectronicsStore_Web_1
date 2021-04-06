class Service {
    GET(url) {
        try {
            return axios.get(url);
        } catch (e) {
            return e;
        }
    }

    getProducts(category) {
        return new Promise((resolve) => {
            this.GET(`http://localhost:8080/products/${category}`)
                .then(response => {
                    resolve(response.data);
                })
        })
    }

    getCategories() {
        return new Promise((resolve) => {
            this.GET("http://localhost:8080/categories")
                .then(response => {
                    resolve(response.data)
                }).catch();
        });
    }

    getProduct(id) {
        return new Promise((resolve) => {
            this.GET(`http://localhost:8080/product/${id}`)
                .then(response => {
                    resolve(response.data)
                }).catch();
        });
    }

}