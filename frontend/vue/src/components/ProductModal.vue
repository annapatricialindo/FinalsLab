<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <h3 class="modal-title">{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h3>
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="productName">Product Name</label>
            <input type="text" id="productName" v-model="form.name" required />
          </div>
          <div class="form-group">
            <label for="productImage">Product Image</label>
            <input type="file" id="productImage" @change="handleImageUpload" />
          </div>
          <div class="form-group">
            <label for="productPrice">Price</label>
            <input type="number" id="productPrice" v-model="form.price" min="0" required />
          </div>
          <div class="form-group">
            <label for="productStock">Stock</label>
            <input type="number" id="productStock" v-model="form.stock" min="0" required />
          </div>
          <div class="form-group">
            <label for="productDescription">Description</label>
            <textarea id="productDescription" v-model="form.description" required></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">{{ editingProduct ? 'Update' : 'Create' }}</button>
          <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ProductModal',
  emits: ['close', 'submit'],
  setup(_, { emit, expose }) {
    const show = ref(false)
    const editingProduct = ref(null)
    const form = ref({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: null,
    })

    const open = (product = null) => {
      show.value = true
      editingProduct.value = product
      form.value = product
        ? { ...product }
        : { name: '', description: '', price: 0, stock: 0, image: null }
    }

    const close = () => {
      show.value = false
      emit('close')
    }

    const handleImageUpload = (event) => {
      form.value.image = event.target.files[0]
    }

    const handleSubmit = () => {
      emit('submit', { ...form.value, id: editingProduct.value?.id || null })
      close()
    }

    expose({ open })

    return {
      show,
      form,
      editingProduct,
      open,
      close,
      handleSubmit,
      handleImageUpload,
    }
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 1rem;
}

.modal-container {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  max-height: 90vh;
}

.modal-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
}

.modal-form {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007BFF;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-container {
    padding: 1.5rem;
  }

  .form-actions {
    justify-content: center;
  }
}
</style>
