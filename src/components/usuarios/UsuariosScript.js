import axios from "axios";
import { inject, computed } from "vue";
import CameraModal from "../CameraModal.vue";
import PaginationModal from "../PaginationModal.vue";

export default {
  name: "DataTable",
  setup() {
    // Inyectar el tema desde el componente padre (App.vue)
    const theme = inject("theme", "light");

    // Computed para definir la clase de tema
    const themeClass = computed(() => {
      return theme.value === "light" ? "theme-light" : "theme-dark";
    });

    return {
      themeClass,
    };
  },
  components: {
    CameraModal,
    PaginationModal,
  },
  data() {
    return {
      showCamera: false,
      theme: "light",
      users: [],
      searchQuery: "",
      currentPage: 1,
      pageSize: 10,
      sortColumn: null,
      sortDirection: "asc",
      showColumn: {
        id: true,
        nombreCompleto: true,
        telefono: true,
        email: true,
      },
      searchTimeout: null,
    };
  },
  computed: {
    themeClass() {
      return this.theme === "light" ? "theme-light" : "theme-dark";
    },
    filteredUsers() {
      return this.users.filter((user) => {
        const searchTerm = this.searchQuery.toLowerCase();
        return (
          user.nombreCompleto.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.telefono.toLowerCase().includes(searchTerm)
        );
      });
    },
    sortedUsers() {
      if (!this.sortColumn) return this.filteredUsers;

      return [...this.filteredUsers].sort((a, b) => {
        const aValue = a[this.sortColumn];
        const bValue = b[this.sortColumn];

        if (this.sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    },
    paginatedData() {
      return this.sortedUsers.slice(this.startIndex, this.endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.pageSize);
    },
    startIndex() {
      return (this.currentPage - 1) * this.pageSize;
    },
    endIndex() {
      return this.startIndex + this.pageSize;
    },
    displayedPages() {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;

      range.push(1);

      for (
        let i = this.currentPage - delta;
        i <= this.currentPage + delta;
        i++
      ) {
        if (i < this.totalPages && i > 1) {
          range.push(i);
        }
      }

      range.push(this.totalPages);

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    },
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },
    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
      }, 300);
    },
    sortTable(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column;
        this.sortDirection = "asc";
      }
    },
    getSortIcon(column) {
      if (this.sortColumn !== column) return "bi bi-arrow-down-up";
      return this.sortDirection === "asc"
        ? "bi bi-arrow-up"
        : "bi bi-arrow-down";
    },
    async fetchUsers() {
      try {
        const response = await axios.get(
          "https://www.4sides.com.mx/api/prueba-tecnica/usuarios/index?results=50"
        );
        this.users = response.data.usuarios.map((user, index) => ({
          id: index + 1,
          nombreCompleto: `${user.usuarioNombre} ${user.usuarioApellidoPaterno} ${user.usuarioApellidoMaterno}`,
          telefono: user.usuarioEmail,
          email: user.usuarioTelefono,
        }));
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    },
    deleteUser(index) {
      this.users.splice(this.startIndex + index, 1);
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openCamera() {
      this.showCamera = true;
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
