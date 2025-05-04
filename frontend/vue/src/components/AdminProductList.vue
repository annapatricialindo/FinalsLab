<template>
    <div id="featured-products-container" class="glass-container">
        <h3 class="section-title">Featured Products</h3>

        <SearchBar v-model="searchQuery" placeholder="Search products..." @search="handleSearch" />

        <button class="add-btn btn-primary" @click="handleCreate">Add Product</button>
        <div class="product-list">
            <div v-for="(product, index) in products" :key="index" class="product-card"
                :style="{ backgroundImage: `url(${product.image})` }">
                <div class="product-overlay" :style="{
                    background: `linear-gradient(45deg, ${product.visual_primary_color}AA, ${product.visual_secondary_color}AA)`
                }"></div>
                <div class="product-info">
                    <span class="genre-tag">{{ product.genre }}</span>
                    <h3 class="card-title">{{ product.name }}</h3>
                    <p class="card-description">{{ product.description }}</p>
                    <p class="card-price"><strong>${{ product.price }}</strong></p>
                    <p class="card-stocks"><strong>Stocks: {{ product.stock }}</strong></p>
                    <div class="button-container">
                        <button class="edit-btn btn-warning" @click="handleEdit(product)">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="delete-btn btn-danger" @click="handleDelete(product.id)">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SearchBar from "@/components/SearchBar.vue";

export default {
    components: {
        SearchBar
    },
    props: {
        products: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            searchQuery: ""
        };
    },
    methods: {
        handleCreate() {
            this.$emit('create');
        },
        handleEdit(product) {
            this.$emit('edit', product);
        },
        handleDelete(id) {
            this.$emit('delete', id);
        },
        handleSearch() {
            this.$store.dispatch("products/searchProducts", this.searchQuery);
        }
    }
};
</script>

<style scoped>
.button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;
    position: absolute;
    bottom: 20px;
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
    overflow: hidden;
    /* Adjusted to avoid clipping */
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
    grid-template-columns: repeat(1, 1fr);
    /* Default to 1 column */
    gap: 20px;
    max-height: none;
    /* Removed max-height to prevent clipping */
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* Centers the content horizontally */
    width: 100%;
    height: 100%;
    /* Ensures full height for vertical centering */
    text-align: center;
    /* Center the text */
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
    text-align: center;
    /* Ensures it is centered */
}

#featured-products-container .card-description {
    font-size: 13px;
    opacity: 0.9;
    margin-bottom: 6px;
    text-align: center;
    /* Centers the description */
}

#featured-products-container .card-price {
    font-size: 16px;
    color: #66ff99;
    margin-bottom: 10px;
    text-align: center;
    /* Centers the price */
}

/* Edit Button */
#featured-products-container .edit-btn {
    background: rgba(0, 119, 255, 0.5);
    color: white;
    border: 2px solid rgba(0, 119, 255, 0.7);
    font-size: 20px;
    padding: 5px;
    /* Increased padding for larger container */
    border-radius: 12px;
    cursor: pointer;
    width: 80px;
    /* Increased width */
    height: 50px;
    /* Increased height */
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.3s, transform 0.3s;
}

#featured-products-container .delete-btn {
    background: rgba(250, 13, 13, 0.7);
    color: white;
    border: 2px solid rgba(250, 13, 13, 0.7);
    font-size: 20px;
    padding: 5px;
    /* Increased padding for larger container */
    border-radius: 12px;
    cursor: pointer;
    width: 82px;
    /* Increased width */
    height: 50px;
    /* Increased height */
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.3s, transform 0.3s;
}

.nav-btn:hover,
.add-btn:hover,
.edit-btn:hover,
.delete-btn:hover {
    background: rgba(0, 119, 255, 0.8);
    transform: scale(1.1);
}

.add-btn {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    font-weight: 600;
    background: linear-gradient(135deg, #4CAF50, #81C784);
    color: white;
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    margin-bottom: 1.5rem;
}

.add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #43A047, #66BB6A);
}

/* */

@media (min-width: 768px) {
    #featured-products-container .product-list {
        grid-template-columns: repeat(3, 1fr);
        /* 3 columns on medium screens */
    }
}
</style>