<template>
  <div class="home">
    <h1>Welcome to the Home Page</h1>
    <p>Click below to visit the product page:</p>
    <router-link to="/productview">Go to Product View</router-link>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
};
</script>

<style scoped>
/* Your HomeView styles here */
</style>
