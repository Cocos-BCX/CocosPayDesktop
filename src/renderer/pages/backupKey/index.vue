<template>
  <section class="store">
    <section class="text-center red font22">{{$t('message.privity')}}</section>
    <section class="piece">
      <span>{{$t('title.activeKey')}}(active)</span>
      <p>{{$t('message.active')}}</p>
      <section>
        <div class="keys">{{temporaryKeys}}</div>
        <el-button @click="copySuccess(temporaryKeys)" type="primary">{{$t('button.copy')}}</el-button>
      </section>
    </section>
    <section class="piece">
      <span>{{$t('title.ownerKey')}}(owner)</span>
      <p>{{$t('message.owner')}}</p>
      <section>
        <div class="keys">{{privateKeys}}</div>
        <el-button @click="copySuccess(privateKeys)" type="primary">{{$t('button.copy')}}</el-button>
      </section>
    </section>
    <section class="btns">
      <!-- <el-button class="back-button">上一步</el-button> -->
      <el-button
        class="finish"
        @click="privateStore(false)"
        type="primary"
      >{{$t('button.complete')}}</el-button>
    </section>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { clipboard } from "electron";
export default {
  data() {
    return {
      radio: "wallet",
      wallet: null,
      lang: "zh"
    };
  },
  computed: {
    ...mapState(["privateKeys", "temporaryKeys"])
  },
  created() {
    this.lang = this.curLng;
  },
  methods: {
    ...mapMutations("common", ["privateStore"]),
    ...mapMutations(["settemporaryKeys", "setKeys"]),
    ...mapActions("account", ["OutPutKey"]),
    copySuccess(key) {
      clipboard.writeText(key);
      this.$kalert({
        message: this.$i18n.t("alert.copySuccess")
      });
    }
  },
  destroyed() {
    this.settemporaryKeys("");
    this.setKeys("");
  }
};
</script>
<style lang="scss" scoped>
.store {
  padding: 0 15px;
}
.piece {
  display: flex;
  flex-direction: column;
  margin-top: 42px;
  padding-bottom: 16px;
  span {
    font-size: 20px;
    font-weight: 500;
    color: rgba(45, 45, 48, 1);
    line-height: 28px;
  }
  p {
    margin-top: 22px;
    font-size: 16px;
    color: rgba(96, 97, 101, 1);
    line-height: 22px;
    width: 600px;
  }
  section {
    display: flex;
    align-items: center;
    margin-top: 14px;
    .keys {
      width: 465px;
      height: 56px;
      background: rgba(241, 244, 247, 1);
      border-radius: 6px;
      display: flex;
      align-items: center;
      padding: 0 14px;
    }
    button {
      width: 139px;
      height: 56px;
      border-radius: 6px;
      margin-left: 16px;
    }
  }
}
.btns {
  margin-top: 40px;
  padding-bottom: 30px;
}
</style>
