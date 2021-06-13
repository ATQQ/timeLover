import { App } from '@vue/runtime-core'
// 全量引入
import { Button, Icon, Toast } from 'vant'

const conponents = [Button, Icon, Toast]

export default function mountVantUI(app: App<Element>) {
  conponents.forEach((c) => {
    app.component(c.name, c)
  })
}
