<script setup>
import {computed, onMounted, ref, watch} from "vue";
import { useRouter, useRoute } from 'vue-router';
import { supabase } from "@/utils/supabase";
import {usePerson} from "@/composables/usePerson.js";
import {APP} from "@/constants/config.js";

const { personList, getPersons } = usePerson();

const router = useRouter();

onMounted(() => {
  getPersons();
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

const isEditFormShown = ref(false);
const first_name = ref('');
const last_name = ref('');
const is_baby = ref(false);
const is_child = ref(false);
const short_desc = ref('');
const is_member = ref(false);
const currentPersonId = ref('');
const nbOfOfficesAttendance = ref(0);


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

async function showEditForm(personId) {
  currentPersonId.value = personId;
  const { data } = await supabase.from('person')
      .select(`*, person_office (office_id)`).eq('id', personId);
  first_name.value = data[0].first_name;
  last_name.value = data[0].last_name;
  is_baby.value = data[0].is_baby;
  short_desc.value = data[0].short_desc;
  is_child.value = data[0].is_child;
  is_member.value = data[0].is_member;
  nbOfOfficesAttendance.value = data[0].person_office.length;

  isEditFormShown.value = true;
}

async function onEditPerson(person) {
  const { data } = await supabase.from('person')
      .update({
        first_name: person.first_name,
        last_name: person.last_name,
        is_baby: person.is_baby,
        short_desc: person.short_desc,
        is_child: person.is_child,
        is_member: person.is_member
      }).eq('id', currentPersonId.value);

  await getPersons();
  isEditFormShown.value = false;
  showSuccessToast('Enregistrement réussi.');
}

</script>

<template>
  <van-nav-bar
      left-text="Accueil"
      left-arrow
      @click-left="router.push({ name: 'home' })"
      :title="`${APP.NAME} - edition`">
  </van-nav-bar>

  <van-sticky>
    <van-search
        v-model="needle"
        placeholder="Rechercher une personne"
    />
  </van-sticky>


    <template v-if="personList.length > 0">
        <template v-for="person in filteredPersonList" :key="person.id">
            <van-cell is-link @click="showEditForm(person.id)">
              <template #title>
                <span>{{ person.last_name }} {{ person.first_name }}</span>
                <span><van-icon name="medal-o" color="goldenrod" v-if="person.is_member"></van-icon></span>
              </template>
            </van-cell>
          </template>
      </template>


  <van-action-sheet v-model:show="isEditFormShown">
    <van-form @submit="onEditPerson">
      <van-cell-group inset>
        <van-field
            v-model="first_name"
            name="first_name"
            label="Prénom"
            placeholder=""
            :rules="[{ required: true, message: 'Le prénom est obligatoire' }]"
        />
        <van-field
            v-model="last_name"
            name="last_name"
            label="Nom"
            placeholder=""
        />
        <van-field name="is_baby" label="Bébé">
          <template #input>
            <van-switch v-model="is_baby" />
          </template>
        </van-field>
        <van-field name="is_child" label="Enfant (3ans+)">
          <template #input>
            <van-switch v-model="is_child" />
          </template>
        </van-field>
        <van-field name="is_member" label="Membre">
          <template #input>
            <van-switch v-model="is_member" />
          </template>
        </van-field>
        <van-cell>
          A participer à {{ nbOfOfficesAttendance }} cultes
        </van-cell>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" >
          Enregistrer
        </van-button>
      </div>
    </van-form>
  </van-action-sheet>

</template>
