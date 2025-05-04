import { createStore } from "vuex";
import auth from './modules/auth';
import products from "./modules/products";
import cart from "./modules/cart";
import order from "./modules/order";

const store = createStore({
  modules: {
    auth,
    products,
    cart,
    order,
  },
});

export default store;
