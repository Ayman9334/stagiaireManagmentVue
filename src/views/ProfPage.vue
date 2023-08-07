<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '../config/axiosConfig'
import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();

const professeurs = ref([])
const stgrInf = ref([]);
const matieres = ref([]);
const errors = ref({});
const method = ref();
const methodId = ref();

const nom = ref();
const prenom = ref();
const adresse = ref();
const stgrSelectionne = ref([]);
const matiereSelectionne = ref();

onMounted(() => {
    axiosClient.get('/professeur').then(({ data }) => {
        professeurs.value = data
    });
    axiosClient.get('/stagiaire/JoinInfo').then(({ data }) => {
        stgrInf.value = data
    });
    axiosClient.get('/matiere').then(({ data }) => {
        matieres.value = data
    })
})

const stgrfList = (stgr) => stgr.map((stgr) => stgr.nom).join(',')

const errorRestar = () => {
    const elementsWithInvalidClass = document.querySelectorAll('.is-invalid');
    elementsWithInvalidClass.forEach((element) => {
        element.classList.remove('is-invalid');
    });
    errors.value = {}
}

const reqFacory = (meth /* method */, data = {}) => {
    errorRestar()

    nom.value = data.nom ?? null
    prenom.value = data.prenom ?? null
    adresse.value = data.adresse ?? null
    stgrSelectionne.value = data.liste_des_elevesInfo?.map(x => x.id) ?? []
    matiereSelectionne.value = data.matiereInfo?.id ?? null

    method.value = meth
    if (meth == 'modifier') {
        methodId.value = data.id
    }
}

const genererReq = () => ({ //generate reuest
    nom: nom.value,
    prenom: prenom.value,
    adresse: adresse.value,
    stagiaires_ids: stgrSelectionne.value,
    matiereId: matiereSelectionne.value
})

const creeProf = () => {
    errorRestar()
    const req = genererReq()

    axiosClient.post('/professeur', req)
        .then(() => {
            axiosClient.get('/professeur').then(({ data }) => { professeurs.value = data });
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

const modifierProf = () => {
    errorRestar()
    const req = genererReq()

    axiosClient.put(`/professeur/${methodId.value}`, req)
        .then(() => {
            axiosClient.get('/professeur').then(({ data }) => { professeurs.value = data });
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

const suprimerProf = (id) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Voulez-vous supprimer cet enregistrement?',
        icon: 'far fa-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {
            axiosClient.delete(`/professeur/${id}`)
                .then(() => {
                    axiosClient.get('/professeur').then(({ data }) => { professeurs.value = data });
                })
        }
    })
}

const desctiverProf = (id) => {
    axiosClient.get(`/professeur/desactiver/${id}`)
        .then(() => {
            axiosClient.get('/professeur').then(({ data }) => { professeurs.value = data });
        })
}
</script>

<template>
    <section class="professeur p-3">
        <!-- creation form -->
        <div class="modal fade" id="prof-form" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                <label for="nom">Nom : <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="nom" v-model="nom">
                            </div>
                            <div>
                                <label for="prenom">Prénom :</label>
                                <input type="text" class="form-control" id="prenom" v-model="prenom">
                            </div>
                            <div>
                                <label for="adresse">Adresse :</label>
                                <input type="text" class="form-control" id="adresse" v-model="adresse">
                            </div>
                            <div>
                                <label for="stagiaires">Eleves :</label>
                                <MultiSelect v-model="stgrSelectionne" :options="stgrInf" optionLabel="nom" optionValue="id"
                                    class="form-control w-full md:w-20rem" />
                            </div>
                            <div>
                                <label for="matiere">Matiere : <span class="text-danger">*</span></label>
                                <Dropdown v-model="matiereSelectionne" :options="matieres" optionLabel="libelle"
                                    optionValue="id" class="form-control w-full md:w-14rem" />
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            id="close-creation-modal">Exit</button>
                        <button v-if="method == 'cree'" type="button" class="btn btn-success"
                            @click="creeProf">Cree</button>
                        <button v-if="method == 'modifier'" type="button" class="btn btn-success"
                            @click="modifierProf">Modifier</button>
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
                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#prof-form"
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
                        <th scope="col">Nom</th>
                        <th scope="col">Prénom</th>
                        <th scope="col">Adresse</th>
                        <th scope="col">Eleves</th>
                        <th scope="col">Matiere</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(professeur, key) in professeurs" :key="key">
                        <td>{{ professeur.numero }}</td>
                        <td>{{ professeur.nom }}</td>
                        <td>{{ professeur.prenom }}</td>
                        <td>{{ professeur.adresse }}</td>
                        <td>{{ stgrfList(professeur.liste_des_elevesInfo) }}</td>
                        <td>{{ professeur.matiereInfo.libelle }}</td>
                        <td>
                            <ConfirmPopup></ConfirmPopup>
                            <button class="btn btn-danger me-1" @click="suprimerProf(professeur.id)">
                                <i class="far fa-trash"></i>
                            </button>
                            <button class="btn btn-info me-1 text-white" @click="desctiverProf(professeur.id)">
                                <i class="fas fa-eye-slash"></i>
                            </button>
                            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#prof-form"
                                @click="reqFacory('modifier', professeur)">
                                <i class="fal fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style scoped></style>