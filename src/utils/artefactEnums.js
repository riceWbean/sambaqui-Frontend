// Mapeamento de enums e constantes para o artefato

export const conservationStatusMap = {
  1: 'Excelente',
  2: 'Bom',
  3: 'Regular',
  4: 'Ruim',
  5: 'Muito Ruim'
}

export const completenessMap = {
  1: 'Completo',
  2: 'Fragmento',
  3: 'Muito Fragmentado',
  4: 'Peça Única'
}

export const detailConservationStatusMap = {
  1: 'Sem Danos',
  2: 'Pequenos Danos',
  3: 'Danos Moderados',
  4: 'Danos Graves',
  5: 'Deteriorado'
}

export const collectionCategoryMap = {
  1: 'Arqueológico',
  2: 'Etnográfico',
  3: 'Histórico',
  4: 'Natural',
  5: 'Outro'
}

export const ethnicGroupMap = {
  1: 'Sambaquianos',
  2: 'Guarani',
  3: 'Kaingang',
  4: 'Desconhecido',
  5: 'Outro'
}

export const techniqueMap = {
  1: 'Polido',
  2: 'Lascado',
  3: 'Inciso',
  4: 'Modelado',
  5: 'Pintado',
  6: 'Outro'
}

// Função auxiliar para obter o label de um enum
export const getEnumLabel = (value, enumMap) => {
  return enumMap[value] || 'Não informado'
}

// Função para formatar a data
export const formatDate = (dateString) => {
  if (!dateString) return 'Não informado'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Função para formatar data com hora
export const formatDateTime = (dateString) => {
  if (!dateString) return 'Não informado'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
