<template>
  <div class="dashboard">
    <div class="card-list">
      <router-link to="/funs/weight" class="card-item">
        <FunCard title="体重记录" bg-color="#07c160" icon="icon-tizhongcheng" />
      </router-link>
      <div class="card-item">
        <FunCard title="相册" disabled icon="icon-zhaopian1" />
      </div>
      <div class="card-item">
        <FunCard title="大事记" disabled icon="icon-dashijianguanli" />
      </div>
      <div class="card-item">
        <FunCard title="敬请期待" icon="icon-gengduo" />
      </div>
    </div>
    <router-link to="/" class="go-home">
      <van-icon name="wap-home-o" />
    </router-link>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import FunCard from './components/FunCard.vue'
</script>

<style lang="scss" scoped>
.dashboard {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background-image: linear-gradient(to top, #f093fb 0%, #f5576c 100%);
  min-height: 100vh;
  padding: 1rem;
}

.card-list {
  padding-top: 20vh;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .card-item {
    width: 48%;
    margin-bottom: 1rem;
  }
}
.go-home {
  position: fixed;
  right: 2rem;
  bottom: 4rem;
  font-size: 2rem;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  text-align: center;
  padding-top: 0.2rem;
  background-color: #fff;
}
</style>
