<template>
  <div class="home">
    <h1 class="title">时光恋人</h1>
    <!-- 简介 -->
    <section class="introduce">
      <p v-for="(item, index) in introduces" :key="index">{{ item }}</p>
    </section>
    <section class="introduce">
      <p>
        <router-link to="/login">
          <van-button size="small" round :color="loginColor">点击体验</van-button>
        </router-link>
      </p>
    </section>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'

const introduces: string[] = reactive(['记录情侣之间', '日常生活趣事,生活足迹'])
const loginColor = 'linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%)'
</script>

<style lang="scss" scoped>
.home {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background-image: linear-gradient(to top, #f093fb 0%, #f5576c 100%);
  min-height: 100vh;
}
.title {
  color: aliceblue;
  text-align: center;
  font-weight: lighter;
  font-size: 4rem;
  padding-top: 22vh;
}
.introduce {
  padding: 0.5rem;
  color: aliceblue;
  text-align: center;
  p {
    margin-top: 10px;
  }
  a {
    color: aliceblue;
    font-weight: bold;
  }
}
footer {
  position: absolute;
  bottom: 1.5rem;
  left: 0;
  right: 0;
}
</style>
