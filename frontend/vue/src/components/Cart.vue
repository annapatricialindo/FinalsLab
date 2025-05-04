<template>
  <div class="cart-container">
    <div v-if="cartItems.length" class="cart-items-wrapper">
      <div v-for="item in cartItems" :key="item.id" class="cart-item"
        :style="{ backgroundImage: `url(${getProductImage(item.product)})`, backgroundSize: 'cover' }">
        <div class="cart-item-overlay"
          :style="{ background: `linear-gradient(135deg, ${item.product.visual_primary_color} 30%, ${item.product.visual_secondary_color} 70%)` }">
        </div>

        <!-- Album Art & Details -->
        <div class="cart-item-content">
          <img :src="getProductImage(item.product)" class="album-cover" alt="Product Image" />
          <div class="cart-item-info">
            <h5 class="album-title">{{ getProductName(item.product) }}</h5>
            <p class="album-genre">{{ getProductGenre(item.product) }}</p>
          </div>
        </div>

        <!-- Quantity & Actions -->
        <div class="cart-item-actions">
          <input type="number" class="quantity-input" :value="item.quantity"
            @input="handleQuantityChange(item.id, $event.target.value)" min="1" />
          <button class="btn-remove" @click="removeItem(item.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <p v-else class="empty-cart">
      <i class="fas fa-music"></i> Your cart is empty.
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

    <button class="btn-clear" @click="clearCart" v-if="cartItems.length">
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
          <strong>Total Paid: ${{ orderSummaryTotalPrice }}</strong>
        </div>
      </transition>
    </div>

    <!-- Order Summary Popup -->
    <div v-if="orderSummary" class="order-summary">
      <h3>Order Summary</h3>
      <ul>
        <li v-for="item in orderSummary.items" :key="item.id">
          <strong>{{ item.product.name }}</strong> - Quantity: {{ item.quantity }} - Price: ${{ item.product.price }}
          each
        </li>
      </ul>
      <p class="cart-total">
        Total: <strong>${{ orderSummaryTotalPrice }}</strong>
      </p>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  name: "MusicCart",
  setup() {
    const store = useStore();
    const showSuccess = ref(false);
    const loading = ref(false);
    const orderSummary = ref(null);

    // Fetch cart items and products when the component is mounted
    onMounted(async () => {
      await store.dispatch("cart/fetchCart");
      console.log('Cart Items:', store.getters['cart/cartItems']);
      await store.dispatch("products/fetchProducts");  // Dispatch fetchProducts action to load products
    });

    // New computed properties for total price and total quantity
    const totalPrice = computed(() => {
      return store.getters["cart/cartItems"].reduce((total, item) => {
        return total + (item.quantity * item.product.price); // Calculate total price by multiplying quantity by product price
      }, 0).toFixed(2); // Ensures two decimal points
    });

    const totalQuantity = computed(() => {
      return store.getters["cart/cartItems"].reduce((total, item) => total + item.quantity, 0); // Calculate total quantity of items in the cart
    });

    const orderSummaryTotalPrice = computed(() => {
      if (!orderSummary.value || !orderSummary.value.items) return 0;
      return orderSummary.value.items.reduce((total, item) => {
        return total + (item.quantity * item.product.price); // Calculate total price by multiplying quantity by product price
      }, 0).toFixed(2); // Ensures two decimal points
    });

    const orderSummaryTotalQuantity = computed(() => {
      if (!orderSummary.value || !orderSummary.value.items) return 0;
      return orderSummary.value.items.reduce((total, item) => total + item.quantity, 0); // Calculate total quantity of items in the order
    });

    const handleBuyNow = async () => {
      loading.value = true;
      try {
        const summary = await store.dispatch("cart/checkout");  // Get order details after checkout
        orderSummary.value = summary;  // Set order summary
        showSuccess.value = true;
        setTimeout(() => {
          showSuccess.value = false;
        }, 3000);
      } catch (error) {
        console.error("Purchase failed:", error);
      } finally {
        loading.value = false;
      }
    };

    const handleQuantityChange = (id, quantity) => {
      quantity = parseInt(quantity, 10);
      if (isNaN(quantity) || quantity < 0) return;
      store.dispatch("cart/updateQuantity", { id, quantity });
    };

    const removeItem = (id) => {
      store.dispatch("cart/removeItem", id);
    };

    const clearCart = () => {
      store.dispatch("cart/clearCart");
    };

    // New helper methods to get product data
    const getProductImage = (product) => {
      return product?.image || '';  // Check if product has an image
    };

    const getProductName = (product) => {
      return product?.name || 'Unknown Product';  // Check if product has a name
    };

    const getProductGenre = (product) => {
      return product?.genre || 'Unknown Genre';  // Check if product has a genre
    };

    return {
      cartItems: computed(() => store.getters["cart/cartItems"]),
      orderSummaryTotalPrice,
      orderSummaryTotalQuantity,
      totalPrice,
      totalQuantity,
      showSuccess,
      loading,
      orderSummary,
      handleBuyNow,
      handleQuantityChange,
      removeItem,
      clearCart,
      getProductImage,
      getProductName,
      getProductGenre,
    };
  },
};
</script>

<style scoped>
/* Order Summary */
.order-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.order-summary h3 {
  font-size: 1.5rem;
  font-weight: bold;
}

.order-summary ul {
  list-style-type: none;
  padding: 0;
}

.order-summary li {
  margin-bottom: 10px;
}

.order-summary p {
  font-size: 1.2rem;
  font-weight: bold;
}

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
