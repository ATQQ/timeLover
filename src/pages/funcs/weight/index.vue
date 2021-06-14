<template>
  <div>
    <van-nav-bar
      title="体重记录"
      @click-left="handleBack"
      @click-right="handleAddPeople"
      left-text="返回"
      left-arrow
    >
      <template #right>
        <van-icon name="plus" size="18" />
      </template>
    </van-nav-bar>
    <!-- 选人 -->
    <header>
      <van-dropdown-menu :active-color="themeColor">
        <van-dropdown-item v-model="state.people" :options="peopleOption" />
      </van-dropdown-menu>
    </header>
    <!-- 添加记录 -->
    <div class="add-record" @click="handleAddRecord">
      <van-icon name="plus" size="20" />
    </div>
    <!-- 添加家人弹窗 -->
    <van-dialog
      v-model:show="showAddPeople"
      title="添加家人"
      :confirm-button-color="themeColor"
      show-cancel-button
      @open="onOpenPeoplDialog"
      @confirm="handleSurePeople"
    >
      <div class="people-dialog">
        <UnderInput
          v-model="newPoepleName"
          placeholder="昵称"
          tips="输入要记录的家人昵称"
          icon="manager-o"
        />
      </div>
    </van-dialog>
    <!-- 添加记录弹窗 -->
    <van-dialog
      v-model:show="showAddRecord"
      title="录入记录"
      confirm-button-color="#1989fa"
      show-cancel-button
      @confirm="handleSureRecord"
    >
      <div class="record-dialog">
        <van-field
          v-model="state.date"
          readonly
          clickable
          name="calendar"
          label="日期"
          placeholder="点击选择日期"
          @click="state.showCalendar = true"
        />
        <van-field
          v-model="state.time"
          readonly
          clickable
          name="datetimePicker"
          label="时间"
          placeholder="点击选择时间"
          @click="state.showTime = true"
        />
        <van-field
          v-model="state.weight"
          clickable
          type="number"
          name="weight"
          label="体重(公斤)"
          placeholder="点击设置体重"
        />
      </div>
    </van-dialog>
    <!-- 时间 -->
    <van-popup v-model:show="state.showTime" position="bottom">
      <van-datetime-picker
        v-model="state.time"
        type="time"
        @confirm="handleSureTime"
        @cancel="state.showTime = false"
      />
    </van-popup>
    <!-- 日历 -->
    <van-calendar
      :min-date="minDate"
      :max-date="maxDate"
      :color="themeColor"
      v-model:show="state.showCalendar"
      @confirm="handleSureDate"
    />
  </div>
</template>
<script setup lang="ts">
import UnderInput from '@/components/UnderInput.vue'
import { formatDate } from '@/utils/stringUtil'
import { Toast } from 'vant'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const themeColor = ref('#1989fa')

const router = useRouter()
const handleBack = () => {
  router.back()
}
const state = reactive({
  people: 0,
  showTime: false,
  time: '',
  showCalendar: false,
  date: '',
  weight: 0,
})
const peopleOption = reactive([{ text: '默认', value: 0 }])

// 添加家人相关
const newPoepleName = ref('')
const showAddPeople = ref(false)
const handleAddPeople = () => {
  showAddPeople.value = true
}
const onOpenPeoplDialog = () => {
  newPoepleName.value = ''
}
const handleSurePeople = () => {
  if (!newPoepleName.value) {
    return
  }
  // 临时写法
  peopleOption.push({
    text: newPoepleName.value,
    value: peopleOption.length + 1,
  })
  showAddPeople.value = false
  Toast.success('添加成功')
  // TODO: 调用接口
}

// 添加记录相关
const showAddRecord = ref(false)
const handleAddRecord = () => {
  // 展示当前时间
  const now = new Date()
  state.date = formatDate(now, 'yyyy/MM/dd')
  state.time = formatDate(now, 'hh:mm')
  // 展示最近一次的记录
  showAddRecord.value = true
}

// 时间选择
const handleSureTime = (time: string) => {
  state.time = time
  state.showTime = false
}
// 日期选择:前1周
const now = new Date()
const minDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7)
const maxDate = now
const handleSureDate = (date: Date) => {
  state.date = formatDate(date, 'yyyy/MM/dd')
  state.showCalendar = false
}

const handleSureRecord = () => {
  const date = new Date(`${state.date} ${state.time}`)
  const weight = +state.weight
  if (!weight || weight <= 0) {
    return
  }

  console.log(date, weight)
}
</script>

<style lang="scss" scoped>
.people-dialog {
  padding: 1rem;
}
.add-record {
  position: fixed;
  right: 2rem;
  bottom: 2.5rem;
  width: 3rem;
  height: 3rem;
  color: #fff;
  background-color: v-bind(themeColor);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.record-dialog {
  padding: 1rem 0;
}
</style>
