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
        <van-dropdown-item
          @change="handleSelectPeople"
          v-model="state.people"
          :options="peopleOption"
        />
      </van-dropdown-menu>
    </header>

    <van-empty v-if="weights.length === 0" description="没有记录，点击右下角 + 添加" />
    <main v-else>
      <!-- 最近一次的记录 -->
      <h2 class="current-time">{{ formatDate(weights[0].date) }}</h2>
      <h1 class="current-weight">{{ weights[0].weight }}<span>公斤</span></h1>
      <p class="rank" v-for="(t, idx) in overviewData" :key="idx">
        {{ t.text }}
        <span :class="t.symbol"></span>
        <span class="res">{{ t.res }}</span>
      </p>
      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
        体重记录
      </van-divider>
      <div class="weight-list">
        <van-swipe-cell v-for="(t, idx) in weights" :key="idx">
          <van-cell :border="false" :title="formatDate(t.date)">
            {{ t.weight }}
          </van-cell>
          <template #right>
            <van-button @click="hadnleDeleteWeight(idx)" square type="danger" text="删除" />
          </template>
        </van-swipe-cell>
      </div>
    </main>
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
import { familyApi, recordApi } from '@/apis'
import UnderInput from '@/components/UnderInput.vue'
import { formatDate } from '@/utils/stringUtil'
import { Dialog, Toast } from 'vant'
import {
  computed, onMounted, reactive, ref,
} from 'vue'
import { useRouter } from 'vue-router'
import { getWeightDiff, getTimeDiffDes } from './index'

const themeColor = ref('#1989fa')

const router = useRouter()
const handleBack = () => {
  router.back()
}

// 体重数据
// TODO：从接口获取，按时间排序，从最近的开始
const weights: any[] = reactive([])

const state = reactive({
  people: 'default',
  showTime: false,
  time: '',
  showCalendar: false,
  date: '',
  weight: 0,
})
const peopleOption = reactive([{ text: '默认', value: 'default' }])

const refreshRecord = (familyId: string) => {
  recordApi.getList(familyId).then((res) => {
    const { records } = res.data
    weights.splice(0, weights.length)
    records.forEach((r: any) => {
      r.date = new Date(r.date)
    })
    weights.push(...records)
  })
}

// 切换成员
const handleSelectPeople = (value: string) => {
  refreshRecord(value)
}
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

  showAddPeople.value = false
  familyApi.addPeople(newPoepleName.value).then((res) => {
    Toast.success('添加成功')
    const { familyId } = res.data
    peopleOption.push({
      text: newPoepleName.value,
      value: familyId,
    })
  })
}

// 添加记录相关
const showAddRecord = ref(false)
const handleAddRecord = () => {
  // 展示当前时间
  const now = new Date()
  state.date = formatDate(now, 'yyyy/MM/dd')
  state.time = formatDate(now, 'hh:mm')
  // 展示最近一次的记录
  state.weight = weights.length > 0 ? weights[0].weight : 50.0
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

// 添加记录
const handleSureRecord = () => {
  const date = new Date(`${state.date} ${state.time}`)
  let weight = +state.weight
  if (weight <= 0) {
    return
  }
  weight = +weight.toFixed(2)
  // 按时间顺序插入
  const idx = weights.findIndex((v) => v.date <= date)
  recordApi.addRecord(state.people, weight, date).then((res) => {
    const { recordId } = res.data
    const w = {
      weight,
      date,
      recordId,
    }
    if (idx === -1) {
      weights.push(w)
    } else {
      weights.splice(idx, 0, w)
    }
    Toast.success('记录成功')
  })

  showAddRecord.value = false
}

// 删除记录
const hadnleDeleteWeight = (idx: number) => {
  Dialog.confirm({
    title: '提示',
    message: '确认移除此条记录？',
  })
    .then(() => {
      recordApi.delRecord(weights[idx].recordId).then(() => {
        weights.splice(idx, 1)
      })
    })
    .catch(() => {
      // on cancel
    })
}
// 格式化内容展示
const overviewData = computed(() => {
  const res = []
  // 最新的一次
  const latest = weights[0]
  // 与上一次比较
  const lastTime = weights.length === 1 ? weights[0] : weights[1]
  res.push({
    text: `与上一次比较(${getTimeDiffDes(latest.date, lastTime.date)})`,
    ...getWeightDiff(latest.weight, lastTime.weight),
  })
  // 与今天第一次比较
  const todayData = weights.filter(
    (v) => formatDate(now, 'yyyy-MM-dd') === formatDate(v.date, 'yyyy-MM-dd'),
  )
  if (todayData.length !== 0) {
    const todayFirst = todayData[todayData.length - 1]
    res.push({
      text: `与今天首次比较(${getTimeDiffDes(latest.date, todayFirst.date)})`,
      ...getWeightDiff(latest.weight, todayFirst.weight),
    })
  }
  // 与本月第一次比较
  const monthData = weights.filter(
    (v) => formatDate(now, 'yyyy-MM') === formatDate(v.date, 'yyyy-MM'),
  )
  if (monthData.length !== 0) {
    const monthFirst = monthData[monthData.length - 1]
    res.push({
      text: `与本月首次比较(${getTimeDiffDes(latest.date, monthFirst.date)})`,
      ...getWeightDiff(latest.weight, monthFirst.weight),
    })
  }
  return res
})

onMounted(() => {
  familyApi.getList().then((res) => {
    const { families } = res.data
    for (const f of families) {
      peopleOption.push({
        text: f.name,
        value: f.familyId,
      })
    }
  })

  refreshRecord(state.people)
})
</script>

<style lang="scss" scoped>
@import './index.scss';
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
</style>
