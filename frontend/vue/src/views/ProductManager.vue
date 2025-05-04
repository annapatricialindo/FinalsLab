<template>
  <div>
    <h2>Product Manager</h2>
    <button class="btn btn-primary mb-3" @click="openModal('add')">Add Product</button>

    <ProductTable
      :products="products"
      @edit="openModal('edit', $event)"
      @delete="handleDelete($event)"
    />

    <ProductModal
      :show="showModal"
      :mode="modalMode"
      :product="selectedProduct"
      @close="showModal = false"
      @save="handleSave"
    />
  </div>
</template>

<script>
import ProductTable from '../components/ProductTable.vue';
import ProductModal from '../components/ProductModal.vue';

export default {
  components: { ProductTable, ProductModal },
  data() {
    return {
      products: [],
      showModal: false,
      modalMode: 'add',
      selectedProduct: null,
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    fetchProducts() {
      // Placeholder for API call
      this.products = [
        { id: 1, name: 'Tesda', description: 'Real', price: '1.50', stock: 48, image: null },
        { id: 2, name: 'Tesda12', description: 'Real', price: '1.50', stock: 50, image: null },
      ];
    },
    openModal(mode, product = null) {
      this.modalMode = mode;
      this.selectedProduct = product;
      this.showModal = true;
    },
    handleSave(product) {
      if (this.modalMode === 'add') {
        product.id = Date.now();
        this.products.push(product);
      } else {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) this.products.splice(index, 1, product);
      }
      this.showModal = false;
    },
    handleDelete(productId) {
      this.products = this.products.filter(p => p.id !== productId);
    },
  },
};
</script>