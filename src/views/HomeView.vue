<script setup lang="ts">
import { ref } from 'vue';
import {RouteName} from "@/router/RouteNames";
import { useRouter} from "vue-router";

const router = useRouter();

const isNotSundayModalShown = ref(false);

function startSession() {
  const date = new Date();
  const isSunday = date.getDay() === 0;

  if (isSunday) {
    router.push({ name: RouteName.PERSON_LIST })
  } else {
    isNotSundayModalShown.value = true;
  }
}
</script>

<template>
  <main>
    <van-nav-bar
      title="Le Portier" />

    <van-space direction="vertical" fill>
      <van-button type="primary" block @click="startSession()">Démarrer une session</van-button>
    </van-space>

    <br />

    <van-space direction="vertical" fill>
      <van-button type="default" block @click="router.push({ name : RouteName.STATS })">Statistiques</van-button>
    </van-space>

    <van-popup v-model:show="isNotSundayModalShown" :style="{ padding: '32px' }">
      <p>Nous ne sommes pas un dimanche. Voulez vous saisir les informations d'un culte précédent ?</p>

      <van-space direction="vertical" fill>
        <van-col span="24"><van-button type="primary" block @click="router.push({ name : RouteName.DATE_PICKING })">Oui</van-button></van-col>

        <van-col span="24"><van-button type="default" block @click="isNotSundayModalShown = false">Non</van-button></van-col>
      </van-space>


    </van-popup>
  </main>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
