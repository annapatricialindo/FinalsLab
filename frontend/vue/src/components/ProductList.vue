<template>
    <div class="slider">
        <div v-for="(product, index) in products" :key="index" class="item" :class="{ active: index === active }"
            :style="{
                ...getSlideStyle(index),
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${product.BG})`
            }" @click="$emit('select-product', product)">

            <!-- Genre Tag -->
            <span class="genre-tag">{{ product.genre }}</span>

            <!-- Title -->
            <h3 class="card-title">{{ product.name }}</h3>

            <!-- Description -->
            <p class="card-description">{{ product.description }}</p>

            <!-- Price -->
            <p class="card-price"><strong>${{ product.price }}</strong></p>

            <div class="button-container">
                <button @click="prevSlide" class="nav-btn" :disabled="transitioning">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="cart-btn" @click.stop="$emit('add-to-cart', product)">
                    <i class="fas fa-cart-plus"></i>
                </button>
                <button @click="nextSlide" class="nav-btn" :disabled="transitioning">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";

export default {
    setup(_, { emit }) {
        const store = useStore();
        const products = computed(() => store.getters.paginatedProducts);
        const active = ref(0);
        const transitioning = ref(false);

        watch(products, (newProducts) => {
            if (newProducts.length > 0) {
                active.value = 0;
            }
        });

        const getSlideStyle = (index) => {
            if (index === active.value) {
                return {
                    transform: 'none',
                    zIndex: 1,
                    filter: 'none',
                    opacity: 1
                };
            }

            let distance = index - active.value;
            let scale = 1 - 0.2 * Math.abs(distance);
            let blur = 'blur(5px)';
            let opacity = Math.abs(distance) > 2 ? 0 : 0.6;

            return {
                transform: `translateX(${120 * distance}px) scale(${scale}) perspective(16px) rotateY(${distance > 0 ? '-1' : '1'}deg)`,
                zIndex: -Math.abs(distance),
                filter: blur,
                opacity: opacity
            };
        };

        const changeSlide = async (direction) => {
            if (transitioning.value) return;
            transitioning.value = true;

            setTimeout(() => {
                active.value = (active.value + direction + products.value.length) % products.value.length;
                emit("select-product", products.value[active.value]);
                transitioning.value = false;
            }, 500);
        };

        const nextSlide = () => changeSlide(1);
        const prevSlide = () => changeSlide(-1);

        return {
            products,
            active,
            transitioning,
            getSlideStyle,
            nextSlide,
            prevSlide,
        };
    },
};
</script>

<style scoped>
.slider {
    position: relative;
    width: 100%;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.item {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    width: 320px;
    height: 380px;
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
    /* Added opacity */
}

/* Genre Tag */
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

/* Title Styling */
.card-title {
    font-size: 22px;
    font-weight: bold;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
    color: #ffcc00;
}

/* Description Styling */
.card-description {
    font-size: 14px;
    margin-top: 5px;
    opacity: 0.9;
}

/* Price Styling */
.card-price {
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
    color: #66ff99;
}

/* Buttons */
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
    transition: background 0.3s, transform 0.3s;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.nav-btn:hover,
.cart-btn:hover {
    background: rgba(0, 119, 255, 0.8);
    transform: scale(1.1);
}

/* Disabled Button */
.nav-btn:disabled {
    background: rgba(0, 119, 255, 0.3);
    cursor: not-allowed;
    transform: none;
}
</style>
