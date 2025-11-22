<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="logo-section">
        <h2 class="logo-text">Museu do Sambaqui</h2>
        <p class="logo-subtitle">Gestão de Acervo</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <!-- Main Section -->
      <div class="nav-section">
        <p class="nav-section-title">Principal</p>
        <ul class="nav-menu">
          <li>
            <router-link 
              to="/management" 
              class="nav-link"
              :class="{ active: isActive('/management/') }"
            >
              <span class="nav-text">Painel Principal</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Acervo Section -->
      <div class="nav-section">
        <p class="nav-section-title">Acervo</p>
        <ul class="nav-menu">
          <li>
            <router-link 
              to="/management/artefactsList" 
              class="nav-link"
              :class="{ active: isActive('/management/artefacstList') }"
            >
              <span class="nav-text">Listagem de Artefatos</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/management/add"
              class="nav-link"
              :class="{ active: isActive('/management/add') }"
            >
              <span class="nav-text">Novo Artefato</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Coleções Section -->
      <div class="nav-section">
        <p class="nav-section-title">Coleções</p>
        <ul class="nav-menu">
          <li>
            <router-link 
              to="/collections" 
              class="nav-link"
              :class="{ active: isActive('/collections') }"
            >
              <span class="nav-text">Gerenciar Coleções</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Localização Section -->
      <div class="nav-section">
        <p class="nav-section-title">Localização</p>
        <ul class="nav-menu">
          <li>
            <router-link 
              to="/locations" 
              class="nav-link"
              :class="{ active: isActive('/locations') }"
            >
              <span class="nav-text">Sítios Arqueológicos</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/reserves" 
              class="nav-link"
              :class="{ active: isActive('/reserves') }"
            >
              <span class="nav-text">Reservas Técnicas</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/movements" 
              class="nav-link"
              :class="{ active: isActive('/movements') }"
            >
              <span class="nav-text">Movimentações</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Vocabulário Section -->
      <div class="nav-section">
        <p class="nav-section-title">Vocabulário</p>
        <ul class="nav-menu">
          <li>
            <router-link 
              to="/management/raw-materials" 
              class="nav-link"
              :class="{ active: isActive('/raw-materials') }"
            >
              <span class="nav-text">Matéria-Prima</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/management/sub-types" 
              class="nav-link"
              :class="{ active: isActive('/management/sub-types') }"
            >
              <span class="nav-text">Sub-Tipos</span>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- Auditoria Section -->
      <div class="nav-section">
        <p class="nav-section-title">Auditoria</p>
        <ul class="nav-menu">
          <li>
            <router-link
              to="/management/log-changes"
              class="nav-link"
              :class="{ active: isActive('/management/log-changes') }"
            >
              <span class="nav-text">Registros de Auditoria</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <button class="logout-btn" @click="logout">
        <span class="nav-text">Sair</span>
        <svg class="logout-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.5rem;">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isCollapsed: false
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
      this.$emit('toggle', this.isCollapsed)
    },
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
    },
    logout() {
      if (confirm('Tem certeza que deseja sair?')) {
        console.log('Logout')
        // Implementar lógica de logout
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: #2E2E2E;
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.sidebar.collapsed {
  width: 80px;
}

/* Sidebar Header */
.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.logo-text {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.logo-subtitle {
  margin: 0;
  font-size: 0.75rem;
  opacity: 0.8;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: opacity 0.3s;
  opacity: 0.7;
}

.toggle-btn:hover {
  opacity: 1;
}

.sidebar.collapsed .toggle-btn {
  display: none;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 1rem;
}

.nav-section-title {
  margin: 0;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.sidebar.collapsed .nav-section-title {
  opacity: 0;
  height: 0;
  padding: 0;
  margin: 0;
}

.nav-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #E4DFDB;
  text-decoration: none;
  transition: all 0.3s;
  border-left: none; 
  border-bottom: 3px solid transparent;
  gap: 0.75rem;
}

.nav-link {
  position: relative;
  border-bottom-color: transparent;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  transform-origin: left;
  transform: scaleX(0);
  background: linear-gradient(to right, #E4DFDB , rgba(224, 216, 216, 0.85) 40%, rgba(221, 212, 212, 0.01) 100%);
  transition: transform 300ms ease;
  pointer-events: none;
}

/* Hover: animate sweep from right to left */
.nav-link:hover::after {
  transform: scaleX(1);
}

.nav-link:hover {
  background-color: rgba(119, 115, 115, 0.1);
  color: white;
}

.nav-link.active::after {
  transform: scaleX(1);
  background: #E4DFDB ;
}

.nav-link.active {
  background-color: rgba(76, 79, 82, 0.2);
  color: #bec5ca;
  font-weight: 600;
}

.nav-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar.collapsed .nav-text {
  display: none;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  justify-content: center;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.logout-btn {
  width: 80%;
  background-color: #737373;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #ecf0f1;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.logout-btn:hover {
  background-color: rgba(105, 104, 104, 0.4);
  border-color: rgba(180, 180, 180, 0.8);
  color: white;
}

/* Scrollbar Styling */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }

  .sidebar.collapsed {
    width: 70px;
  }

  .sidebar-header {
    padding: 1rem;
    min-height: 70px;
  }

  .logo-section {
    display: none;
  }

  .toggle-btn {
    display: none;
  }

  .nav-text {
    display: none;
  }

  .nav-section-title {
    display: none;
  }

  .nav-link {
    justify-content: center;
    padding: 0.75rem;
  }
}
</style>
