export default {
    state: {
        cart: JSON.parse(localStorage.getItem("cart")) || [],
        products: [],
        currentPage: 1,
        itemsPerPage: 0,
        activeIndex: 0,
    },
    getters: {
        cartItems: (state) => {
            return state.cart.map(item => {
                const product = state.products.find(product => product.id === item.id);
                return { ...product, quantity: item.quantity }; // Combine product details with quantity
            });
        },
        cartCount: (state) => (state.cart ? state.cart.length : 0),
        totalPages: (state) => Math.ceil(state.products.length / state.itemsPerPage),
        paginatedProducts: (state) => {
            const start = (state.currentPage - 1) * state.itemsPerPage;
            return state.products.slice(start, start + state.itemsPerPage);
        },
        totalPrice: (state) =>
            state.cart.reduce((sum, item) => {
                const product = state.products.find(product => product.id === item.id);
                return sum + product.price * item.quantity;
            }, 0),
        activeProduct: (state) =>
            state.products[state.activeIndex] || state.products[0], // Ensure it's always valid
        totalQuantity: (state) => {
            return state.cart.reduce((total, item) => total + item.quantity, 0); // Sum up all quantities
        },
    },
    mutations: {
        SET_PRODUCTS(state, products) {
            state.products = products;
        },
        SET_ITEMS_PER_PAGE(state, count) {
            state.itemsPerPage = count; // You can also limit it like: Math.min(count, 20)
        },
        ADD_TO_CART(state, product) {
            const item = state.cart.find((item) => item.id === product.id);
            if (item) {
                item.quantity++; // Increase quantity if already in cart
            } else {
                state.cart.push({ id: product.id, quantity: 1 }); // Store only id and quantity
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        UPDATE_QUANTITY(state, { id, quantity }) {
            const item = state.cart.find((i) => i.id === id);
            if (item) {
                if (quantity <= 0) {
                    state.cart = state.cart.filter((i) => i.id !== id); // Remove item if quantity is 0
                } else {
                    item.quantity = quantity;
                }
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        REMOVE_ITEM(state, id) {
            state.cart = state.cart.filter((item) => item.id !== id);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        CLEAR_CART(state) {
            state.cart = [];
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        SET_ACTIVE_INDEX(state, index) {
            state.activeIndex = index;
        },
        NEXT_PRODUCT(state) {
            state.activeIndex =
                state.activeIndex < state.products.length - 1 ? state.activeIndex + 1 : 0;
        },
        PREV_PRODUCT(state) {
            state.activeIndex =
                state.activeIndex > 0 ? state.activeIndex - 1 : state.products.length - 1;
        },
    },
    actions: {
        async fetchProducts({ commit }) {
            try {
                const response = await fetch("http://localhost:8000/api/products/");
                const data = await response.json();
                commit("SET_PRODUCTS", data);
                commit("SET_ITEMS_PER_PAGE", data.length);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        },
        addToCart({ commit }, product) {
            commit("ADD_TO_CART", product);
        },
        updateQuantity({ commit }, payload) {
            commit("UPDATE_QUANTITY", payload);
        },
        removeItem({ commit }, id) {
            commit("REMOVE_ITEM", id);
        },
        clearCart({ commit }) {
            commit("CLEAR_CART");
        },
        setActiveIndex({ commit }, index) {
            commit("SET_ACTIVE_INDEX", index);
        },
        nextProduct({ commit }) {
            commit("NEXT_PRODUCT");
        },
        prevProduct({ commit }) {
            commit("PREV_PRODUCT");
        },
    },
};
