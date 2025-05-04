<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>


<!-- <template>
  <div class="background"></div>

  <div class="visualizer-container top-visualizer" v-if="visualizerActive">
    <div v-for="(bar, index) in bars" :key="'top-' + index" class="visualizer-bar">
      <div class="bigger-box" :style="{ height: bar + 'px' }"></div>
      <div class="smaller-box" :style="{ height: bar * 0.6 + 'px' }"></div>
      <div class="smallest-box" :style="{ height: bar * 0.3 + 'px' }"></div>
    </div>
  </div> 

  <div class="visualizer-container bottom-visualizer" v-if="visualizerActive">
    <div v-for="(bar, index) in bars" :key="'bottom-' + index" class="visualizer-bar">
      <div class="smallest-box" :style="{ height: bar * 0.3 + 'px' }"></div>
      <div class="smaller-box" :style="{ height: bar * 0.6 + 'px' }"></div>
      <div class="bigger-box" :style="{ height: bar + 'px' }"></div>
    </div>
  </div>

  <div>
    <nav class="navbar navbar-dark bg-dark px-4">
      <a class="navbar-brand" href="#">
        <i class="fas fa-store"></i> MusicTrack
      </a>
      <button class="btn btn-outline-light position-relative" @click="showCart = true">
        <i class="fas fa-shopping-cart"></i>
        <span class="badge bg-danger position-absolute top-0 start-100 translate-middle" v-if="cart.length">
          {{ cart.length }}
        </span>
      </button>
    </nav>

    <div class="container mt-4">
      <ProductList @add-to-cart="addToCart" @select-product="selectProduct" />
    </div>

    <transition name="modal-fade">
      <div class="modal fade show" :class="{ 'd-block': showCart }" tabindex="-1">
        <div class="modal-dialog modal-dialog-end" @click="showCart = false">
          <div class="modal-content" @click.stop>
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

    <div v-if="showCart" class="modal-backdrop fade show" @click="showCart = false"></div>
  </div>
</template> -->

<!-- <script>
import { computed, ref, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import ProductList from './components/ProductList.vue';
import ShoppingCart from './components/Cart.vue';

export default {
  components: { ProductList, ShoppingCart },
  setup() {
    const selectedProduct = ref(null);
    const audio = ref(new Audio());
    const store = useStore();
    const showCart = ref(false);
    const visualizerActive = ref(false);
    const bars = ref([]);
    let audioContext = null;
    let analyser = null;
    let source = null;
    let dataArray = null;
    let bufferLength = 0;
    let animationFrameId = null;

    const initializeAudioContext = () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
      }
    };

    const updateVisualizer = () => {
      if (!visualizerActive.value) return;
      analyser.getByteFrequencyData(dataArray);
      const numBars = Math.min(Math.floor(window.innerWidth / 20), bufferLength);
      bars.value = Array.from({ length: numBars }, (_, i) => (dataArray[i] / 255) * 100 + 30);
      animationFrameId = requestAnimationFrame(updateVisualizer);
    };

    const startVisualizer = (product) => {
      if (!product || !product.audio) {
        console.warn("No audio found for the selected product");
        return;
      }

      if (audio.value) {
        audio.value.pause();
        audio.value.currentTime = 0;
      }

      audio.value = product.audio;
      audio.value.crossOrigin = "anonymous";

      initializeAudioContext();

      if (!source) {
        source = audioContext.createMediaElementSource(audio.value);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
      }

      audio.value.play();
      visualizerActive.value = true;
      updateVisualizer();
    };

    const selectProduct = (product) => {
      if (selectedProduct.value !== product) {
        selectedProduct.value = product;
        startVisualizer(product);
      }
    };

    const getBoxClass = (index) => {
      if (index % 3 === 0) return "big-box";
      if (index % 3 === 1) return "medium-box";
      return "small-box";
    };

    const updateBarsOnResize = () => {
      const numBars = Math.min(Math.floor(window.innerWidth / 20), bufferLength);
      bars.value = new Array(numBars).fill(50);
    };

    window.addEventListener('resize', updateBarsOnResize);
    updateBarsOnResize();

    onUnmounted(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (audioContext) audioContext.close();
      window.removeEventListener('resize', updateBarsOnResize);
    });

    return {
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
    };
  }
};
</script> -->
