import Kalert from './kalert.vue'

export default {
  extends: Kalert,
  data () {
    return {
      visible: false
    }
  },
  mounted () {
    this.createTimer()
  },
  beforeDestory () {
    this.clearTimer()
  },
  methods: {
    createTimer () {
      this.timer = setTimeout(() => {
        this.visible = false
      }, 2000)
    },
    clearTimer () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
  }
}
