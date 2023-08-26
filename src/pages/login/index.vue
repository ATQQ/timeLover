<template>
  <div class="login">
    <h1>
      欢迎登录
      <span>
        <router-link to="/">时光恋人</router-link>
      </span>
    </h1>
    <div class="input-list">
      <UnderInput
        tips="未注册的手机号，将自动进行注册"
        v-model="phone"
        placeholder="输入11位手机号"
        icon="phone-o"
        :max-length="11"
      />
      <UnderInput tips="4位数字" v-model="code" placeholder="输入收到的验证码" icon="like-o" :max-length="4" />
    </div>
    <div class="btn-list">
      <van-button
        :disabled="disableCode"
        color="linear-gradient(120deg, #f093fb 0%, #f5576c 100%)"
        @click="getCode"
        block
        size="small"
        type="primary"
      >{{ codeText }}</van-button>
      <van-button
        :disabled="disableLogin"
        color="linear-gradient(120deg, #f093fb 0%, #f5576c 100%)"
        @click="handleLogin"
        block
        size="small"
        type="primary"
      >登录</van-button>
      <van-button
        color="linear-gradient(120deg, #f093fb 0%, #f5576c 100%)"
        @click="handleTestLogin"
        block
        size="small"
        type="primary"
      >使用测试号体验</van-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { showSuccessToast,showFailToast } from 'vant'
import { useRouter } from 'vue-router'
import UnderInput from '@/components/UnderInput.vue'
import { rCode, rMobile } from '@/utils/regexp'
import { userApi } from '@/apis'

const phone = ref('')
const code = ref('')
const codeText = ref('获取短信验证码')
const time = ref(0)

/**
 * 获取验证码
 */
const getCode = () => {
  if (time.value !== 0) {
    return
  }
  // 90s有效
  time.value = 90
  time.value -= 1
  codeText.value = `剩余${time.value}秒`

  const timer = setInterval(() => {
    if (time.value === 0) {
      clearInterval(timer)
      codeText.value = '获取验证码'
      return
    }
    time.value -= 1
    codeText.value = `剩余${time.value}秒`
  }, 1000)
  userApi
    .getCode(phone.value)
    .then((res) => {
      showSuccessToast('发送成功')
    })
    .catch((err) => {
      showFailToast(err.msg)
    })
}

const router = useRouter()

const handleLogin = () => {
  userApi
    .login(phone.value, code.value)
    .then((res) => {
      const { token } = res.data
      localStorage.setItem('token', token)
      // 发请求
      // 持久化登录凭证
      // 登陆成功跳转
      router.replace({
        name: 'dashboard',
      })
    })
    .catch(() => {
      showFailToast('验证码不对')
    })
}
// 禁用登录按钮
const disableLogin = computed(() => !rCode.test(code.value) || !rMobile.test(phone.value))

// 禁用验证码按钮
const disableCode = computed(() => !rMobile.test(phone.value) || time.value !== 0)

const handleTestLogin = () => {
  userApi.login('13245678910', '1234').then((res) => {
    const { token } = res.data
    localStorage.setItem('token', token)
    // 发请求
    // 持久化登录凭证
    // 登陆成功跳转
    router.replace({
      name: 'dashboard',
    })
  })
}

// token未过期，自动登录
onMounted(() => {
  if (localStorage.getItem('token')) {
    router.replace({
      name: 'dashboard',
    })
  }
})
</script>

<style lang="scss" scoped>
.login {
  padding: 3rem 1.5rem;
}

h1 {
  font-weight: lighter;
  font-size: 1.5rem;
  span,
  a {
    background-image: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
    color: transparent;
    -webkit-background-clip: text;
    margin-left: 0.5rem;
  }
}

.input-list {
  padding: 2rem 0 1rem 0;
}
.btn-list {
  padding: 0 1rem;
  .van-button {
    margin-bottom: 1rem;
  }
}
</style>
