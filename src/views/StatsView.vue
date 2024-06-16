<script setup>
import { supabase } from "@/utils/supabase";
import {onMounted, ref} from "vue";
import { useRouter } from 'vue-router';
import {DATE_FORMAT} from "@/constants/date";

const offices = ref([]);
const totalPersons = ref(0);
const activeName = ref('1');
const router = useRouter();

async function getStats() {
  const { data } = await supabase.from('office')
      .select(`id, date, person (first_name, last_name, is_member)`)
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
      title="Le Portier">
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
    </van-collapse-item>
  </van-collapse>
</template>
