<template>
  <div :class="themeClass" id="app">
    <button @click="toggleTheme" class="btn-toggle">
      <i :class="theme === 'light' ? 'bi-sun' : 'bi-moon'"></i>
      {{ theme === "light" ? "Modo Oscuro" : "Modo Claro" }}
    </button>

    <DataTable />
  </div>
</template>

<script>
import { ref, computed, provide } from "vue";
import DataTable from "./components/DataTable.vue";

export default {
  name: "App",
  components: {
    DataTable,
  },
  setup() {
    const theme = ref("light");

    const themeClass = computed(() => {
      return theme.value === "light" ? "theme-light" : "theme-dark";
    });

    const toggleTheme = () => {
      theme.value = theme.value === "light" ? "dark" : "light";
    };

    provide("theme", theme);

    return {
      theme,
      themeClass,
      toggleTheme,
    };
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  transition: background-color 0.3s ease, color 0.3s ease;
  height: 100vh;
}

.theme-light {
  background-color: white;
  color: black;
}

.theme-dark {
  background-color: #121212;
  color: white;
}

.btn-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s;
}

.btn-toggle:hover {
  background-color: #0056b3;
}

.btn-toggle:active {
  transform: scale(0.95);
}
</style>
