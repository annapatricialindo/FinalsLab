export default {
    namespaced: true,
    state: {
        products: [],
        currentPage: 1,
        itemsPerPage: 0,
        activeIndex: 0,
    },
    getters: {
        totalPages: (state) => Math.ceil(state.products.length / state.itemsPerPage),
        paginatedProducts: (state) => {
            const start = (state.currentPage - 1) * state.itemsPerPage;
            return state.products.slice(start, start + state.itemsPerPage);
        },
        activeProduct: (state) => state.products[state.activeIndex] || state.products[0],
    },
    mutations: {
        SET_PRODUCTS(state, products) {
            state.products = products;
        },
        ADD_PRODUCT(state, product) {
            state.products.push(product);
        },
        UPDATE_PRODUCT(state, updatedProduct) {
            const index = state.products.findIndex((p) => p.id === updatedProduct.id);
            if (index !== -1) state.products.splice(index, 1, updatedProduct);
        },
        DELETE_PRODUCT(state, productId) {
            state.products = state.products.filter((p) => p.id !== productId);
        },
        SET_ITEMS_PER_PAGE(state, count) {
            state.itemsPerPage = count;
        },
        SET_ACTIVE_INDEX(state, index) {
            state.activeIndex = index;
        },
        NEXT_PRODUCT(state) {
            state.activeIndex = state.activeIndex < state.products.length - 1 ? state.activeIndex + 1 : 0;
        },
        PREV_PRODUCT(state) {
            state.activeIndex = state.activeIndex > 0 ? state.activeIndex - 1 : state.products.length - 1;
        },
    },
    actions: {
        async fetchProducts({ commit, rootState }) {
            try {
                console.log("Fetching products...");
                const token = rootState.auth.token;  // Ensure the token is available

                const res = await fetch("http://localhost:8000/api/products/", {
                    method: "GET",  // Explicitly specifying the GET method
                    headers: {
                        Authorization: `Bearer ${token}`,  // Token for authorization
                        Accept: "application/json",  // Expecting JSON response
                    },
                });

                if (!res.ok) throw await res.json();  // Handle non-OK responses

                const data = await res.json();  // Parse the response body to JSON
                console.log("Fetched data:", data);  // Debugging: log the fetched data

                commit("SET_PRODUCTS", data);  // Commit data to Vuex store
                commit("SET_ITEMS_PER_PAGE", data.length);  // Set the items per page
            } catch (error) {
                console.error("Failed to fetch products:", error);  // Handle errors
            }
        },

        async createProduct({ commit, rootState }, productData) {
            try {
                const token = rootState.auth.token;

                const formData = new FormData();
                formData.append('name', productData.name);
                formData.append('description', productData.description);
                formData.append("stock", productData.stock);
                formData.append('price', productData.price);
                if (productData.image) {
                    formData.append('image', productData.image); // Add image file here if exists
                }

                const res = await fetch("http://localhost:8000/api/products/", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
                if (!res.ok) throw await res.json();
                const newProduct = await res.json();
                commit("ADD_PRODUCT", newProduct);
            } catch (error) {
                console.error("Failed to create product:", error);
                throw error;
            }
        },

        async updateProduct({ commit, rootState }, productData) {
            try {
                const token = rootState.auth.token;

                const formData = new FormData();
                formData.append('name', productData.name);
                formData.append('description', productData.description);
                formData.append('price', productData.price);
                formData.append("stock", productData.stock);

                if (productData.image && !/^https?:\/\/[^ ]+$/.test(productData.image)) {
                    formData.append('image', productData.image);  // Append image only if it's not a URL
                }

                const res = await fetch(`http://localhost:8000/api/products/${productData.id}/`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,  // Keep the Authorization header
                    },
                    body: formData,  // The browser will set the correct Content-Type automatically
                });

                if (!res.ok) throw await res.json();
                const updatedProduct = await res.json();
                commit("UPDATE_PRODUCT", updatedProduct);
            } catch (error) {
                console.error("Failed to update product:", error);
                throw error;
            }
        },

        async deleteProduct({ commit, rootState }, productId) {
            try {
                const token = rootState.auth.token;
                const res = await fetch(`http://localhost:8000/api/products/${productId}/`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw await res.json();
                commit("DELETE_PRODUCT", productId);
            } catch (error) {
                console.error("Failed to delete product:", error);
                throw error;
            }
        },

        async searchProducts({ commit, rootState }, query) {
            try {
                const token = rootState.auth.token;
                const res = await fetch(`http://localhost:8000/api/products/search/?q=${query}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (!res.ok) throw await res.json();
                const data = await res.json();
                commit("SET_PRODUCTS", data);  // Update products list with search results
            } catch (error) {
                console.error("Failed to search products:", error);
            }
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
