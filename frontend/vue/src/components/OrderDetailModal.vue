<template>
    <!-- Modal Background -->
    <div v-if="visible && order" class="modal fade show" style="display: block;" tabindex="-1"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content glassmorphism">
                <!-- Modal Header -->
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Transaction #{{ order?.id || 'N/A' }}</h5>
                    <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
                </div>
                <!-- Modal Body -->
                <div class="modal-body">
                    <p><span class="font-weight-bold">Customer:</span> {{ order?.customer || 'N/A' }}</p>
                    <p><span class="font-weight-bold">Created At:</span> {{ formatDate(order?.created_at) }}</p>
                    <p><span class="font-weight-bold">Checked Out:</span> {{ order?.is_checked_out ? 'Yes' : 'No' }}</p>

                    <h3 class="text-xl font-semibold mb-2">Items:</h3>
                    <ul>
                        <li v-for="(item, index) in order?.items || []" :key="index" class="mb-2">
                            <p><strong>Product:</strong> {{ item.product?.name || 'N/A' }}</p>
                            <p><strong>Quantity:</strong> {{ item.quantity || 'N/A' }}</p>
                            <p><strong>Price:</strong> ${{ item.product?.price || '0.00' }}</p>
                        </li>
                    </ul>
                </div>
                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="close">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        order: {
            type: Object,
            required: true
        }
    },
    methods: {
        close() {
            this.$emit("close");
        },
        formatDate(iso) {
            return iso ? new Date(iso).toLocaleString() : 'N/A';
        }
    }
}
</script>

<style scoped>
/* Glassmorphism Style */
.glassmorphism {
    background: rgba(255, 255, 255, 0.85);
    /* Increase opacity from 0.1 to 0.85 */
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    color: #000;
    /* Change text color to black for better contrast */
    overflow: hidden;
    max-height: 90vh;
}

/* Center the modal on the screen */
.modal-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 90%;
    /* Limit modal width */
    width: 100%;
    margin: 0 auto;
    height: 100%;
}

.modal-content {
    border-radius: 12px;
    /* Make modal corners rounded */
}

/* Custom Scrollbar */
.modal-body {
    max-height: 60vh;
    /* Restrict the body height */
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #888 #333;
}

/* For Webkit Browsers */
.modal-body::-webkit-scrollbar {
    width: 8px;
}

.modal-body::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
}

.modal-body::-webkit-scrollbar-track {
    background: #333;
}

/* Optional: Modal Header and Footer Styling */
.modal-header,
.modal-footer {
    background: rgba(255, 255, 255, 0.6);
    /* Lighten it */
    border-bottom: none;
    color: #000;
}

.modal-footer button {
    color: #fff;
}
</style>