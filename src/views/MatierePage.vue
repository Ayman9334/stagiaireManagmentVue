<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '../config/axiosConfig'
import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();

const matieres = ref([]);
const errors = ref({});
const method = ref();
const methodId = ref();

const libelle = ref();

onMounted(() => {
    axiosClient.get('/matiere').then(({ data }) => {
        matieres.value = data
    });
})

const profList = (profs) => profs.map((prof) => prof.nom).join(',')

const errorRestar = () => {
    const elementsWithInvalidClass = document.querySelectorAll('.is-invalid');
    elementsWithInvalidClass.forEach((element) => {
        element.classList.remove('is-invalid');
    });
    errors.value = {}
}

const reqFacory = (meth /* method */, data = {}) => {
    errorRestar()
    libelle.value = data.libelle ?? null
    method.value = meth
    if (meth == 'modifier') {
        methodId.value = data.id
    }
}

const genererReq = () => ({ //generate reuest
    libelle: libelle.value,
})

const creeMatiere = () => {
    errorRestar()
    const req = genererReq()

    axiosClient.post('/matiere', req)
        .then(() => {
            axiosClient.get('/matiere').then(({ data }) => { matieres.value = data });
            const button = document.getElementById('close-creation-modal');
            button.click();
        }).catch(({ response }) => {
            if (response && response.status == 400) {
                errors.value = response.data
                if (typeof errors.value == "string") {
                    errors.value = { 'message': errors.value }
                }
                const errorfields = Object.keys(errors.value)
                for (const errorfield of errorfields) {
                    const field = document.getElementById(errorfield)
                    if (field) {
                        field.classList.add("is-invalid")
                    }
                }
            }
        })
}

const modifierMatiere = () => {
    errorRestar()
    const req = genererReq()

    axiosClient.put(`/matiere/${methodId.value}`, req)
        .then(() => {
            axiosClient.get('/matiere').then(({ data }) => { matieres.value = data });
            const button = document.getElementById('close-creation-modal');
            button.click();
        })
        .catch(({ response }) => {
            if (response && response.status == 400) {
                errors.value = response.data
                if (typeof errors.value == "string") {
                    errors.value = { 'message': errors.value }
                }
                const errorfields = Object.keys(errors.value)
                for (const errorfield of errorfields) {
                    const field = document.getElementById(errorfield)
                    if (field) {
                        field.classList.add("is-invalid")
                    }
                }
            }
        })
}

const suprimerMatiere = (id) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Voulez-vous supprimer cet enregistrement?',
        icon: 'far fa-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {
            axiosClient.delete(`/matiere/${id}`)
                .then(() => {
                    axiosClient.get('/matiere').then(({ data }) => { matieres.value = data });
                })
        }
    })
}

const desctiverMatiere = (id) => {
    axiosClient.get(`/matiere/desactiver/${id}`)
        .then(() => {
            axiosClient.get('/matiere').then(({ data }) => { matieres.value = data });
        })
}
</script>

<template>
    <section class="professeur p-3">
        <!-- creation form -->
        <div class="modal fade" id="matiere-form" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger" v-show="Object.keys(errors).length">
                            <div v-for="(error, key) in Object.values(errors)" :key="key">- {{ error }}</div>
                        </div>
                        <form class="row">
                            <div>
                                <label for="libelle">Libellé : <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="libelle" v-model="libelle">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            id="close-creation-modal">Exit</button>
                        <button v-if="method == 'cree'" type="button" class="btn btn-success"
                            @click="creeMatiere">Cree</button>
                        <button v-if="method == 'modifier'" type="button" class="btn btn-success"
                            @click="modifierMatiere">Modifier</button>
                    </div>
                </div>
            </div>
        </div>
        <!------------------->
        <div class="w-100 my-3 d-flex bg-light p-2 border rounded justify-content-between align-items-center">
            <div>
                <h6>Action :</h6>
            </div>

            <div>
                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#matiere-form"
                    @click="reqFacory('cree')">
                    <i class="far fa-plus me-1"></i> Cree
                </button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Numero</th>
                        <th scope="col">Libellé</th>
                        <th scope="col">Professeures</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(matiere, key) in matieres" :key="key">
                        <td>{{ matiere.numero }}</td>
                        <td>{{ matiere.libelle }}</td>
                        <td>{{ profList(matiere.liste_des_profsInfo) }}</td>
                        <td>
                            <ConfirmPopup></ConfirmPopup>
                            <button class="btn btn-danger me-1" @click="suprimerMatiere(matiere.id)">
                                <i class="far fa-trash"></i>
                            </button>
                            <button class="btn btn-info me-1 text-white" @click="desctiverMatiere(matiere.id)">
                                <i class="fas fa-eye-slash"></i>
                            </button>
                            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#matiere-form"
                                @click="reqFacory('modifier', matiere)">
                                <i class="fal fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>