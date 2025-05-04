<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <header class="modal-header">
                <h3>{{ modalTitle }}</h3>
                <button class="close-btn" @click="closeModal">X</button>
            </header>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="name">Product Name:</label>
                    <input type="text" id="name" v-model="product.name" class="form-control" required />
                </div>

                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea id="description" v-model="product.description" class="form-control" required></textarea>
                </div>

                <div class="form-group">
                    <label for="price">Price:</label>
                    <!-- Allow decimal input with step="0.01" to specify two decimal places -->
                    <input type="number" id="price" v-model="product.price" class="form-control" required step="0.01"
                        min="0" />
                </div>

                <div class="form-group">
                    <label for="image">Image:</label>
                    <input type="file" id="image" @change="handleImageChange" class="form-control" />
                    <img v-if="product.imagePreview" :src="product.imagePreview" alt="Image Preview"
                        class="img-fluid mt-2" />
                </div>

                <div class="button-container text-end">
                    <button type="submit" class="btn btn-primary">{{ modalTitle }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isVisible: Boolean,
        productToEdit: Object,
        modalTitle: String,
        onClose: Function,
        onSubmit: Function
    },
    data() {
        return {
            product: { name: "", description: "", price: 0, image: "", imagePreview: "" }
        };
    },
    watch: {
        productToEdit(newProduct) {
            if (newProduct) {
                this.product = { ...newProduct };
            }
        }
    },
    methods: {
        submitForm() {
            if (typeof this.onSubmit === 'function') {
                this.onSubmit(this.product); // Call the function passed by the parent
            } else {
                console.error('onSubmit is not a function');
            }
        },
        closeModal() {
            this.onClose();
        },
        handleImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.product.image = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.product.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    max-width: 800px;
    width: 100%;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.close-btn {
    background-color: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
}

input,
textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 5px;
}

textarea {
    height: 100px;
}

.button-container {
    display: flex;
    justify-content: flex-end;
}

.submit-btn {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.submit-btn:hover {
    background-color: #0056b3;
}

.img-fluid {
    max-width: 100%;
    height: auto;
}
</style>