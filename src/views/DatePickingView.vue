<script setup>
import {computed, ref} from 'vue';
import { useRouter } from 'vue-router';
import {RouteName} from "@/router/RouteNames";
import {supabase} from "@/utils/supabase";

const router = useRouter()
const today = new Date();
const currentDate = ref([today.getUTCFullYear(), today.getUTCMonth() + 1, today.getDate()]);

const selectedDay = computed(() => {
  const d = new Date(Number(currentDate.value[0]), Number(currentDate.value[1])-1, Number(currentDate.value[2]));
  return d.getDay();
})

const selectedDate = computed(() => {
  const d = new Date(Number(currentDate.value[0]), Number(currentDate.value[1])-1, Number(currentDate.value[2]));
  return d.toLocaleDateString('fr-Fr', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
})

const filter = (type, options) => {
  return options;
};

const btnLabel = computed(() => {
  return selectedDay.value !== 0 ? 'Choisissez un dimanche' : `Choisir le ${selectedDate.value}`
})

async function selectSunday() {
  const officeId = await getOfficeByDate(currentDate.value.join('-'))
  if (officeId !== '') {
    router.push({ name: RouteName.PERSON_LIST, query: { officeId } })
  }
}

async function createNewOfficeWithDate(date/*: string*/) {
  const { error } = await supabase
      .from('office')
      .insert({ date })
}

async function getOfficeByDate(date/*:string*/) {
  const { data } = await supabase.from('office').select('id').eq('date', date);
  if (data) {
    if (data.length > 0) {
      return data[0].id;
    } else {
      await createNewOfficeWithDate(date)
      return ''
    }
  } else {
    alert('Nous avons tenté de récupéré le culte de cette date mais sans succès.');
    return '';
  }
}

</script>

<template>
  <van-nav-bar
      left-text="Accueil"
      left-arrow
      @click-left="router.push({ name: 'home' })"
      title="Le Portier" />

  <van-date-picker
    v-model="currentDate"
    :confirm-button-text="''"
    :cancel-button-text="''"
    title="Choisissez un dimanche"
    :filter="filter"
    :max-date="today"
  />

  <van-space direction="horizontal" fill>
    <van-button :disabled="selectedDay !== 0" type="primary" @click="selectSunday()">
      {{ btnLabel }}
    </van-button>
  </van-space>
</template>
