<script setup>
//import type { Ref } from 'vue';
import {computed, onMounted, ref, watch} from "vue";
import { useRouter, useRoute } from 'vue-router';
import { supabase } from "@/utils/supabase";
//import type { Person } from "@/types/Person";
import {showConfirmDialog, showNotify} from "vant";
import { usePerson } from '@/composables/usePerson';
import {APP} from "@/constants/config.js";

const { personList, getPersons } = usePerson();

const router = useRouter();
const route = useRoute();

//const personList/*: Ref<Person[]>*/ = ref([])
const currentOfficeId = route.query.officeId;
const showAddPersonForm = ref(false);
const first_name = ref('');
const last_name = ref('');
const short_desc = ref('');

// filters
const is_baby = ref(false);
const is_child = ref(false);
const is_member = ref(false);
const is_casual = ref(false);
const isFiltersModalShown = ref(false);

const needle = ref('');
const selectedPersonId = ref();

// filter sync
watch(is_child, (val) => {
  if (val) {
    is_baby.value = false;
  }
})

watch(is_baby, (val) => {
  if (val) {
    is_child.value = false;
  }
})

watch(is_member, (val) => {
  if (val) {
    is_casual.value = false;
  }
})

watch(is_casual, (val) => {
  if (val) {
    is_member.value = false;
  }
})

const FILTERS = {
  is_baby: 'bébés',
  is_child: 'enfants',
  is_member: 'members',
  is_casual: 'visiteurs',
}

const currentFilter = ref('');

function toggleFilter(filterName) {
  if (currentFilter.value === filterName) {
    currentFilter.value = ''
  } else {
    currentFilter.value = filterName
  }
}

onMounted(() => {
  getPersons()
})

const anchorList = computed(() => {
  if (filteredPersonList.value.length > 0) {
    return [...new Set(filteredPersonList.value.map((person) => person.last_name !== '' ? person.last_name.substring(0, 1) : ''))];
  }

  return ['']
});

const filteredPersonListByUserFilter = computed(() => {
  if (currentFilter.value === '') {
    return personList.value;
  }

  return personList.value.filter(person => person[currentFilter.value]);
})

const filteredPersonList = computed(() => {
  const set2 = new Set(filteredPersonListByName.value);
  return filteredPersonListByUserFilter.value.filter(person => set2.has(person));
})

const filteredPersonListByName = computed(() => {
  if (needle.value === '') {
    return personList.value;
  }

  return personList.value.filter((person) => {
    return person.first_name.toLowerCase().includes(needle.value.toLowerCase())
        || person.last_name.toLowerCase().includes(needle.value.toLowerCase());
  });
})

const selectedPersonInfos = computed(() => {
  return personList.value.find((person) => person.id === selectedPersonId.value)
})

const showBottom = ref(false);
const isRecordingPersonAsPresent = ref(false);
const recordingPersonId = ref(null);

async function markPersonAsPresent(personId/*: string*/) {
  recordingPersonId.value = personId;
  isRecordingPersonAsPresent.value = true;
  const isRegistered = await isVisitorAlreadyRegistered(personId);
  if (!isRegistered) {
    const {error} = await supabase
        .from('person_office')
        .insert({person_id: personId, office_id: currentOfficeId});

    isRecordingPersonAsPresent.value = false;
    recordingPersonId.value = null;
    showBottom.value = false;
  }
}

function removePersonAsPresent(personId/*: string*/) {
  console.log(personId);
  showConfirmDialog({
    title: 'Title',
    message: "Êtes vous sûr d'annuler l'enregistrement ?",
    cancelButtonText: "Annuler",
    confirmButtonText: "Confirmer"
  })
  .then(async () => {
    const {error} = await supabase
        .from('person_office')
        .delete()
        .eq('person_id', personId)
        .eq('person_id', personId)
        .eq('office_id', currentOfficeId);

    await getPersons();
  })
  .catch(() => {
    // do nothing
  });
}

async function isVisitorAlreadyRegistered(personId) {
  const { data } = await supabase
      .from('person_office')
      .select('person_id')
      .eq('person_id', personId)
      .eq('office_id', currentOfficeId)
  return data && data.length > 0;
}

async function addPerson(firstname, lastname) {
  showAddPersonForm.value = true;
  /*const { error } = await supabase
      .from('visitor')
      .insert({ first_name: 'test', last_name: 'test' });

  await getPersons();*/
}

function showFilters() {
  isFiltersModalShown.value = true;
}

async function addPersonToList(values) {
  const { data } = await supabase
      .from('person')
      .insert({
        first_name: values.first_name,
        last_name: values.last_name,
        is_baby: values.is_baby,
        is_child: values.is_child
      })
      .select();

  return data?.[0];
}

async function onAddVisitor(values) {
  const person = await addPersonToList(values);
  await markPersonAsPresent(person?.id);
  await getPersons();

  showAddPersonForm.value = false;


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
        <van-button icon="plus" size="small" plain type="primary" @click="addPerson()">
          Visiteur
        </van-button>
      </template>
    </van-nav-bar>

    <div class="filters-wrapper">
      <van-button icon="filter-o" hairline size="small" round :plain="currentFilter !== 'is_baby'" type="primary" @click="toggleFilter('is_baby')">
        Bébés
      </van-button>
      <van-button icon="filter-o" hairline size="small" round :plain="currentFilter !== 'is_child'" type="primary" @click="toggleFilter('is_child')">
        Enfants
      </van-button>
      <van-button icon="filter-o" hairline size="small" round :plain="currentFilter !== 'is_member'" type="primary" @click="toggleFilter('is_member')">
        Membres
      </van-button>
      <van-button icon="filter-o" hairline size="small" round :plain="currentFilter !== 'is_casual'" type="primary" @click="toggleFilter('is_casual')">
        Visiteurs
      </van-button>
    </div>

    <van-search
      v-model="needle"
      placeholder="Rechercher une personne"
    />
  </van-sticky>


  <template v-if="personList.length > 0">


      <template v-for="person in filteredPersonList" :key="person.id">

          <van-cell>
            <template #title>
              <span>{{ person.last_name }} {{ person.first_name }}</span>
              <span><van-icon name="medal-o" color="goldenrod" v-if="person.is_member"></van-icon></span>
              <span><van-icon name="baby" color="pink" v-if="person.is_baby"></van-icon></span>
              <span v-if="person.is_casual"> 🕶️</span>
              <p class="short-desc">{{ person.short_desc }}</p>
            </template>

            <template v-if="person.person_office.find(({office_id}) => office_id === currentOfficeId)">
              <van-icon name="passed" size="30" color="green" @click="removePersonAsPresent(person.id)" />
            </template>

            <van-button
                v-else
                type="primary"
                plain
                :loading="isRecordingPersonAsPresent && person.id === recordingPersonId"
                size="small"
                :disabled="isRecordingPersonAsPresent && person.id === recordingPersonId"
                loading-text="En cours"
                @click="markPersonAsPresent(person.id)">
              Enregistrer
            </van-button>
          </van-cell>
      </template>

  </template>

  <van-action-sheet v-model:show="showBottom" title="Enregistrer un visiteur" inset>
    <van-cell-group>
      <van-cell title="Nom" :value="selectedPersonInfos?.last_name" />
      <van-cell title="Prénom" :value="selectedPersonInfos?.first_name" />
      <van-cell v-if="selectedPersonInfos?.short_desc !== ''" title="Courte description" :value="selectedPersonInfos?.short_desc" />
    </van-cell-group>

    <br />

    <van-row justify="center">
      <van-col span="20">
        <van-button type="success"
                    block
                    @click="markPersonAsPresent(selectedPersonInfos.id)">
          Marquer comme présent pour ce culte
        </van-button>
      </van-col>
    </van-row>

    <br />

  </van-action-sheet>

  <van-action-sheet v-model:show="showAddPersonForm" cancel-text="Annuler">
    <div class="content">
      <van-form @submit="onAddVisitor">
        <van-cell-group inset>
          <van-field
              v-model="first_name"
              name="first_name"
              label="Prénom"
              placeholder="Jean"
              :rules="[{ required: true, message: 'Prénom est obligatoire' }]"
          />
          <van-field
              v-model="last_name"
              name="last_name"
              label="Nom"
              placeholder="Dupont"
          />
          <van-field
              v-model="short_desc"
              name="short_desc"
              type="textarea"
              label="Description"
              placeholder="Courte description de la personne"
              :rules="[{ required: false }]"
          />
          <van-field name="switch" label="Bébé">
            <template #input>
              <van-switch v-model="is_baby" />
            </template>
          </van-field>
          <van-field name="switch" label="Enfant">
            <template #input>
              <van-switch v-model="is_child" />
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            Ajouter {{ first_name }} {{ last_name }}
          </van-button>
        </div>
      </van-form>
    </div>
  </van-action-sheet>

  <van-action-sheet v-model:show="isFiltersModalShown" title="Filtrer la liste">
    <div class="content">
      <van-cell-group inset>
        <van-field name="switch" label="Les bébés (moins de 3 ans)">
          <template #input>
            <van-switch v-model="is_baby" />
          </template>
        </van-field>
        <van-field name="switch" label="Les enfants (entre 3 et 18 ans)">
          <template #input>
            <van-switch v-model="is_child" />
          </template>
        </van-field>
        <van-field name="switch" label="Les membres">
          <template #input>
            <van-switch v-model="is_member" />
          </template>
        </van-field>
        <van-field name="switch" label="Les visiteurs">
          <template #input>
            <van-switch v-model="is_casual" />
          </template>
        </van-field>
      </van-cell-group>
    </div>
  </van-action-sheet>

</template>

<style>
.filters-wrapper {
  display: flex;
  flex-direction: row;
  background: var(--van-search-background);
  padding: var(--van-search-padding);
  gap: 10px;
  overflow-x: scroll;

  button {
    font-size: var(--van-font-size-xs);
  }
}
</style>
