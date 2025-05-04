import axios from "axios";

export default {
    namespaced: true,
    state: {
        cart: [], // backend synced
    },
    getters: {
        cartItems: (state) => state.cart,
        cartCount: (state) => state.cart.length,
        totalPrice: (state) => {
            const total = state.cart.reduce((sum, item) => {
                const price = item.product.price || 0; // Default to 0 if price is missing
                return sum + price * item.quantity;
            }, 0);
            return total || 0; // Ensure the total is never null or undefined
        },
        totalQuantity: (state) =>
            state.cart.reduce((total, item) => total + item.quantity, 0),
        getCartItemQuantity: (state) => (productId) => {
            const cartItem = state.cart.find(item => item.product.id === productId);
            return cartItem ? cartItem.quantity : 0;
        }
    },
    mutations: {
        SET_CART(state, cartItems) {
            state.cart = cartItems;
        },
        CLEAR_CART(state) {
            state.cart = [];
        },
    },
    actions: {
        async fetchCart({ commit, rootState }) {
            try {
                const token = rootState.auth.token;
                const response = await axios.get("http://localhost:8000/api/orders/cart/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                commit("SET_CART", response.data);
            } catch (error) {
                console.error("Failed to fetch cart:", error);
            }
        },
        async addToCart({ dispatch, rootState }, { product_id, quantity = 1 }) {
            try {
                const token = rootState.auth.token;
                const cart = await axios.get("http://localhost:8000/api/orders/cart/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Check if the item already exists in the cart
                const existingItem = cart.data.find(item => item.product.id === product_id);



                if (existingItem) {
                    // If item exists, update the quantity
                    await axios.patch(
                        `http://localhost:8000/api/orders/cart/${existingItem.id}/update/`,
                        { quantity: existingItem.quantity + quantity },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                } else {
                    // If item does not exist, create a new cart item
                    await axios.post(
                        "http://localhost:8000/api/orders/cart/",
                        { product_id, quantity },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                }
                // Fetch updated cart
                dispatch("fetchCart");
            } catch (error) {
                console.error("Failed to add to cart:", error);
            }
        },
        async updateQuantity({ dispatch, rootState }, { id, quantity }) {
            try {
                const token = rootState.auth.token;
                await axios.patch(
                    `http://localhost:8000/api/orders/cart/${id}/update/`,
                    { quantity },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                dispatch("fetchCart");
            } catch (error) {
                console.error("Failed to update quantity:", error);
            }
        },
        async removeItem({ dispatch, rootState }, id) {
            try {
                const token = rootState.auth.token;
                await axios.delete(`http://localhost:8000/api/orders/cart/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                dispatch("fetchCart");
            } catch (error) {
                console.error("Failed to remove item:", error);
            }
        },
        async clearCart({ commit, rootState }) {
            try {
                const token = rootState.auth.token;
                await axios.post("http://localhost:8000/api/orders/cart/clear/", {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                commit("CLEAR_CART"); // Clear cart from the Vuex store after successful API response
            } catch (error) {
                console.error("Failed to clear cart:", error);
            }
        },
        async checkout({ commit, rootState }) {
            try {
                const token = rootState.auth.token;
                const response = await axios.post(
                    "http://localhost:8000/api/orders/checkout/",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                commit("CLEAR_CART"); // Clear cart after successful checkout
                return response.data;
            } catch (error) {
                console.error("Checkout failed:", error);
                throw error;
            }
        },
    },
};
