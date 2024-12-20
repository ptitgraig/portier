<script setup>
import {ref, onMounted} from 'vue';
import { RouteName } from "@/router/RouteNames";
import { useRouter} from "vue-router";
import { useOffice } from '@/composables/useOffice';
import {getDateInDbFormat, getTodayAsOfficeDbFormat, TODAY} from "@/utils/date";
import {APP} from "@/constants/config.js";

const router = useRouter();

const {
  isTodayInOfficeRecords,
  todayOfficeId,
  getOffices,
  getOfficeIdByDate,
  createNewOfficeWithDate,
} = useOffice();

const isNotSundayModalShown = ref(false);

onMounted(async() => {
  await getOffices();
})

const selectedSunday = ref('');

async function startSession() {
  const date = new Date();
  const isSunday = date.getDay() === 0;

  if (isSunday) {
    if (!isTodayInOfficeRecords.value) {
      const today = getTodayAsOfficeDbFormat();
      const officeId = await createNewOfficeWithDate(today);
      await router.push({ name: RouteName.PERSON_LIST, query: { officeId } })
    } else {
      await router.push({ name: RouteName.PERSON_LIST, query: { officeId : todayOfficeId.value } })
    }
  } else {
    isNotSundayModalShown.value = true;
  }
}

function formatter(day) {
  if (day.date.getDay() !== 0) {
    day.type = "disabled"
  }
  return day;
}


async function onConfirmSunday(date) {
  isNotSundayModalShown.value = false;
  const formattedDate = getDateInDbFormat(date);
  const officeId = await getOfficeIdByDate(formattedDate);

  if (officeId !== '') {
    await router.push({ name: RouteName.PERSON_LIST, query: { officeId } })
  } else {
    const officeId = await createNewOfficeWithDate(formattedDate);
    await router.push({ name: RouteName.PERSON_LIST, query: { officeId } })
  }
}
</script>

<template>
  <main>
    <van-nav-bar
      :title="APP.NAME" />

    <van-row justify="center">
      <van-col span="10">
        <van-icon name="records-o" size="30vh" color="#eee" />
      </van-col>
    </van-row>

    <br/>

    <van-row justify="center" :gutter="[20, 20]">
      <van-col span="20">
        <van-space direction="vertical" fill>
          <van-button type="primary" block @click="startSession()" icon="fire">
            Démarrer une session
          </van-button>
        </van-space>
      </van-col>

      <van-col span="20">
        <van-space direction="vertical" fill>
          <van-button type="default" block @click="router.push({ name : RouteName.STATS })" icon="bar-chart-o">
            Statistiques
          </van-button>
        </van-space>
      </van-col>

      <van-col span="20">
        <van-space direction="vertical" fill>
          <van-button type="default" block @click="router.push({ name : RouteName.EDIT_PERSON })" icon="records-o">
            Gérer la liste des personnes
          </van-button>
        </van-space>
      </van-col>
    </van-row>

    <van-calendar
        v-model:show="isNotSundayModalShown"
        switch-mode="month"
        :max-date="new Date()"
        :value="selectedSunday"
        :formatter="formatter"
        @confirm="onConfirmSunday"
        :show-mark="false"
        first-day-of-week="1"
    >
      <template #title>
        Choisir un dimanche
      </template>
      <template #subtitle="{ date }">
        <template v-if="date">
          {{ date && date.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase() }} {{ date && date.getUTCFullYear() }}
        </template>
        <template v-else>
          {{ TODAY.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase() }} {{ TODAY.getUTCFullYear() }}
        </template>
      </template>

      <template #confirm-text>
        Confirmer
      </template>
    </van-calendar>
  </main>
</template>
