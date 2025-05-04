<template>
    <AdminLayout>
        <div class="container my-5">
            <div class="card shadow-sm rounded-4 border-0 p-4 bg-white bg-opacity-75">
                <h2 class="mb-4 text-center fw-bold">Transaction List</h2>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="dateFrom">From:</label>
                        <input type="date" v-model="filters.from" class="form-control" />
                    </div>
                    <div class="col-md-6">
                        <label for="dateTo">To:</label>
                        <input type="date" v-model="filters.to" class="form-control" />
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-primary" @click="fetchOrders">Filter</button>
                        <button class="btn btn-secondary ms-2" @click="resetFilters">Reset</button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover table-bordered align-middle text-center">
                        <thead class="table-light">
                            <tr>
                                <th @click="sortBy('id')" class="sortable">#</th>
                                <th @click="sortBy('customer')" class="sortable">Customer</th>
                                <th @click="sortBy('created_at')" class="sortable">Created At</th>
                                <th>Checked Out</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order.id">
                                <td>{{ order.id }}</td>
                                <td>{{ order.customer }}</td>
                                <td>{{ formatDate(order.created_at) }}</td>
                                <td>
                                    <span
                                        :class="order.is_checked_out ? 'badge bg-success' : 'badge bg-warning text-dark'">
                                        {{ order.is_checked_out ? 'Yes' : 'No' }}
                                    </span>
                                </td>
                                <td>
                                    <button @click="openModal(order)" class="btn btn-sm btn-outline-primary">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="orders.length === 0">
                                <td colspan="5" class="text-muted">No orders found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <OrderDetailModal :visible="showModal" :order="selectedOrder" @close="closeModal" />
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import OrderDetailModal from '@/components/OrderDetailModal.vue';
import AdminLayout from '@/layout/AdminLayout.vue';

const orders = ref([]);
const showModal = ref(false);
const selectedOrder = ref(null);

onMounted(async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/orders/orders/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        orders.value = await response.json();
    } catch (err) {
        console.error('Fetch error:', err);
    }
});

const openModal = (order) => {
    selectedOrder.value = order;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const formatDate = (iso) => {
    return iso ? new Date(iso).toLocaleString() : 'N/A';
};

const filters = ref({ from: '', to: '' });
const sort = ref({ key: 'id', asc: true });

const sortBy = (key) => {
    if (sort.value.key === key) {
        sort.value.asc = !sort.value.asc;
    } else {
        sort.value.key = key;
        sort.value.asc = true;
    }
    sortOrders();
};

const sortOrders = () => {
    orders.value.sort((a, b) => {
        let valA = a[sort.value.key];
        let valB = b[sort.value.key];

        // If sorting by date
        if (sort.value.key === 'created_at') {
            valA = new Date(valA);
            valB = new Date(valB);
        }

        if (valA < valB) return sort.value.asc ? -1 : 1;
        if (valA > valB) return sort.value.asc ? 1 : -1;
        return 0;
    });
};

const fetchOrders = async () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);  // Set the time to midnight to only compare the date

    const fromDate = filters.value.from ? new Date(filters.value.from) : null;
    const toDate = filters.value.to ? new Date(filters.value.to) : null;

    // Set time to midnight for the fromDate as well
    if (fromDate) {
        fromDate.setHours(0, 0, 0, 0);
    }

    // Validation checks
    if (fromDate && fromDate > now) {
        alert("'From' date cannot be today or in the future.");
        return;
    }
    if (toDate && toDate < now) {
        alert("'To' date cannot be in the past.");
        return;
    }
    if (toDate && fromDate && toDate < fromDate) {
        alert("'To' date cannot be earlier than 'From' date.");
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const query = new URLSearchParams();
        if (filters.value.from) query.append('from', filters.value.from);
        if (filters.value.to) query.append('to', filters.value.to);

        const response = await fetch(`http://localhost:8000/api/orders/orders/?${query.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        orders.value = await response.json();
        sortOrders();
    } catch (err) {
        console.error('Fetch error:', err);
    }
};

const resetFilters = () => {
    filters.value.from = '';
    filters.value.to = '';
    fetchOrders();
};

onMounted(fetchOrders);

</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
}

.table th.sortable {
    cursor: pointer;
    user-select: none;
}

.table th.sortable:hover {
    background-color: #f0f0f0;
}
</style>