<template>
  <van-config-provider :theme-vars="themeVars" theme-vars-scope="global">
  <RouterView />
  </van-config-provider>
</template>

<script setup>
import { reactive } from 'vue';

const themeVars = reactive({
  fontSizeXs: '14px',
  fontSizeSm: '16px',
  fontSizeMd: '18px',
  fontSizeLg: '20px',
  calendarInfoFontSize: '10px',
});
</script>

<style>
.van-field__control {
  font-size: 16px;
}

.short-desc {
  margin: 2px;
  color: gray;
  font-size: .75rem;
  line-height: 1rem;
}


</style>
