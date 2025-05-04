export default {
  namespaced: true,
  state: {
      orders: [],
      orderItems: [],
      currentOrder: null,
      currentPage: 1,
      itemsPerPage: 0,
  },
  getters: {
      totalPages: (state) => Math.ceil(state.orders.length / state.itemsPerPage),
      paginatedOrders: (state) => {
          const start = (state.currentPage - 1) * state.itemsPerPage;
          return state.orders.slice(start, start + state.itemsPerPage);
      },
      selectedOrder: (state) => state.currentOrder,
      currentOrderItems: (state) => state.orderItems,
  },
  mutations: {
      SET_ORDERS(state, orders) {
          state.orders = orders;
      },
      SET_ORDER_ITEMS(state, items) {
          state.orderItems = items;
      },
      SET_CURRENT_ORDER(state, order) {
          state.currentOrder = order;
      },
      SET_ITEMS_PER_PAGE(state, count) {
          state.itemsPerPage = count;
      },
      SET_CURRENT_PAGE(state, page) {
          state.currentPage = page;
      },
  },
  actions: {
      async fetchOrders({ commit, rootState }) {
          try {
              const token = rootState.auth.token;
              const res = await fetch("http://localhost:8000/api/orders/orders/", {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      Accept: "application/json",
                  },
              });
              if (!res.ok) throw await res.json();
              const data = await res.json();
              commit("SET_ORDERS", data);
              commit("SET_ITEMS_PER_PAGE", data.length);
              console.log("Yes", data);
          } catch (err) {
              console.error("Failed to fetch orders:", err);
          }
      },

      async fetchOrderDetail({ commit, rootState }, orderId) {
          try {
              const token = rootState.auth.token;
              const res = await fetch(`http://localhost:8000/api/orders/orders/${orderId}/`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      Accept: "application/json",
                  },
              });
              if (!res.ok) throw await res.json();
              const order = await res.json();
              commit("SET_CURRENT_ORDER", order);
          } catch (err) {
              console.error("Failed to fetch order detail:", err);
          }
      },

      async fetchOrderItems({ commit, rootState }, orderId) {
          try {
              const token = rootState.auth.token;
              const res = await fetch(`http://localhost:8000/api/orders/orders/${orderId}/items/`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      Accept: "application/json",
                  },
              });
              if (!res.ok) throw await res.json();
              const items = await res.json();
              commit("SET_ORDER_ITEMS", items);
          } catch (err) {
              console.error("Failed to fetch order items:", err);
          }
      },
  },
};
