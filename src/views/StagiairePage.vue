<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '../config/axiosConfig'

const stagiaires = ref([])
const profInf = ref([]);
const etablissements = ref([]);
const errors = ref({});
const method = ref();
const methodId = ref();

const nom = ref();
const prenom = ref();
const date_de_naissance = ref();
const adresse = ref();
const profSelectionne = ref([]);
const etablissementSelectionne = ref();
const login = ref();
const mot_de_passe = ref();

onMounted(() => {
  axiosClient.get('/stagiaire').then(({ data }) => {
    stagiaires.value = data
  });
  axiosClient.get('/professeur/JoinInfo').then(({ data }) => {
    profInf.value = data
  });
  axiosClient.get('/etablissement').then(({ data }) => {
    etablissements.value = data
  })
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

  nom.value = data.nom ?? null
  prenom.value = data.prenom ?? null
  date_de_naissance.value = data.date_de_naissance ?? null
  adresse.value = data.adresse ?? null
  profSelectionne.value = data.liste_des_professeursInfo?.map(x => x.id) ?? []
  etablissementSelectionne.value = data.etablissementInfo?.id ?? null
  login.value = data.login ?? null
  mot_de_passe.value = data.mot_de_passe ?? null

  method.value = meth
  if (meth == 'modifier') {
    methodId.value = data.id
  }
}

const genererReq = () => ({ //generate reuest
  nom: nom.value,
  prenom: prenom.value,
  date_de_naissance: date_de_naissance.value,
  adresse: adresse.value,
  etablissementId: etablissementSelectionne.value,
  professeursIds: profSelectionne.value,
  login: login.value,
  mot_de_passe: mot_de_passe.value
})

const creeStgiaire = () => {
  errorRestar()
  const req = genererReq()
  console.log(req)
  axiosClient.post('/stagiaire', req)
    .then(() => {
      axiosClient.get('/stagiaire').then(({ data }) => { stagiaires.value = data });
      const button = document.getElementById('close-creation-modal');
      button.click();
    }).catch(({ response }) => {
      if (response.status) {
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

const modifierStgiaire = () => {
  errorRestar()
  const req = genererReq()

  axiosClient.put(`/stagiaire/${methodId.value}`, req)
    .then(() => {
      axiosClient.get('/stagiaire').then(({ data }) => { stagiaires.value = data });
      const button = document.getElementById('close-creation-modal');
      button.click();
    })
    .catch(({ response }) => {
      if (response.status == 400) {
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

const suprimerStgiaire = (id) => {
  axiosClient.delete(`/stagiaire/${id}`)
    .then(() => {
      axiosClient.get('/stagiaire').then(({ data }) => { stagiaires.value = data });
    })
}

const desctiverStgiaire = (id) => {
  axiosClient.get(`/stagiaire/desactiver/${id}`)
    .then(() => {
      axiosClient.get('/stagiaire').then(({ data }) => { stagiaires.value = data });
    })
}

</script>

<template>
  <section class="stagiaire p-3">
    <!-- creation form -->
    <div class="modal fade" id="stgr-form" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

          <div class="modal-header">
            <!-- <h1 class="modal-title fs-5" id="exampleModalLabel">Cree stagiaire</h1> -->
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-danger" v-show="Object.keys(errors).length">
              <div v-for="(error, key) in Object.values(errors)" :key="key">- {{ error }}</div>
            </div>
            <form class="row">
              <div>
                <label for="nom">Nom : <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="nom" required v-model="nom">
              </div>
              <div>
                <label for="prenom">Prénom :</label>
                <input type="text" class="form-control" id="prenom" v-model="prenom">
              </div>
              <div>
                <label for="date_de_naissance">Date de naissance : <span class="text-danger">*</span></label>
                <input type="date" class="form-control" id="date_de_naissance" v-model="date_de_naissance">
              </div>
              <div>
                <label for="adresse">Adresse :</label>
                <input type="text" class="form-control" id="adresse" v-model="adresse">
              </div>
              <div>
                <label for="prof">Professeur :</label>
                <MultiSelect v-model="profSelectionne" :options="profInf" optionLabel="nom" optionValue="id"
                  class="form-control w-full md:w-20rem" />
              </div>
              <div>
                <label for="etablissement">Etablissement :</label>
                <Dropdown v-model="etablissementSelectionne" showClear :options="etablissements" optionLabel="libelle"
                  optionValue="id" class="form-control w-full md:w-14rem" />
              </div>
              <div>
                <label for="login">Login :</label>
                <input type="text" class="form-control" id="login" v-model="login" required>
              </div>
              <div>
                <label for="mot_de_passe">Mot de passe :</label>
                <input type="password" class="form-control" id="mot_de_passe" v-model="mot_de_passe" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
              id="close-creation-modal">Exit</button>
            <button v-if="method == 'cree'" type="button" class="btn btn-success" @click="creeStgiaire">Cree</button>
            <button v-if="method == 'modifier'" type="button" class="btn btn-success"
              @click="modifierStgiaire">Modifier</button>
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
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#stgr-form" @click="reqFacory('cree')">
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
            <th scope="col">Date de naissance</th>
            <th scope="col">Age</th>
            <th scope="col">Adresse</th>
            <th scope="col">Professeur</th>
            <th scope="col">Etablissement</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(stagiaire, key) in stagiaires" :key="key">
            <td>{{ stagiaire.numero }}</td>
            <td>{{ stagiaire.nom }}</td>
            <td>{{ stagiaire.prenom }}</td>
            <td>{{ stagiaire.date_de_naissance }}</td>
            <td>{{ stagiaire.age }}</td>
            <td>{{ stagiaire.adresse }}</td>
            <td>{{ profList(stagiaire.liste_des_professeursInfo) }}</td>
            <td>{{ stagiaire.etablissementInfo.libelle }}</td>
            <td>
              <button class="btn btn-danger me-1" @click="suprimerStgiaire(stagiaire.id)">
                <i class="far fa-trash"></i>
              </button>
              <button class="btn btn-info me-1 text-white" @click="desctiverStgiaire(stagiaire.id)">
                <i class="fas fa-eye-slash"></i>
              </button>
              <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#stgr-form"
                @click="reqFacory('modifier', stagiaire)">
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
