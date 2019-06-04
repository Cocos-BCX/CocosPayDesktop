<template>
  <transition name="fade" @after-leave="afterLeave" @after-enter="afterEnter">
    <div class="kalert-container" v-show="visible">
      <span class="content">{{message}}</span>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'kalert',
    props: {
      message: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        visible: true
      }
    },
    methods: {
      afterLeave () {
        this.$emit('closed')
      },
      afterEnter () {
      },
      clearTimer () {
      },
      createTimer () {
      }
    }
  }
</script>
<style lang="scss" scoped>
  .kalert {
    &-container {
      position: fixed;
      left: 50%;
      bottom: 10%;
      /*background-color: rgba(0, 0, 0, 0.5);*/
      color: #fff;
      z-index: 100001;
      transform: translate(-50%, 0);
      background-color: #666;
      border-radius: 8px;
      min-width: 120px;
      max-width: 90%;
      text-align: center;
      .content {
        display: inline-block;
        padding: 10px;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
        font-size: 14px;
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .5s ease;
  }

  .fade-enter, .fade-leave-to {
    bottom: 0;
    opacity: 0;
  }
</style>
