<template>
  <section class="panel">
    <section class="logout" v-if="accountType === 'wallet' && !isLocked">
      <p>{{$t('message.logoutWallet')}}</p>
      <div class="btns">
        <el-button type="primary" @click="goStore">{{$t('settings.backup')}}</el-button>
        <el-button type="primary" @click="logout">{{$t('button.sure')}}</el-button>
      </div>
    </section>
    <section class="logout" v-else>
      <p>{{$t('message.logoutAccount')}}</p>
      <div class="btns">
        <el-button type="primary" @click="logout">{{$t('button.sure')}}</el-button>
        <el-button @click="$router.go(-1)">{{$t('button.cancel')}}</el-button>
      </div>
    </section>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { clearTimeout } from "timers";
export default {
  name: "logout",
  computed: {
    ...mapState(["accountType", "isLocked", "lockedTimer"])
  },

  methods: {
    ...mapActions("account", ["logoutBCXAccount"]),
    ...mapActions("wallet", ["deleteWallet"]),
    logout() {
      if (window.timers) clearTimeout(window.timers);
      // this.accountType === "wallet"
      //   ? this.deleteWallet()
      //   : this.logoutBCXAccount();
      Promise.all([this.deleteWallet(), this.logoutBCXAccount()]).then(res => {
        this.$router.replace({ name: "initAccount" });
      });
    },
    goStore() {
      this.$emit("goStore");
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../styles/settings.scss";
.logout {
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    font-size: 18px;
    font-weight: 500;
    color: rgba(45, 45, 48, 1);
    line-height: 36px;
    text-align: center;
  }
  .btns {
    margin-top: 72px;
    display: flex;
    width: 510px;
    justify-content: space-between;
  }
}
</style>