export function getWeightDiff(w1: number, w2: number) {
  const diff = w1 - w2
  if (diff === 0) {
    return {
      symbol: '',
      res: '无变化',
    }
  }
  return {
    symbol: diff > 0 ? 'inc' : 'dec',
    res: `${Math.abs(diff).toFixed(2)} 公斤`,
  }
}
const ONE_SECONDS = 1000
const ONE_MINUTE = ONE_SECONDS * 60
const ONE_HOUR = ONE_MINUTE * 60
const ONE_DAY = ONE_HOUR * 24
export function getTimeDiffDes(d1: Date | number | string, d2: Date | number | string) {
  d1 = d1 instanceof Date ? d1 : new Date(d1)
  d2 = d2 instanceof Date ? d2 : new Date(d2)
  const diff = d1.getTime() - d2.getTime()
  //   天
  if (diff / ONE_DAY >= 1) {
    return `${Math.round(diff / ONE_DAY)}天前`
  }

  // 小时
  if (diff / ONE_HOUR >= 1) {
    return `${Math.round(diff / ONE_HOUR)}小时前`
  }
  // 分钟
  if (diff / ONE_MINUTE >= 1) {
    return `${Math.round(diff / ONE_MINUTE)}分钟前`
  }
  // 秒
  return `${Math.round(diff / ONE_SECONDS)}秒前`
}
