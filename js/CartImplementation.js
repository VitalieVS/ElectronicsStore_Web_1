document.addEventListener("DOMContentLoaded", () => {
    const checkOut = new CheckOut(new Service(), new Cart());

    checkOut.showCheckOut().then(() => {
            checkOut.shippingListHandler();
            StyleManager.shippingHandler();
            checkOut.removeHandler();
            checkOut.quantityHandler();
            checkOut.discount();
        }
    );
});