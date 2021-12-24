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
      <h1 class="current-weight">
        {{ weights[0].weight }}
        <span>kg</span>
        <span class="jin">{{ weights[0].weight * 2 }}</span>
        <span>斤</span>
      </h1>
      <p class="rank" v-for="(t, idx) in overviewData" :key="idx">
        {{ t.text }}
        <span :class="t.symbol"></span>
        <span class="res">{{ t.res }}</span>
      </p>
      <canvas ref="mychart" style="width: 100%; height: 220px"></canvas>
      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">体重记录</van-divider>
      <van-search v-model="searchWeight" placeholder="请输入过滤关键词" input-align="center" />

      <div class="weight-list">
        <van-swipe-cell v-for="(t, idx) in showWeights" :key="idx">
          <van-cell :title-style="{ flex: 1.1 }" :border="false" :title="formatDate(t.date)">
            <div style="display: flex; justify-content: space-between">
              <span>{{ t.weight }}</span>
              <span>{{ t.tips || '' }}</span>
            </div>
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
        <UnderInput v-model="newPoepleName" placeholder="昵称" tips="输入要记录的家人昵称" icon="manager-o" />
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
        <van-field
          v-model="state.tips"
          clickable
          type="text"
          name="tips"
          label="备注"
          placeholder="(选填)"
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
import { Dialog, Toast, Search } from 'vant'
import {
  computed, onMounted, reactive, ref, watchEffect,
} from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { formatDate } from '@/utils/stringUtil'
import { familyApi, recordApi } from '@/apis'
import UnderInput from '@/components/UnderInput.vue'
import { getWeightDiff, getTimeDiffDes } from './index'

const store = useStore()

const themeColor = ref('#1989fa')

const router = useRouter()
const handleBack = () => {
  router.back()
}

const state = reactive({
  people: 'default',
  showTime: false,
  time: '',
  showCalendar: false,
  date: '',
  weight: 0,
  tips: '',
})

// 默认选择
// 体重数据
const { weights, peopleOption } = store.state.weight as WeightState

// 搜索关键字
const searchWeight = ref('')

// 实际展示的列表
const showWeights = computed(() => weights.filter((w) => {
  if (!searchWeight.value) return true
  return `${formatDate(w.date)}${w.tips || ''}${w.weight}`.includes(searchWeight.value)
}))

const refreshRecord = (familyId: string) => {
  store.dispatch('weight/getRecords', { familyId })
}
const refreshFamilies = () => {
  store.dispatch('weight/getFamilyList')
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
  // 去重
  if (peopleOption.find((v) => v.text === newPoepleName.value)) {
    Toast.fail('名称已存在')
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
    // 缓存数据
    localStorage.setItem('families', JSON.stringify(peopleOption.slice(1)))

    // 刷新选择
    state.people = familyId
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
  const { tips } = state
  state.tips = ''
  recordApi.addRecord(state.people, weight, date, tips).then((res) => {
    const { recordId } = res.data
    const w = {
      weight,
      date: +date,
      recordId,
      tips,
    }
    if (idx === -1) {
      weights.push(w)
    } else {
      weights.splice(idx, 0, w)
    }
    Toast.success('记录成功')
    // 缓存数据
    localStorage.setItem(state.people, JSON.stringify(weights))
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
        // 缓存数据
        localStorage.setItem(state.people, JSON.stringify(weights))
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

const mychart = ref(null as unknown as HTMLElement)
watchEffect(() => {
  if (weights.length !== 0 && mychart.value) {
    const data = [
      ...weights.map((v, idx) => ({
        weight: v.weight,
        date: v.date,
        idx,
      })),
    ]
    data.sort((a, b) => a.date - b.date)
    data.forEach((v, idx) => {
      v.idx = idx + 1
    })

    // Step 1: 创建 Chart 对象
    const chart = new window.F2.Chart({
      el: mychart.value,
      pixelRatio: window.devicePixelRatio, // 指定分辨率
    })
    const wMax = Math.max(...data.map((v) => v.weight))
    const wMin = Math.min(...data.map((v) => v.weight))
    const buf = 4
    chart.source(data, {
      weight: {
        min: wMin - buf > 0 ? wMin - buf : 0,
        max: wMax + buf,
      },
    })
    chart.tooltip({
      showCrosshairs: true,
      showItemMarker: false,
      background: {
        radius: 2,
        fill: '#1890FF',
        padding: [3, 5],
      },
      nameStyle: {
        fill: '#fff',
      },
      onShow: function onShow(ev) {
        const { items } = ev
        const { date } = items[0].origin
        items[0].name = `时间${formatDate(date, 'yyyy-MM-dd hh:mm')} 体重`
      },
    })
    chart.line().position('idx*weight')
    chart.point().position('idx*weight').style({
      lineWidth: 1,
      stroke: '#fff',
    })

    chart.interaction('pan')

    // 定义进度条
    chart.scrollBar({
      mode: 'x',
      xStyle: {
        size: 2,
      },
    })

    // 绘制 tag
    // chart.guide().tag({
    //   position: [1969, 1344],
    //   withPoint: false,
    //   content: '1,344',
    //   limitInPlot: true,
    //   offsetX: 5,
    //   direct: 'cr',
    // })
    chart.render()
  }
})
onMounted(() => {
  refreshFamilies()
  refreshRecord(state.people)
})
</script>

<style lang="scss" scoped>
@import "./index.scss";
.van-cell {
  justify-content: space-between;
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
.jin {
  font-size: 1rem;
  line-height: 1rem;
}
</style>
