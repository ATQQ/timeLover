import { App } from '@vue/runtime-core'

// 全量引入
import { Button } from 'vant'

const conponents = [Button]

export default function mountVantUI(app: App<Element>) {
  conponents.forEach((c) => {
    app.component(c.name, c)
  })
}
