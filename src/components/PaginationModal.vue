<template>
  <nav
    aria-label="Page navigation"
    class="d-flex justify-content-between align-items-center">
    <div class="pagination-info">
      Mostrando {{ startIndex + 1 }} -
      {{ Math.min(endIndex, filteredUsers.length) }} de
      {{ filteredUsers.length }} registros
    </div>
    <ul class="pagination mb-0">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" @click.prevent="goToPage(currentPage - 1)">
          <i class="bi bi-chevron-left"></i>
        </a>
      </li>
      <li
        v-for="page in displayedPages"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page }">
        <a class="page-link" href="#" @click.prevent="goToPage(page)">
          {{ page }}
        </a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" @click.prevent="goToPage(currentPage + 1)">
          <i class="bi bi-chevron-right"></i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: Number,
    totalPages: Number,
    startIndex: Number,
    endIndex: Number,
    filteredUsers: Array,
    displayedPages: Array,
  },
  methods: {
    goToPage(page) {
      this.$emit("change-page", page);
    },
  },
};
</script>
<style>
.pagination-info {
  color: #6c757d;
}

.page-link {
  padding: 0.5rem 0.75rem;
  margin: 0 2px;
  border-radius: 4px;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
