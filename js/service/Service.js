class Service {
    GET(url) {
        try {
            return axios.get(url);
        } catch (e) {
            return e;
        }
    }

    DELETE(url) {
        try {
            return axios.delete(url)
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

    getDiscount(code) {
        return new Promise((resolve) => {
            this.GET(`http://localhost:8080/discount/${code}`)
                .then(response => {
                    resolve(response.data)
                }).catch();
        });
    }

    deleteDiscount(id) {
        return new Promise((resolve => {
            this.DELETE(`http://localhost:8080/discount/${id}`)
                .then(response => {
                    resolve(response.data)
                }).catch();
        }))
    }
}