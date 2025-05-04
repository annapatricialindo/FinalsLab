// shoppingCart.js
import { computed } from 'vue';
import { useStore } from 'vuex';

export const useShoppingCart = () => {
  const store = useStore();
  
  const cart = computed(() => store.getters.cartItems);
  const cartCount = computed(() => store.getters.cartCount);

  const addToCart = (product) => {
    store.dispatch('addToCart', product);
  };

  const updateQuantity = (payload) => {
    store.dispatch('updateQuantity', payload);
  };

  const removeItem = (id) => {
    store.dispatch('removeItem', id);
  };

  const clearCart = () => {
    store.dispatch('clearCart');
  };

  return {
    cart,
    cartCount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
};
