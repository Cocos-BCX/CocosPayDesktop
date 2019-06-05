<template>
  <section>
    <logo-header/>
    <section class="des-center" @click="logoutBCXAccount()">{{$t('title.title')}}</section>
    <section class="introduction">{{$t('message.intro')}}</section>
    <section class="app-container text-center">
      <el-button type="primary" @click="RegisterAccount">{{$t('button.createAccount')}}</el-button>
      <el-button type="primary" @click="importAccount">{{$t('button.importAccount')}}</el-button>
    </section>
  </section>
</template>
<script>
import LogoHeader from "../../components/logo-header";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  components: {
    LogoHeader
  },
  data() {
    return {
      currentCreateVisible: false
    };
  },
  computed: {
    ...mapState(["currentCreateAccount"]),
    ...mapState("common", ["registerWallet"])
  },
  mounted() {
    this.nodeLists();
  },
  methods: {
    ...mapMutations("wallet", ["addAccount"]),
    ...mapMutations([
      "setCurrentAccount",
      "setCurrentCreateAccount",
      "setCurrentCreateVisible"
    ]),
    ...mapActions(["nodeLists"]),
    ...mapActions("account", ["logoutBCXAccount"]),
    ...mapMutations("common", [
      "WalletRegister",
      "privateStore",
      "AccountLogin"
    ]),
    closedDialog() {
      this.currentCreateVisible = false;
    },
    RegisterAccount() {
      this.WalletRegister(true);
      // this.$router.push({ name: "createAccount" });
    },
    importAccount() {
      // this.currentCreateVisible = true;
      this.AccountLogin(true);
    },
    accountLogin() {
      this.$router.push({ name: "login" });
    },
    keysAccount() {
      this.$router.push({ name: "importAccount" });
    },
    jumpHome() {
      this.setCurrentCreateVisible(false);
      this.addAccount(this.currentCreateAccount);
      this.setCurrentAccount(this.currentCreateAccount);
      this.$router.push({ name: "home" });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../theme/v1/variable";
.privateKey-area {
  background-color: $bg-shallow;
  font-size: 12px;
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
}
.des-center {
  margin-top: 110px;
  width: 100%;
  text-align: center;
  font-size: 26px;
  font-weight: 500;
  color: rgba(45, 45, 48, 1);
  line-height: 37px;
}
.introduction {
  margin: 20px 12% 0;
  font-size: 16px;
  color: rgba(96, 97, 101, 1);
  line-height: 24px;
}
button {
  height: 56px;
  width: 210px;
  font-size: 20px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  margin: 10% 5% 0;
}
</style>
