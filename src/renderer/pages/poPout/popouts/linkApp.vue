/* eslint-disable no-new */
<template>
  <section class="link">
    <header>
      <!-- HEADER -->
      <section class="title">Link New App</section>
      <section class="head">
        <section class="buttons">
          <el-button text="primary" @click="returnResult(true)">{{$t('button.receive')}}</el-button>
          <el-button type="Link" @click="returnResult(false)">{{$t('button.reject')}}</el-button>
        </section>
      </section>
    </header>
    <section class="list">
      <figure class="breadcrumb">Application Details</figure>
      <section class="item">
        <!--{{payload}}-->
        <figure class="title">{{app.origin}}</figure>
        <figure class="sub-title">{{app.appkey}}</figure>
      </section>
    </section>
  </section>
</template>

<script>
import AuthorizedApp from "../../../models/authorizedApp";

export default {
  data() {
    return {};
  },
  computed: {
    app() {
      return AuthorizedApp.fromJson(this.payload);
    }
  },
  mounted() {},
  methods: {
    returnResult(result) {
      this.$emit("returned", result);
    }
  },
  props: ["payload", "pluginOrigin"]
};
</script>

<style scoped lang="scss">
.link {
  background: rgba(246, 248, 252, 1);
}
header {
  background: #fff;
  padding: 38px 40px;
  height: 150px;
  display: flex;
  justify-content: space-between;
  .title {
    font-size: 14px;
    font-weight: 500;
    color: rgba(45, 45, 48, 1);
  }
  button {
    width: 160px !important;
  }
}
.list {
  padding: 32px 40px;
  .breadcrumb {
    font-size: 16px;
    color: rgba(96, 97, 101, 1);
  }
  .item {
    width: 100%;
    height: 141px;
    background: rgba(246, 248, 252, 1);
    border-radius: 6px;
    border: 1px solid rgba(200, 206, 212, 1);
    margin-top: 22px;
    padding: 30px 18px;
    .title {
      font-size: 18px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(45, 45, 48, 1);
    }
    .sub-title {
      font-size: 14px;
      margin-top: 16px;
      color: rgba(96, 97, 101, 1);
      line-height: 20px;
    }
  }
}
</style>