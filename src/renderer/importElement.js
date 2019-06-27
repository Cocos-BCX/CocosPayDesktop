import Vue from 'vue'
import {
  // import { Icon } from 'vue-awesome/components/Icon';
  Button,
  Form,
  FormItem,
  Input,
  Checkbox,
  Select,
  Option,
  Dialog,
  MessageBox,
  Tabs,
  TabPane,
  Radio,
  RadioGroup,
  Pagination,
  Upload,
  Icon,
  Loading
} from 'element-ui'
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Button)
Vue.use(Form)
Vue.use(Button)
Vue.use(Form)
Vue.use(Icon)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Pagination)
Vue.use(Upload)
Vue.use(Loading)
Vue.prototype.$confirm = MessageBox.confirm