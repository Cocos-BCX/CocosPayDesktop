<template>
  <section class="popup">
    <div class="item">
      <label class="label">{{$t('label.ownerAccount')}}：</label>
      <div class="content">{{cocosAccount.accounts}}</div>
    </div>
    <div class="item">
      <label class="label">{{$t('label.toAddress')}}：</label>
      <div class="content">{{formData.to}}</div>
    </div>
    <div class="item">
      <label class="label">{{$t('label.amount')}}：</label>
      <div class="content">
        {{formData.amount}} {{coin}}
        <span class="test-coin">({{$t('title.test')}})</span>
      </div>
    </div>
    <div class="item">
      <label class="label">{{$t('label.memo')}}：</label>
      <div class="content memo">{{formData.memo}}</div>
    </div>
    <div class="item">
      <label class="label">{{$t('label.charge')}}：</label>
      <div class="content">
        {{fee}} COCOS
        <span class="test-coin">({{$t('title.test')}})</span>
      </div>
    </div>
    <section class="mt70 flex">
      <el-button @click="cancelDialog">{{$t('button.cancel')}}</el-button>
      <el-button type="primary" @click="surePay">{{$t('button.surePay')}}</el-button>
    </section>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Dialog",
  props: ["cocosAccount", "formData", "fee", "coin"],
  methods: {
    ...mapMutations("trans", ["setAccount"]),
    ...mapActions("trans", ["tranferBCX", "queryTranferRate"]),
    surePay() {
      this.setAccount({
        toAccount: this.formData.to,
        coin: this.coin,
        amount: this.formData.amount,
        memo: this.formData.memo
      });
      this.tranferBCX().then(res => {
        if (res.code === 1) {
          this.$kalert({
            message: this.$i18n.t("alert.tranferSuccess")
          });
          setTimeout(() => {
            this.$router.push({ name: "home" });
          }, 300);
        }
      });
    },
    cancelDialog() {
      this.$emit("cancelDialog");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../theme/v1/variable";

.popup {
  padding: 20px;
  background-color: #fff;
  .item {
    display: flex;
    height: 60px;
    overflow: hidden;
    margin-top: 12px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e6e9ee;
    .label {
      white-space: nowrap;
      color: $color-second;
      display: flex;
      align-items: center;
      width: 77px;
    }
    .content {
      text-align: right;
      overflow: hidden;
      display: flex;
      align-items: center;
      width: 350px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  button {
    min-width: 304px;
  }
}
</style>

