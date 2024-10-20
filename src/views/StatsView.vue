<script setup>
import { supabase } from "@/utils/supabase";
import {onMounted, ref} from "vue";
import { useRouter } from 'vue-router';
import {DATE_FORMAT} from "@/constants/date";
import {APP} from "@/constants/config.js";

const offices = ref([]);
const totalPersons = ref(0);
const activeName = ref('1');
const router = useRouter();

async function getStats() {
  const { data } = await supabase.from('office')
      .select(`id, date, person (first_name, last_name, is_member, is_baby, is_child)`)
  offices.value = data;
}

async function getCountPersons() {
  const { count } = await supabase.from('person')
      .select(`id`, {count : 'exact', 'head' : true})
  totalPersons.value = count;
}

onMounted(async () => {
  await getStats();
  await getCountPersons();
})
</script>
<template>
  <van-nav-bar
      left-text="Accueil"
      left-arrow
      @click-left="router.push({ name: 'home' })"
      :title="APP.NAME">
  </van-nav-bar>

  <van-cell-group>
    <van-cell title="Personnes dans la base" :value="totalPersons" />
  </van-cell-group>

  <van-collapse v-model="activeName" accordion>
    <van-collapse-item
      v-for="office in offices"
      :key="`key-${office.id}`"
      :title="`${new Date(office.date).toLocaleDateString('fr-Fr', DATE_FORMAT).toUpperCase()}`"
      :name="office.id">
      <p>Nombre total: {{ office.person.length }}</p>
      <p>Nombre de membres: {{ office.person.filter(({is_member}) => is_member).length }}</p>
      <p>Nombre de bébés: {{ office.person.filter(({is_baby}) => is_baby).length }}</p>
      <p>Nombre d'enfants: {{ office.person.filter(({is_child}) => is_child).length }}</p>
    </van-collapse-item>
  </van-collapse>
</template>
