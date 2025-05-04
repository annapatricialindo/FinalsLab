<template>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.stock }}</td>
          <td>
            <span v-if="product.image">[Image]</span>
            <span v-else>No Image</span>
          </td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="$emit('edit', product)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="$emit('delete', product.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script>
  export default {
    props: ['products'],
  };
  </script>