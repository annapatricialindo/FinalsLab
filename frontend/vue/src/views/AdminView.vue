<template>
    <AdminLayout>
        <!-- Featured Products -->
        <AdminProductList :products="products" @create="openCreateModal" @edit="openEditModal"
            @delete="deleteProduct" />

        <ProductModal ref="modalRef" @submit="handleModalSubmit" @close="() => { }" />
    </AdminLayout>
</template>


<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import AdminLayout from '@/layout/AdminLayout.vue'
import ProductModal from '@/components/ProductModal.vue'
import AdminProductList from '@/components/AdminProductList.vue'

const store = useStore()
const modalRef = ref(null)

const products = computed(() => store.state.products.products);

console.log(products);
const active = ref(0)

const openCreateModal = () => {
    modalRef.value?.open()
}

const openEditModal = (product) => {
    modalRef.value?.open(product)
}

const handleModalSubmit = (productData) => {
    if (productData.id) {
        store.dispatch('products/updateProduct', productData)
    } else {
        store.dispatch('products/createProduct', productData)
    }
}

const deleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
        store.dispatch('products/deleteProduct', productId)
            .then(() => {
                // Optionally, show a success message or notification here
                alert('Product deleted successfully');
            })
            .catch((error) => {
                // Optionally, handle error (e.g., show error message)
                console.error('Failed to delete product:', error);
            });
    }
}

watch(products, (newProducts) => {
    if (newProducts.length > 0) {
        active.value = 0
    }
})

onMounted(() => {
    store.dispatch('products/fetchProducts')
    console.log(store.getters['products/fetchProducts']);
})
</script>

<style scoped>
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

.nav-btn {
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

.nav-btn:disabled {
    background: rgba(0, 119, 255, 0.3);
    cursor: not-allowed;
    transform: none;
}
</style>
