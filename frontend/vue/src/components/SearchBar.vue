<template>
    <div class="search-bar">
      <input
        type="text"
        :placeholder="placeholder"
        v-model="localQuery"
        @input="emitSearch"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: "SearchBar",
    props: {
      placeholder: {
        type: String,
        default: "Search..."
      },
      modelValue: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        localQuery: this.modelValue
      };
    },
    watch: {
      modelValue(val) {
        this.localQuery = val;
      }
    },
    methods: {
      emitSearch() {
        this.$emit("update:modelValue", this.localQuery);
        this.$emit("search", this.localQuery);
      }
    }
  };
  </script>
  
  <style scoped>
  .search-bar {
    margin-bottom: 1rem;
    text-align: center;
  }
  .search-bar input {
    width: 80%;
    max-width: 400px;
    padding: 10px;
    font-size: 16px;
    border-radius: 12px;
    border: none;
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  }
  </style>
  