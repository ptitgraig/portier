<script setup>
import {computed, onMounted, ref, watch} from "vue";
import { useRouter, useRoute } from 'vue-router';
import { supabase } from "@/utils/supabase";
import {usePerson} from "@/composables/usePerson.js";
import {APP} from "@/constants/config.js";
import PersonForm from "@/components/PersonForm.vue";

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
const first_name = defineModel('first_name');
const last_name = defineModel('last_name');
const is_baby = defineModel('is_baby');
const is_child = defineModel('is_child');
const short_desc = defineModel('short_desc');
const is_member = defineModel('is_member');
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
            <p v-if="person.is_baby" class="short-desc">Bébé</p>
            <p v-if="person.short_desc" class="short-desc">{{ person.short_desc }}</p>
          </template>
        </van-cell>
      </template>
  </template>

  <PersonForm
      v-model:show="isEditFormShown" @person-edited="onEditPerson"
      v-model:first_name="first_name"
      v-model:last_name="last_name"
      v-model:is_child="is_child"
      v-model:is_baby="is_baby"
      v-model:short_desc="short_desc"
  />

</template>
