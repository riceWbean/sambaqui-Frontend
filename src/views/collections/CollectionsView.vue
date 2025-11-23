<script setup>
import { ref, computed } from 'vue'
import ManagerLayout from '@/layouts/ManagerLayout.vue'

// --- ESTADO LOCAL ---
const researchers = ref([
    { id: 1, name: 'Dr. Carlos Mendes', objectsCount: 247 },
    { id: 2, name: 'Profa. Maria Silva', objectsCount: 189 },
    { id: 3, name: 'Prof. João Santos', objectsCount: 312 },
    { id: 4, name: 'Dra. Ana Costa', objectsCount: 156 },
    { id: 5, name: 'Prof. Pedro Oliveira', objectsCount: 423 },
    { id: 6, name: 'Dra. Julia Rocha', objectsCount: 198 },
])

// Estado do modal de cadastro/edição
const showModal = ref(false)
const isEditing = ref(false)
const editingResearcher = ref(null)
const formData = ref({
    name: '',
    email: '',
    institution: '',
    researchArea: '',
    objectsCount: 0
})

// --- COMPUTED ---
// Média de objetos
const averageObjects = computed(() => {
    if (researchers.value.length === 0) return 0
    const total = researchers.value.reduce((sum, researcher) => sum + researcher.objectsCount, 0)
    return (total / researchers.value.length).toFixed(2)
})

// --- MÉTODOS DE MODAL E CRUD ---
// Abrir modal para adicionar
const openModal = () => {
    isEditing.value = false
    editingResearcher.value = null
    showModal.value = true
}

// Abrir modal para editar
const openEditModal = (researcher) => {
    isEditing.value = true
    editingResearcher.value = researcher
    formData.value = { ...researcher }
    showModal.value = true
}

// Fechar modal
const closeModal = () => {
    showModal.value = false
    isEditing.value = false
    editingResearcher.value = null
    formData.value = {
        name: '',
        email: '',
        institution: '',
        researchArea: '',
        objectsCount: 0
    }
}

// Lógica de cadastro
const submitResearcher = async () => {
    if (!formData.value.name || !formData.value.email || !formData.value.institution) {
        alert('Por favor, preencha todos os campos obrigatórios.')
        return
    }

    if (isEditing.value) {
        // Editar
        const index = researchers.value.findIndex(r => r.id === editingResearcher.value.id)
        if (index !== -1) {
            researchers.value[index] = { ...formData.value, id: editingResearcher.value.id }
            alert(`Pesquisador "${formData.value.name}" atualizado com sucesso!`)
        }
    } else {
        // Adicionar
        const newId = Math.max(0, ...researchers.value.map(r => r.id)) + 1
        const newResearcher = {
            id: newId,
            ...formData.value
        }
        researchers.value.push(newResearcher)
        alert(`Pesquisador "${newResearcher.name}" cadastrado com sucesso!`)
    }
    closeModal()
}

// Deletar pesquisador
const deleteResearcher = (researcher) => {
    if (confirm(`Tem certeza que deseja deletar ${researcher.name}?`)) {
        researchers.value = researchers.value.filter(r => r.id !== researcher.id)
        alert(`Pesquisador "${researcher.name}" deletado com sucesso!`)
    }
}
</script>

<template>
    <ManagerLayout>
        <div class="cards-container">
            <div class="header-with-btn">
                <h1>Pesquisadores de Arqueologia</h1>
                <button class="add-button" @click="openModal">
                    +
                </button>
            </div>

            <p class="average">Média de objetos por pesquisador: {{ averageObjects }}</p>

            <div class="cards-grid">
                <div v-for="researcher in researchers" :key="researcher.id" class="card">
                    <h2 class="name">{{ researcher.name }}</h2>
                    <p class="count">{{ researcher.objectsCount }} objetos</p>
                    <div class="card-actions">
                        <button class="btn-edit" @click="openEditModal(researcher)">Editar</button>
                        <button class="btn-delete" @click="deleteResearcher(researcher)">Deletar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-overlay" v-if="showModal" @click="closeModal">
            <div class="modal-container" @click.stop>
                <div class="modal-header">
                    <h2>{{ isEditing ? 'Editar Pesquisador' : 'Cadastrar Novo Pesquisador' }}</h2>
                    <button class="close-btn" @click="closeModal">&times;</button>
                </div>

                <div class="modal-body">
                    <p class="modal-subtitle">
                        {{ isEditing ? 'Edite os dados do pesquisador.' : 'Preencha os dados do novo pesquisador que será adicionado à lista.' }}
                    </p>

                    <form @submit.prevent="submitResearcher">
                        <div class="form-group">
                            <label class="required">Nome Completo</label>
                            <input 
                                type="text" 
                                v-model="formData.name" 
                                placeholder="Nome e sobrenome"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label class="required">Email Institucional</label>
                            <input 
                                type="email" 
                                v-model="formData.email" 
                                placeholder="email@instituicao.com"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label class="required">Instituição</label>
                            <input 
                                type="text" 
                                v-model="formData.institution" 
                                placeholder="Universidade ou Centro de Pesquisa"
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label>Área de Pesquisa</label>
                            <input 
                                type="text" 
                                v-model="formData.researchArea" 
                                placeholder="Ex: Cerâmica, Paleolítico"
                            />
                        </div>

                        <div class="form-group" v-if="isEditing">
                            <label>Contador de Objetos</label>
                            <input 
                                type="number" 
                                v-model.number="formData.objectsCount" 
                                placeholder="Número de objetos"
                                min="0"
                            />
                        </div>

                        <div class="modal-actions">
                            <button type="button" class="btn-cancel" @click="closeModal">
                                Cancelar
                            </button>
                            <button type="submit" class="btn-submit">
                                {{ isEditing ? 'Atualizar Pesquisador' : 'Cadastrar Pesquisador' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </ManagerLayout>
</template>

<style scoped lang="scss">
// Importação do seu arquivo SASS (se estiver usando)
// @import '@/assets/sass/collections/_artefactCollections.scss'; // Mantive a importação como referência

.cards-container {
    max-width: 1200px; // Aumentei para acomodar mais cards
    margin: 2rem auto;
    padding: 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; // Fonte mais moderna
    text-align: center;
    
    .header-with-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        margin-bottom: 1rem; // Ajustei margem
        flex-wrap: wrap; // Responsivo
    }

    h1 {
        margin: 0;
        color: #fff;
        font-size: 2rem; // Maior título
        font-weight: 700;
    }
    
    .add-button {
        background: linear-gradient(135deg, #BFA78D, #d4bda7); // Gradiente para mais estilo
        color: #1e1e1e;
        border: none;
        border-radius: 50%;
        width: 50px; // Maior botão
        height: 50px;
        font-size: 1.8rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease; // Transição mais suave
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        line-height: 1;
        
        &:hover {
            background: linear-gradient(135deg, #d4bda7, #e8d5c4);
            transform: scale(1.1) rotate(90deg); // Animação de rotação
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
    }

    .average {
        margin-bottom: 2rem;
        font-weight: bold;
        color: #b6b6b6;
        font-size: 1.1rem;
        background: rgba(255, 255, 255, 0.05); // Fundo sutil
        padding: 0.5rem 1rem;
        border-radius: 8px;
        display: inline-block;
    }

    .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); // Maior min-width para cards
        gap: 2rem; // Maior gap
    }

    .card {
        background: linear-gradient(145deg, #303030, #424242ab); // Gradiente nos cards
        padding: 2rem; // Mais padding
        border-radius: 12px; // Bordas mais arredondadas
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden; // Para pseudo-elementos

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #BFA78D, #d4bda7); // Barra superior
        }

        &:hover {
            transform: translateY(-6px) scale(1.02); // Mais elevação
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
        }

        .name {
            font-size: 1.4rem; // Maior fonte
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #ffffff;
        }

        .count {
            font-size: 1.1rem;
            color: #ffffff;
            margin-bottom: 1rem;
        }

        .card-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: center;

            button {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 6px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;

                &.btn-edit {
                    background: #f39c12;
                    color: white;

                    &:hover {
                        background: #f39d12bb;
                        transform: translateY(-2px);
                    }
                }

                &.btn-delete {
                    background: #f44336;
                    color: white;

                    &:hover {
                        background: #da190b;
                        transform: translateY(-2px);
                    }
                }
            }
        }
    }
}

/* ESTILOS DO MODAL - Melhorados */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8); // Mais escuro
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.4s ease; // Mais lento
    backdrop-filter: blur(5px); // Efeito de blur
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.modal-container {
    background: linear-gradient(145deg, #1e1e1e, #2a2a2a); // Gradiente no modal
    border-radius: 20px; // Mais arredondado
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    max-width: 550px; // Maior largura
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.4s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(50px) scale(0.9);
        opacity: 0;
    }
    to {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

.modal-header {
    background: linear-gradient(135deg, #1e1e1e, #333);
    color: white;
    padding: 2.5rem 2rem;
    text-align: center;
    border-bottom: 1px solid #444;
    position: relative;
}

.modal-header h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.5px;
}

.close-btn {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: none;
    border: none;
    color: #aaa;
    font-size: 2.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    line-height: 1;
    padding: 0;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
    }
}

.modal-body {
    padding: 2.5rem;
}

.modal-subtitle {
    margin: 0 0 2rem;
    font-size: 1rem;
    color: #aaa;
    text-align: center;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem; // Mais espaço
}

.form-group label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.75rem;
}

.form-group label.required::after {
    content: ' *';
    color: #e74c3c;
}

.form-group input {
    padding: 1rem 1.25rem; // Mais padding
    border: 2px solid #414141;
    border-radius: 10px; // Mais arredondado
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;
    background-color: #333;
    color: #fff;
}

.form-group input:focus {
    outline: none;
    border-color: #BFA78D;
    box-shadow: 0 0 0 4px rgba(191, 167, 141, 0.15); // Maior glow
}

.form-group input::placeholder {
    color: #aaa;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1.5rem;
    margin-top: 2.5rem;
}

.btn-cancel,
.btn-submit {
    padding: 1rem 2rem; // Maior padding
    font-size: 1.1rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.btn-cancel {
    background: #474747;
    color: #fff;

    &:hover {
        background: #5a5a5a;
        transform: translateY(-2px);
    }
}

.btn-submit {
    background: linear-gradient(135deg, #BFA78D, #d4bda7);
    color: #1e1e1e;

    &:hover {
        background: linear-gradient(135deg, #d4bda7, #e8d5c4);
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(191, 167, 141, 0.3);
    }
}

// Responsividade
@media (max-width: 768px) {
    .cards-container {
        padding: 0.5rem;

        .header-with-btn {
            flex-direction: column;
            gap: 10px;
        }

        h1 {
            font-size: 1.5rem;
        }

        .cards-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .card {
            padding: 1.5rem;
        }
    }

    .modal-container {
        width: 95%;
        margin: 1rem;
    }

    .modal-header {
        padding: 2rem 1.5rem;
    }

    .modal-body {
        padding: 2rem 1.5rem;
    }

    .modal-actions {
        flex-direction: column;
        gap: 1rem;

        button {
            width: 100%;
        }
    }
}
</style>