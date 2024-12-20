<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from 'vue-router';

import {showConfirmDialog} from "vant";
import {usePerson} from '@/composables/usePerson';
import {APP} from "@/constants/config.js";
import FiltersList from "@/components/FiltersList.vue";
import {useFilters} from "@/composables/useFilters.js";
import { usePersonOffice } from "@/composables/usePersonOffice.js";
import {focusOnElement, highlightElement} from "@/utils/dom.js";
import PersonForm from "@/components/PersonForm.vue";

const { personList, getPersons, addPerson } = usePerson()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  getPersons()
})

const currentOfficeId = route.query.officeId

const showAddPersonForm = ref(false);
const { registerPersonForOffice, removePersonFromOffice } = usePersonOffice();

const needle = ref('');

const { currentFilter } = useFilters();
const filteredByUserPersonList = computed(() => {
  if (currentFilter.value === '') {
    return personList.value;
  }

  return personList.value.filter(person => person[currentFilter.value]);
})

const filteredPersonList = computed(() => {
  const uniqFilteredByNamePersonList = new Set(filteredByNamePersonList.value);
  return filteredByUserPersonList.value.filter(person => uniqFilteredByNamePersonList.has(person));
})

const filteredByNamePersonList = computed(() => {
  if (needle.value === '') {
    return personList.value
  }

  return personList.value.filter((person) => {
    return person.first_name.toLowerCase().includes(needle.value.toLowerCase())
        || person.last_name.toLowerCase().includes(needle.value.toLowerCase());
  });
})

const isRecordingPersonAsPresent = ref(false)
const recordingPersonId = ref(null)

async function onRegisterPerson(personId) {
  recordingPersonId.value = personId;
  isRecordingPersonAsPresent.value = true;

  await registerPersonForOffice(personId, currentOfficeId);
  await getPersons();

  recordingPersonId.value = null
  isRecordingPersonAsPresent.value = false
}

function confirmRemovalOfPersonFromOffice(personId) {
  showConfirmDialog({
    title: 'Annulation',
    message: "Êtes vous sûr d'annuler l'enregistrement ?",
    cancelButtonText: "Annuler",
    confirmButtonText: "Confirmer"
  })
  .then(async () => {
    await removePersonFromOffice(personId, currentOfficeId)
    await getPersons();
  })
  .catch(() => {
    // do nothing
  });
}

function onAddPerson() {
  showAddPersonForm.value = true
}

async function addPersonToOffice(person) {
  const addedPerson = await addPerson(person)
  await registerPersonForOffice(addedPerson?.id, currentOfficeId)
  await getPersons()

  showAddPersonForm.value = false
  focusOnElement(addedPerson?.id)
  highlightElement(addedPerson?.id)
}
</script>

<template>
  <van-sticky>
    <van-nav-bar
        left-text="Accueil"
        left-arrow
        @click-left="router.push({ name: 'home' })"
        :title="APP.NAME">
      <template #right>
        <van-button icon="plus" size="small" plain type="primary" @click="onAddPerson()">
          Visiteur
        </van-button>
      </template>
    </van-nav-bar>

    <FiltersList/>

    <van-search
      v-model="needle"
      placeholder="Rechercher une personne"
    />
  </van-sticky>

  <template v-if="personList.length > 0">
    <template v-for="person in filteredPersonList" :key="person.id">
      <van-cell :id="person.id">
        <template #title>
          <span>{{ person.last_name }} {{ person.first_name }}</span>
          <span><van-icon name="medal-o" color="goldenrod" v-if="person.is_member"></van-icon></span>
          <span><van-icon name="baby" color="pink" v-if="person.is_baby"></van-icon></span>
          <span v-if="person.is_casual"> 🕶️</span>
          <p class="short-desc">{{ person.short_desc }}</p>
        </template>

        <van-icon
          v-if="person.person_office.find(({office_id}) => office_id === currentOfficeId)"
          name="passed" size="30" color="green" @click="confirmRemovalOfPersonFromOffice(person.id)" />
        <van-button
            v-else
            type="primary"
            plain
            :loading="isRecordingPersonAsPresent && person.id === recordingPersonId"
            size="small"
            :disabled="isRecordingPersonAsPresent && person.id === recordingPersonId"
            loading-text="En cours"
            @click="onRegisterPerson(person.id)">
          Enregistrer
        </van-button>
      </van-cell>
    </template>
  </template>

  <PersonForm
      v-model="showAddPersonForm"
      @person-edited="addPersonToOffice"
  />
</template>

<style>
.glow {
  animation: glow 0.75s 3;
}

@keyframes glow {
  0% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5) inset;
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8) inset,
    0 0 20px rgba(255, 215, 0, 0.6) inset,
    0 0 25px rgba(255, 215, 0, 0.4) inset;
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5) inset;
  }
}
</style>
