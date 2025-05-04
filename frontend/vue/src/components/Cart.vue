<template>
  <div class="cart-container">
    <div v-if="cartItems.length" class="cart-items-wrapper">
      <div v-for="item in cartItems" :key="item.id" class="cart-item"
        :style="{ backgroundImage: `url(${item.BG})`, backgroundSize: 'cover' }">
        <div class="cart-item-overlay"
          :style="{ background: `linear-gradient(135deg, ${item.visualPrimaryColor} 30%, ${item.visualSecondaryColor} 70%)` }">
        </div>

        <!-- Album Art & Details -->
        <div class="cart-item-content">
          <img :src="item.BG" class="album-cover" alt="Album Cover" />
          <div class="cart-item-info">
            <h5 class="album-title">{{ item.name }}</h5>
            <p class="album-genre">{{ item.genre }}</p>
          </div>
        </div>

        <!-- Quantity & Actions -->
        <div class="cart-item-actions">
          <input type="number" class="quantity-input" :value="item.quantity"
            @input="handleQuantityChange(item.id, $event.target.value)" min="1" />

          <button class="btn-remove" @click="$emit('remove-item', item.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <p v-else class="empty-cart">
      <i class="fas fa-music"></i> Your playlist is empty.
    </p>

    <!-- Cart Summary -->
    <p class="cart-total">
      Total: <strong>${{ totalPrice }}</strong>
    </p>
    <p class="cart-total-quantity">
      Total Quantity: <strong>{{ totalQuantity }}</strong>
    </p>

    <button class="btn-buy" @click="handleBuyNow" v-if="cartItems.length">
      <i class="fas fa-play-circle"></i> Buy Now
    </button>

    <button class="btn-clear" @click="$emit('clear-cart')" v-if="cartItems.length">
      <i class="fas fa-trash-alt"></i> Clear Cart
    </button>

    <!-- Success Popup -->
    <div v-if="showSuccess" class="purchase-success">
      <transition name="fade">
        <div v-if="loading" class="loading-icon">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
      </transition>
      <transition name="fade">
        <div v-if="!loading" class="success-content">
          <i class="fas fa-check-circle success-icon"></i>
          <p>Purchase Successful!</p>
          <strong>Total Paid: ${{ totalPrice }}</strong>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'MusicCart',
  setup() {
    const store = useStore();
    const showSuccess = ref(false);
    const loading = ref(false);

    const handleBuyNow = () => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        showSuccess.value = true;

        setTimeout(() => {
          showSuccess.value = false;
          store.dispatch('clearCart');
        }, 3000);
      }, 2000);
    };

    const handleQuantityChange = (id, quantity) => {
      quantity = parseInt(quantity, 10);
      if (isNaN(quantity) || quantity < 0) return;
      store.dispatch("updateQuantity", { id, quantity });
    };


    return {
      cartItems: computed(() => store.getters.cartItems),
      totalPrice: computed(() => store.getters.totalPrice),
      totalQuantity: computed(() => store.getters.totalQuantity),
      updateQuantity: (id, quantity) => store.dispatch('updateQuantity', { id, quantity }),
      removeItem: (id) => store.dispatch('removeItem', id),
      clearCart: () => store.dispatch('clearCart'),
      showSuccess,
      loading,
      handleBuyNow,
      handleQuantityChange,
    };
  },
};
</script>

<style scoped>
.cart-items-wrapper {
  max-height: 300px;
  /* Adjust height as needed */
  overflow-y: auto;
  /* Enables scrolling */
  padding-right: 10px;
  /* Prevents scrollbar from overlapping content */
}

/* Optional: Style scrollbar for WebKit browsers */
.cart-items-wrapper::-webkit-scrollbar {
  width: 6px;
}

.cart-items-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(255, 0, 102, 0.6);
  border-radius: 5px;
}

.cart-items-wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}



/* Background */
.cart-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: rgba(10, 10, 10, 0.9);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 0, 102, 0.5);
}

/* Music-Themed Cards */
.cart-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* Gradient Overlay */
.cart-item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  pointer-events: none;
}

/* Album Content */
.cart-item-content {
  display: flex;
  align-items: center;
  z-index: 2;
}

.album-cover {
  width: 70px;
  height: 70px;
  border-radius: 5px;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.cart-item-info {
  margin-left: 15px;
}

.album-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}

.album-genre {
  font-size: 0.9rem;
  color: white;
  opacity: 0.8;
}

/* Quantity & Remove Button */
.cart-item-actions {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.quantity-input {
  width: 50px;
  padding: 5px;
  text-align: center;
  font-size: 1rem;
  border: 2px solid white;
  border-radius: 5px;
  background: black;
  color: white;
}

.btn-remove {
  margin-top: 5px;
  background: red;
  border: none;
  color: white;
  padding: 5px 8px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-remove:hover {
  background: darkred;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  color: white;
  font-size: 1rem;
  opacity: 0.7;
}

/* Cart Summary */
.cart-total {
  text-align: center;
  font-size: 1.2rem;
  color: #ffcc00;
  font-weight: bold;
}

.cart-total-quantity {
  color: #fff;
}

/* Buttons */
.btn-buy,
.btn-clear {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}

.btn-buy {
  background: #ff0066;
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(255, 0, 102, 0.5);
}

.btn-clear {
  background: #ffcc00;
  color: black;
  border: none;
}

.btn-buy:hover {
  background: #ff3388;
}

.btn-clear:hover {
  background: #ffd633;
}

/* Purchase Success */
.purchase-success {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #28a745;
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 250px;
  z-index: 5;
}

/* Loading & Success Icon */
.loading-icon i,
.success-icon {
  font-size: 40px;
}

/* Fade Effect */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
