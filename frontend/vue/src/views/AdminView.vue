<template>
    <div>
        <!-- Background -->
        <div class="background" :style="{ backgroundImage: 'url(/image/BG1.jpg)' }"></div>

        <!-- Navbar -->
        <nav class="navbar px-4">
            <a class="navbar-brand" href="/home">
                <i class="fas fa-store"></i> MusicTrack
            </a>
            <div class="d-flex gap-3">
                <button class="btn btn-outline-light" @click="toggleMute">
                    <i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
                </button>

                <button class="btn btn-outline-light" @click="logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </nav>

        <!-- Progress Bar -->
        <div class="progress-container">
            <div class="progress-bar" :style="progressBarStyle"></div>
        </div>

        <!-- Featured Products -->
        <div id="featured-products-container" class="glass-container">
            <h3 class="section-title">Featured Products</h3>
            <div class="product-list">
                <div v-for="(product, index) in products" :key="index" class="product-card"
                    :style="{ backgroundImage: `url(${product.BG})` }">
                    <div class="product-overlay"
                        :style="{ background: `linear-gradient(45deg, ${product.visualPrimaryColor}AA, ${product.visualSecondaryColor}AA)` }">
                    </div>
                    <div class="product-info">
                        <span class="genre-tag">{{ product.genre }}</span>
                        <h3 class="card-title">{{ product.name }}</h3>
                        <p class="card-description">{{ product.description }}</p>
                        <p class="card-price"><strong>${{ product.price }}</strong></p>
                        <div class="button-container">
                            <button class="cart-btn" @click.stop="addToCart(product)">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const isMuted = ref(false)
const progress = ref(0)

const logout = () => {
    // Clear user session or authentication state from Vuex or local storage
    store.commit('auth/logout'); // Assuming you have a logout action in your Vuex store
    // Redirect to login page or home
    window.location.href = '/'; // Or any other route you want to redirect to
};

const products = computed(() => store.getters.paginatedProducts)
const active = ref(0)

const toggleMute = () => {
    isMuted.value = !isMuted.value
}

const progressBarStyle = computed(() => ({
    width: `${progress.value}%`,
    background: 'linear-gradient(to right, #00ccff, #0066ff)'
}))

watch(products, (newProducts) => {
    if (newProducts.length > 0) {
        active.value = 0
    }
})


const addToCart = (product) => {
    // Replace this with your own cart logic or emit
    console.log('Add to cart:', product)
}
</script>

<style scoped>
/* Reuse existing styles from your original + slider styles */
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
    z-index: -1;
}

.navbar {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar a.navbar-brand,
.navbar button {
    color: #fff;
}

.progress-container {
    width: 100%;
    height: 5px;
    background: rgba(255, 255, 255, 0.1);
}

.progress-bar {
    height: 100%;
    transition: width 0.2s linear;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    padding: 2rem;
    justify-items: center;
}

.item {
    position: relative;
    width: 100%;
    max-width: 320px;
    height: 380px;
    background-size: cover;
    background-position: center;
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 4px 30px rgba(0, 0, 255, 0.3);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    border: 1px solid rgba(0, 0, 255, 0.5);
    transition: 0.5s ease-in-out;
    background-color: rgba(0, 0, 0, 0.1);
}

.genre-tag {
    background: rgba(255, 99, 132, 0.8);
    color: white;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 10px;
    position: absolute;
    top: 10px;
    left: 10px;
    font-weight: bold;
}

.card-title {
    font-size: 22px;
    font-weight: bold;
    color: #ffcc00;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.card-description {
    font-size: 14px;
    margin-top: 5px;
    opacity: 0.9;
}

.card-price {
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
    color: #66ff99;
}

.button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;
    position: absolute;
    bottom: 20px;
}

.nav-btn,
.cart-btn {
    background: rgba(0, 119, 255, 0.5);
    color: white;
    border: 2px solid rgba(0, 119, 255, 0.7);
    font-size: 24px;
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.3s, transform 0.3s;
}

.nav-btn:hover,
.cart-btn:hover {
    background: rgba(0, 119, 255, 0.8);
    transform: scale(1.1);
}

.nav-btn:disabled {
    background: rgba(0, 119, 255, 0.3);
    cursor: not-allowed;
    transform: none;
}

/* Glass Container */
#featured-products-container.glass-container {
    margin: 2rem;
    padding: 2rem;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
    color: white;
    max-height: 80vh;
    overflow: hidden;
}

/* Title */
.section-title {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
    color: #fff;
}

/* Scrollable Product Grid */
#featured-products-container .product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    max-height: 65vh;
    overflow-y: auto;
    padding-right: 6px;
}

/* Custom Scrollbar */
#featured-products-container .product-list::-webkit-scrollbar {
    width: 6px;
}

#featured-products-container .product-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
}

#featured-products-container .product-list::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
}

/* Product Card */
#featured-products-container .product-card {
    position: relative;
    height: 280px;
    border-radius: 16px;
    background-size: cover;
    background-position: center;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s ease;
}

#featured-products-container .product-card:hover {
    transform: scale(1.03);
}

/* Overlay */
#featured-products-container .product-overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 1;
}

/* Content */
#featured-products-container .product-info {
    position: relative;
    z-index: 1;
    color: white;
    padding: 16px;
    width: 100%;
}

/* Info Elements */
#featured-products-container .genre-tag {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.3);
    font-weight: bold;
    margin-bottom: 6px;
    display: inline-block;
}

#featured-products-container .card-title {
    font-size: 18px;
    font-weight: bold;
    color: #ffcc00;
    margin-bottom: 4px;
}

#featured-products-container .card-description {
    font-size: 13px;
    opacity: 0.9;
    margin-bottom: 6px;
}

#featured-products-container .card-price {
    font-size: 16px;
    color: #66ff99;
    margin-bottom: 10px;
}

/* Cart Button */
#featured-products-container .cart-btn {
    background: rgba(0, 119, 255, 0.5);
    color: white;
    border: 2px solid rgba(0, 119, 255, 0.7);
    font-size: 20px;
    padding: 10px;
    border-radius: 12px;
    cursor: pointer;
    width: 44px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.3s, transform 0.3s;
}

#featured-products-container .cart-btn:hover {
    background: rgba(0, 119, 255, 0.8);
    transform: scale(1.1);
}
</style>
