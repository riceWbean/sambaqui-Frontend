<template>
  <div class="manager-layout">
    <!-- Sidebar -->
    <Sidebar @toggle="onSidebarToggle" />

    <!-- Main Content -->
    <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Top Header Bar -->
      <header class="top-header">
        <div class="header-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p class="page-breadcrumb">{{ breadcrumb }}</p>
        </div>

        <div class="header-right">
          <div class="user-info">
            <span class="user-name">Usuário</span>
            <div class="user-avatar">U</div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="page-content">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'

export default {
  name: 'ManagerLayout',
  components: {
    Sidebar
  },
  props: {
    pageTitle: {
      type: String,
      default: 'Página'
    },
    breadcrumb: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sidebarCollapsed: false
    }
  },
  methods: {
    onSidebarToggle(collapsed) {
      this.sidebarCollapsed = collapsed
    }
  }
}
</script>

<style scoped>
.manager-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

/* Top Header */
.top-header {
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  flex: 1;
}

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  color: #2c3e50;
  font-weight: 700;
}

.page-breadcrumb {
  margin: 0;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

/* Page Content */
.page-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 70px;
  }

  .main-content.sidebar-collapsed {
    margin-left: 70px;
  }

  .top-header {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .page-title {
    font-size: 1.3rem;
  }

  .header-right {
    width: 100%;
    justify-content: flex-end;
  }

  .page-content {
    padding: 1rem;
  }
}
</style>
