<template>
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ mode === 'add' ? 'Add' : 'Edit' }} Product</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <ProductForm :product="product" @submit="onSubmit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductForm from './ProductForm.vue';

export default {
  props: ['show', 'mode', 'product'],
  components: { ProductForm },
  methods: {
    onSubmit(formData) {
      this.$emit('save', formData);
    },
  },
};
</script>