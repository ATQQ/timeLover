<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';

export default defineComponent({
  name: 'App',
})
</script>

<style>
* {
  margin: 0;
  /* padding: 0; */
}
@media screen and (min-width: 320px) {
  html {
    font-size: 12px;
  }
}
@media screen and (min-width: 360px) {
  html {
    font-size: 13.5px;
  }
}
@media screen and (min-width: 375px) {
  html {
    font-size: 14.0625px;
  }
}
</style>
<style scoped>
.app {
  max-width: 414px;
  margin: 0 auto;
}
</style>
