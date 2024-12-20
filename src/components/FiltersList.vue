<template>
  <div class="filters-wrapper">
    <van-button icon="filter-o" hairline size="small" round :plain="currentFilter !== 'is_baby'" type="primary"
                @click="toggleFilter('is_baby')">
      Bébés
    </van-button>
    <van-button icon="filter-o" hairline size="small" round :plain="currentFilter !== 'is_child'" type="primary"
                @click="toggleFilter('is_child')">
      Enfants
    </van-button>
    <van-button icon="filter-o" hairline size="small" round :plain="currentFilter !== 'is_member'" type="primary"
                @click="toggleFilter('is_member')">
      Membres
    </van-button>
    <van-button icon="filter-o" hairline size="small" round :plain="currentFilter !== 'is_casual'" type="primary"
                @click="toggleFilter('is_casual')">
      Visiteurs
    </van-button>
  </div>
</template>
<script setup>
import {useFilters} from "@/composables/useFilters.js";

const { initFiltersSynchro, currentFilter, toggleFilter } = useFilters();
initFiltersSynchro();
</script>
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
