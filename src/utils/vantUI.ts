import { App } from '@vue/runtime-core'
// 按需引入
import {
  DatetimePicker,
  Button,
  Icon,
  NavBar,
  DropdownMenu,
  DropdownItem,
  Popup,
  Dialog,
  Form,
  Field,
  Calendar,
  Picker,
  Empty,
  SwipeCell,
  Cell,
  Divider,
} from 'vant'

const conponents = [
  DatetimePicker,
  Calendar,
  Button,
  Icon,
  NavBar,
  DropdownMenu,
  DropdownItem,
  Popup,
  Form,
  Field,
  Picker,
  Empty,
  SwipeCell,
  Cell,
  Divider,
]

export default function mountVantUI(app: App<Element>) {
  conponents.forEach((c) => {
    app.component(c.name, c)
  })
  app.component(Dialog.Component.name, Dialog.Component)
}
