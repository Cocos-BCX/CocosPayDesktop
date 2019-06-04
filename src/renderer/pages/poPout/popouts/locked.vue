<template>
  <section class="locked">
    <section class="header">
      <div>Unlock Request</div>
      <el-button @click="returnResult(null)">{{$t('button.cancel')}}</el-button>
    </section>
    <section class="body">
      <h2>COCOS {{$t('title.locked')}}</h2>
      <h3>{{$t('message.lockedNeed')}}</h3>
      <h4>{{$t('message.lockedLogin')}}</h4>
      <h5>{{$t('message.lockedDes')}}</h5>
    </section>
  </section>
</template>
<script>
import WindowService from '../../../services/windowService'
import { mapState, mapMutations } from 'vuex'
const { remote } = window.require('electron')
export default {
  methods: {
    ...mapMutations(['setDialogs']),
    returnResult (result) {
      let returned = null
      // this.$emit("returned", returned);
      setTimeout(() => remote.getCurrentWindow().close(), 50)
    }
  }
}
</script>

<style lang="scss" scoped>
.locked {
  background: rgba(246, 248, 252, 1);
  .header {
    height: 150px;
    height: 100%;
    display: flex;
    padding: 38px 24px 56px 40px;
    justify-content: space-between;
    div {
      font-size: 14px;
      font-weight: 500;
      color: rgba(45, 45, 48, 1);
    }
    button {
      width: 210px;
    }
  }
  .body {
    width: 720px;
    height: 220px;
    background: rgba(246, 248, 252, 1);
    border-radius: 6px;
    border: 1px solid rgba(200, 206, 212, 1);
    margin: 32px auto;
    padding: 30px 18px;
    h2 {
      font-size: 18px;
      color: rgba(45, 45, 48, 1);
    }
    h3 {
      font-size: 14px;
      font-weight: 400;
      color: rgba(96, 97, 101, 1);
      margin-top: 16px;
    }
    h4 {
      font-size: 14px;
      color: rgba(96, 97, 101, 1);
      margin-top: 16px;
    }
    h5 {
      font-size: 14px;
      color: rgba(96, 97, 101, 1);
      margin-top: 14px;
      line-height: 27px;
    }
  }
}
</style>
