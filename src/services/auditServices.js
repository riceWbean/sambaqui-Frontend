import api from "@/plugins/api"

const AuditService = {
  getAllLogs: (options) => api.get("/audit-logs", { params: options }),

  getFilteredLogs: (filters) =>
    api.get("/audit-logs/filter", { params: filters }),

  getLogById: (id) => api.get(`/audit-logs/${id}`),
}

export default AuditService
