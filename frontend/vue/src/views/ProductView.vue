<template>
  <div class="background" v-if="selectedProduct" :style="{ backgroundImage: `url(${selectedProduct.BG})` }"></div>

  <!-- Bottom Visualizer
  <div class="visualizer-container bottom-visualizer" v-if="visualizerActive">
    <div v-for="(bar, index) in bars" :key="'bottom-' + index" class="visualizer-bar">
      <div class="smallest-box" :style="{
        height: bar * 0.3 + 'px',
        background: `linear-gradient(to bottom, ${selectedProduct?.visualPrimaryColor || '#00ccff'}, ${selectedProduct?.visualSecondaryColor || '#000033'})`
      }">
      </div>
      <div class="smaller-box" :style="{
        height: bar * 0.6 + 'px',
        background: `linear-gradient(to bottom, ${selectedProduct?.visualPrimaryColor || '#00ccff'}, ${selectedProduct?.visualSecondaryColor || '#000066'})`
      }">
      </div>
      <div class="bigger-box" :style="{
        height: bar + 'px',
        background: `linear-gradient(to bottom, ${selectedProduct?.visualPrimaryColor || '#00ccff'}, ${selectedProduct?.visualSecondaryColor || '#000099'})`
      }">
      </div>
    </div>
  </div> -->

  <div>
    <!-- Navbar -->
    <nav class="navbar px-4">
      <a class="navbar-brand" href="/home">
        <i class="fas fa-store"></i> MusicTrack
      </a>
      <div class="d-flex gap-3">
        <!-- Mute Button -->
        <button class="btn btn-outline-light" @click="toggleMute">
          <i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
        </button>

        <!-- Cart Button -->
        <button class="btn btn-outline-light position-relative" @click="showCart = true">
          <i class="fas fa-shopping-cart"></i>
          <span class="badge bg-danger position-absolute top-0 start-100 translate-middle" v-if="cart.length">
            {{ cart.length }}
          </span>
        </button>

        <!-- New Button to Open Modal -->
        <button class="btn btn-outline-light" @click="showModal = true">
          <i class="fas fa-info-circle"></i> Info
        </button>

        <button class="btn btn-outline-light" @click="logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </nav>


    <!-- Progress Bar (Under Navbar) -->
    <div class="progress-container">
      <div class="progress-bar" :style="progressBarStyle"></div>
    </div>



    <div class="container mt-4">
      <ProductList @add-to-cart="addToCart" @select-product="selectProduct" />
    </div>

    <transition name="modal-fade">
      <div class="modal fade show d-flex align-items-center justify-content-center" :class="{ 'd-block': showCart }"
        v-if="showCart" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" @click="showCart = false">
          <div class="modal-content glassmorphism" @click.stop>
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-shopping-basket"></i> Shopping Cart</h5>
              <button type="button" class="btn-close" @click="showCart = false"></button>
            </div>
            <div class="modal-body">
              <ShoppingCart :cartItems="cart" @update-quantity="updateQuantity" @remove-item="removeItem"
                @clear-cart="clearCart" />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Info Modal -->
    <div v-if="showModal" id="featured-products-modal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Featured Products</h3>

        <!-- Scrollable Product List -->
        <div class="product-list">
          <div v-for="product in products" :key="product.id" class="product-card"
            :style="{ background: `linear-gradient(45deg, ${product.visualPrimaryColor}, ${product.visualSecondaryColor})` }">

            <!-- Product Info Section -->
            <div class="product-info">
              <img :src="product.BG" class="product-thumbnail" />
              <div class="product-details">
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-genre">{{ product.genre }}</p>
              </div>

              <!-- Actions -->
              <div class="product-actions">
                <span class="quantity">1</span>
                <button class="delete-btn">🗑</button>
              </div>
            </div>
          </div>
        </div>

        <button class="btn btn-danger close-btn" @click="showModal = false">Close</button>
      </div>
    </div>

    <!-- Info Modal -->
    <div v-if="showModal" id="featured-products-modal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Featured Products</h3>

        <!-- Scrollable Product Grid -->
        <div class="product-list">
          <div v-for="product in products" :key="product.id" class="product-card"
            :style="{ backgroundImage: `url(${product.BG})` }">

            <!-- Gradient Overlay -->
            <div class="product-overlay"
              :style="{ background: `linear-gradient(45deg, ${product.visualPrimaryColor}AA, ${product.visualSecondaryColor}AA)` }">
            </div>

            <!-- Product Info -->
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <p class="product-genre">{{ product.genre }}</p>
              <button class="btn btn-primary" @click="addToCart(product)">Add to Cart</button>
            </div>
          </div>
        </div>

        <button class="btn btn-danger close-btn" @click="showModal = false">Close</button>
      </div>
    </div>

    <div v-if="showCart" class="modal-backdrop fade show" @click="showCart = false"></div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import ProductList from '../components/ProductList.vue';
import ShoppingCart from '../components/Cart.vue';

export default {
  components: { ProductList, ShoppingCart },
  setup() {
    // State variables
    const selectedProduct = ref(null); // Holds the currently selected product
    const audio = ref(null); // Reference to the audio element
    const store = useStore(); // Vuex store instance
    const showCart = ref(false); // Controls visibility of the shopping cart
    const showModal = ref(false); // Controls visibility of the modal
    const isMuted = ref(false); // Tracks if audio is muted
    const visualizerActive = ref(true); // Whether the visualizer is active
    const products = computed(() => store.getters.paginatedProducts); // Computed list of products from Vuex store
    const progress = ref(0); // Progress bar value (0-100%)
    const bars = ref(new Array(15).fill(50)); // Array representing the bars in the visualizer
    let interval = null; // Interval to update visualizer bars

    const logout = () => {
      // Clear user session or authentication state from Vuex or local storage
      store.commit('auth/logout'); // Assuming you have a logout action in your Vuex store
      // Redirect to login page or home
      window.location.href = '/'; // Or any other route you want to redirect to
    };

    // Function to update visualizer bars based on screen width
    const updateBars = () => {
      bars.value = new Array(Math.floor(window.innerWidth / 20))
        .fill(10)
        .map(() => Math.random() * 100 + 50); // Random height for each bar
    };

    // Function to toggle mute state
    const toggleMute = () => {
      isMuted.value = !isMuted.value; // Toggle mute state
      if (audio.value) {
        audio.value.muted = isMuted.value; // Set the audio mute property
      }
    };

    // Computed property for progress bar styling with gradient
    const progressBarStyle = computed(() => {
      const primary = selectedProduct?.value?.visualPrimaryColor || "#00ccff";
      const secondary = selectedProduct?.value?.visualSecondaryColor || "#0066ff";

      return {
        width: `${progress.value}%`, // Set progress bar width
        background: `linear-gradient(to right, ${primary}, ${secondary})`, // Set gradient background
      };
    });

    // Function to update the progress bar based on audio current time
    const updateProgress = () => {
      if (audio.value) {
        progress.value = (audio.value.currentTime / audio.value.duration) * 100;
      }
    };

    // Watch for audio progress to update the progress bar
    watchEffect(() => {
      if (audio.value) {
        audio.value.addEventListener("timeupdate", updateProgress);
      }
    });

    let userInteracted = false; // Tracks if user clicked to enable audio
    let currentProduct = null;  // Tracks the currently playing product

    // Function to start the visualizer and audio playback for a selected product
    const startVisualizer = (product) => {
      if (!product || !product.audio) {
        console.warn("No audio found for the selected product");
        return;
      }

      // Avoid replaying the same song
      if (currentProduct === product) {
        console.warn("Same song is already playing");
        return;
      }

      if (audio.value) {
        audio.value.pause(); // Pause any currently playing audio
        audio.value.currentTime = 0; // Reset playback time
      }

      audio.value = product.audio; // Set the new product's audio
      audio.value.loop = true; // Enable looping
      currentProduct = product; // Update current product

      if (!userInteracted) {
        // Handle user interaction to start audio playback
        const enableAudio = () => {
          audio.value.play().catch(error => console.warn("Playback prevented:", error));
          userInteracted = true; // Mark as interacted
          document.removeEventListener("click", enableAudio); // Remove event listener after first click
        };
        document.addEventListener("click", enableAudio, { once: true });
      } else {
        // Play immediately if user has already interacted
        audio.value.play().catch(error => console.warn("Playback prevented:", error));
      }

      visualizerActive.value = true; // Activate the visualizer
      if (!interval) {
        updateBars(); // Initialize visualizer bars
        interval = setInterval(updateBars, 100); // Update visualizer every 100ms
      }
    };

    // Function to select a product, starts visualizer and audio playback
    const selectProduct = (product) => {
      if (!product || selectedProduct.value?.id === product.id) return; // Prevent redundant selections
      console.log("Selected Product:", product);
      selectedProduct.value = { ...product }; // Ensure reactivity by creating a new object
      startVisualizer(product);
    };

    // Function to determine CSS class for the box based on index
    const getBoxClass = (index) => {
      if (index % 3 === 0) return "big-box";
      if (index % 3 === 1) return "medium-box";
      return "small-box";
    };

    // Computed property for paginated products from Vuex store
    const paginatedProducts = computed(() => store.getters.paginatedProducts);

    // Watch for changes in paginatedProducts and select the first product if none is selected
    watch(paginatedProducts, (newProducts) => {
      if (newProducts.length > 0 && !selectedProduct.value) {
        selectProduct(newProducts[0]);
      }
    }, { immediate: true });

    // Watch for changes in selectedProduct and reset progress when switching products
    watch(selectedProduct, () => {
      progress.value = 0; // Reset progress bar when switching products
    });

    // Add event listeners for window resizing
    onMounted(() => {
      window.addEventListener('resize', updateBars); // Update visualizer bars on resize
    });

    // Ensure resize event listener is set up
    window.addEventListener('resize', updateBars);

    // Clean up event listeners and intervals on component unmount
    onUnmounted(() => {
      if (interval) clearInterval(interval); // Clear visualizer update interval
      window.removeEventListener('resize', updateBars); // Remove resize event listener

      if (audio.value) {
        audio.value.removeEventListener("timeupdate", updateProgress); // Remove timeupdate event listener
      }
    });

    // Return the reactive properties and methods for template access
    return {
      logout,
      showModal,
      selectedProduct,
      showCart,
      cart: computed(() => store.getters.cartItems),
      cartCount: computed(() => store.getters.cartCount),
      addToCart: (product) => store.dispatch('addToCart', product),
      updateQuantity: (payload) => store.dispatch('updateQuantity', payload),
      removeItem: (id) => store.dispatch('removeItem', id),
      clearCart: () => store.dispatch('clearCart'),
      visualizerActive,
      bars,
      startVisualizer,
      getBoxClass,
      selectProduct,
      isMuted,
      toggleMute,
      progress,
      progressBarStyle,
      products,
    };
  }
};
</script>

<style>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(10px);
  z-index: -2;
}
</style>

<style scoped src="../css/product.css"></style>