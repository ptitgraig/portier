<script setup>
//import type { Ref } from 'vue';
import {computed, onMounted, ref, watch} from "vue";
import { useRouter, useRoute } from 'vue-router';
import { supabase } from "@/utils/supabase";
//import type { Person } from "@/types/Person";
import { showNotify } from "vant";

const router = useRouter();
const route = useRoute();

const personList/*: Ref<Person[]>*/ = ref([])
const currentOfficeId = route.query.officeId;
const showAddPersonForm = ref(false);
const first_name = ref('');
const last_name = ref('');
const short_desc = ref('');
const is_baby = ref(false);
const is_child = ref(false);


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

async function getPersons() {
  const { data } = await supabase.from('person')
      .select(`*, person_office (office_id)`)
      .order('last_name', { ascending: true })
  personList.value = data
}

onMounted(() => {
  getPersons();
})

const anchorList = computed(() => {
  if (filteredPersonList.value.length > 0) {
    return [...new Set(filteredPersonList.value.map((person) => person.last_name !== '' ? person.last_name.substring(0, 1) : ''))];
  }

  return ['']
});

const filteredPersonList = computed(() => {
  if (needle.value === '' || personList.value.length === 0) {
    return personList.value;
  }

  return personList.value.filter((person) => {
    return person.first_name.toLowerCase().includes(needle.value.toLowerCase())
        || person.last_name.toLowerCase().includes(needle.value.toLowerCase());
  })
})

const needle = ref('');

const selectedPersonId = ref();

function onPersonClicked(id/*: string*/) {
  selectedPersonId.value = id;
  showBottom.value = !showBottom.value
}

const selectedPersonInfos = computed(() => {
  return personList.value.find((person) => person.id === selectedPersonId.value)
})

const showBottom = ref(false);

async function markPersonAsPresent(personId/*: string*/) {
  const isRegistered = await isVisitorAlreadyRegistered(personId);
  if (!isRegistered) {
    const { error } = await supabase
        .from('person_office')
        .insert({ person_id: personId, office_id: currentOfficeId });

    await getPersons();

    showNotify('Cette personne a bien été enregistrée pour ce culte');
    showBottom.value = false;
  } else {
    showNotify({type: 'danger', message: 'Cette personne a déjà été enregistrée pour ce culte.'});
  }
}

async function isVisitorAlreadyRegistered(personId) {
  const { data } = await supabase
      .from('person_office')
      .select('id')
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

async function onSubmit(values) {
  const { error } = await supabase
      .from('person')
      .insert({
        first_name: values.first_name,
        last_name: values.last_name,
        is_baby: values.is_baby,
        is_child: values.is_child
      });

  await getPersons();
  showAddPersonForm.value = false;
}


</script>

<template>
  <van-nav-bar
      left-text="Accueil"
      left-arrow
      @click-left="router.push({ name: 'home' })"
      title="Le Portier">
    <template #right>
      <van-button icon="plus" size="small" plain type="primary" @click="addPerson()">
        Visiteur
      </van-button>
    </template>
  </van-nav-bar>

  <van-search
    v-model="needle"
    placeholder="Rechercher un visiteur"
  />

  <van-index-bar>
    <template v-if="personList.length > 0">
      <template v-for="anchor in anchorList" :key="`key-${anchor}`">
        <van-index-anchor :index="anchor" />
        <template v-for="person in filteredPersonList" :key="person.id">
          <template v-if="person.last_name.substring(0, 1) === anchor">
            <van-cell icon="friends" :title="`${person.last_name} ${person.first_name}`" @click="onPersonClicked(person.id)">
              <template v-if="person.person_office.find(({office_id}) => office_id === currentOfficeId)">
                <van-icon name="checked" style="color:green;" />
              </template>

              <van-icon v-if="person.is_member" name="friends" style="color:blue;" />
            </van-cell>
          </template>
        </template>
      </template>
    </template>
  </van-index-bar>

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

  <van-action-sheet v-model:show="showAddPersonForm" title="Ajouter un visiteur" cancel-text="Annuler">
    <div class="content">
      <van-form @submit="onSubmit">
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
            Submit
          </van-button>
        </div>
      </van-form>
    </div>
  </van-action-sheet>

</template>
