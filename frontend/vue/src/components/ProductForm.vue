<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label class="form-label">Name</label>
      <input type="text" class="form-control" v-model="localProduct.name" required />
    </div>
    <div class="mb-3">
      <label class="form-label">Description</label>
      <textarea class="form-control" v-model="localProduct.description"></textarea>
    </div>
    <div class="mb-3">
      <label class="form-label">Price</label>
      <input type="number" step="0.01" class="form-control" v-model="localProduct.price" required />
    </div>
    <div class="mb-3">
      <label class="form-label">Stock</label>
      <input type="number" class="form-control" v-model="localProduct.stock" required />
    </div>
    <div class="mb-3">
      <label class="form-label">Image</label>
      <input type="file" class="form-control" @change="handleFileUpload" />
    </div>
    <button type="submit" class="btn btn-primary">Save</button>
  </form>
</template>

<script>
export default {
  props: ['product'],
  data() {
    return {
      localProduct: { ...this.product } || { name: '', description: '', price: '', stock: '', image: null },
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.localProduct);
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.localProduct.image = file;
      }
    },
  },
};
</script>