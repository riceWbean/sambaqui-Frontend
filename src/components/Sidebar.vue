<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="logo-section">
        <h2 class="logo-text">Sambaqui</h2>
        <p class="logo-subtitle">Museum</p>
      </div>
      <button class="toggle-btn" @click="toggleSidebar" title="Recolher/Expandir">
        {{ isCollapsed ? '→' : '←' }}
      </button>
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
              to="/artifacts/new" 
              class="nav-link"
              :class="{ active: isActive('/artifacts/new') }"
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
              to="/raw-materials" 
              class="nav-link"
              :class="{ active: isActive('/raw-materials') }"
            >
              <span class="nav-text">Matéria-Prima</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/subtypes" 
              class="nav-link"
              :class="{ active: isActive('/subtypes') }"
            >
              <span class="nav-text">Sub-Tipos</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/conservation-status" 
              class="nav-link"
              :class="{ active: isActive('/conservation-status') }"
            >
              <span class="nav-text">Estado de Conservação</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <button class="logout-btn" @click="logout">
        <span class="nav-text">Sair</span>
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
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
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
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
  gap: 0.75rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-left-color: #3498db;
}

.nav-link.active {
  background-color: rgba(52, 152, 219, 0.2);
  color: #3498db;
  border-left-color: #3498db;
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
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.logout-btn {
  width: 100%;
  background-color: rgba(231, 76, 60, 0.2);
  border: 1px solid rgba(231, 76, 60, 0.5);
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
  background-color: rgba(231, 76, 60, 0.4);
  border-color: rgba(231, 76, 60, 0.8);
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
