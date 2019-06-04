<template>
  <transition name="fade">
    <div class="mask" v-show="visible">
      <div class="dialog">
        <div class="dialog-close" v-if="showClose" @click="handleClose">
          <v-icon name="times"></v-icon>
        </div>
        <div class="dialog-title">{{title}}</div>
        <div class="dialog-body">
          <slot></slot>
        </div>
        <div class="dialog-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'k-dialog',
  props: {
    title: {
      type: String,
      default: '提示'
    },
    visible: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "index";
</style>
