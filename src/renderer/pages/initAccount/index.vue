<template>
  <section id="init">
    <header>
      <img src="../../assets/img/logo.png" @click="logoutBCXAccount" alt />
      <!-- <section class="select-lang no-bg">
        <el-select class="language-select" v-model="lang" @change="changeLanguage">
          <el-option
            v-for="(item, index) in langs"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </section> -->
    </header>
    <section class="des-center" @click="logoutBCXAccount()">{{$t('title.title')}}</section>
    <section class="introduction">{{$t('message.intro')}}</section>
    <section class="app-container text-center">
      <el-button type="primary" @click="RegisterAccount">{{$t('button.createAccount')}}</el-button>
      <el-button type="primary" @click="importAccount">{{$t('button.importAccount')}}</el-button>
    </section>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Storage from "../../utils/storage";
import { remote, ipcRenderer } from "electron";
export default {
  data() {
    return {
      currentCreateVisible: false,
      lang: "",
      lockTime: "",
      langs: [
        { name: "简体中文", value: "ZH" },
        { name: "English", value: "EN" }
      ]
    };
  },
  computed: {
    ...mapState(["currentCreateAccount", "firstLanguage", "curLng"]),
    ...mapState("common", ["registerWallet"])
  },
  created() {
    this.nodeLists().then(res => {
      if (!Array.isArray(res)) return;
      res[0].connect = true;
      this.apiConfig(res[0]).then(() => {
        this.init().then(() => {
          this.getAccounts().then(account => {
            if (
              account.current_account &&
              account.current_account.account_name
            ) {
              this.setAccountType(account.current_account.mode);
              this.setAccount({
                account: account.current_account.account_name,
                password: ""
              });
              this.setLogin(true);
              this.$router.replace({ name: "home" });
            }
          });
        });
      });
    });
  },
  mounted() {
    // this.UpdateVersion();
    // this.IndexedDBQuery()
    console.log(this.firstLanguage);
    console.log(this.curLng);

    if (!this.firstLanguage) {
      this.$i18n.locale =
        remote.app.localLanguage === "zh_CN" ||
        remote.app.localLanguage === "zh_TW"
          ? "ZH"
          : "EN";
      this.setCurLng(this.$i18n.locale);
      this.lang = this.$i18n.locale;
    } else {
      this.lang = this.curLng;
    }
    this.UpdateVersion().then(res => {
      if (remote.app.loadCocosDesktop) {
        this.setUpdate(res);
        ipcRenderer.send("updateCocos", false);
      }
    });
  },
  methods: {
    ...mapMutations([
      "setCurrentAccount",
      "setCurrentCreateAccount",
      "setCurrentCreateVisible",
      "setAccount",
      "setAccountType",
      "setLogin",
      "setCurLng",
      "setUpdate",
      "setFirstLanguage"
    ]),
    ...mapActions("wallet", ["getAccounts", "deleteWallet", "addAccount"]),
    ...mapActions([
      "nodeLists",
      "apiConfig",
      "switchAPINode",
      "init",
      "UpdateVersion",
      "IndexedDBQuery"
    ]),
    ...mapActions("account", ["logoutBCXAccount"]),
    ...mapMutations("common", [
      "WalletRegister",
      "privateStore",
      "AccountLogin"
    ]),
    changeLanguage(e) {
      this.setFirstLanguage(true);
      this.$i18n.locale = this.lang;
      this.setCurLng(this.lang);
    },
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
#init {
  header {
    position: relative;
    height: 216px;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      90deg,
      rgba(48, 191, 253, 1) 0%,
      rgba(58, 123, 255, 1) 100%
    );
    span {
      font-size: 20px;
      padding-left: 10px;
    }
    img {
      // height: 125px;
      width: 134px;
    }
    .select-lang {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 60px !important;
      .language-select {
        background: none !important;
        width: 120px !important;
        .el-input__inner {
          background: none !important;
          border-bottom: none !important;
        }
        input {
          text-align: center !important;
          background-color: transparent !important;
        }
      }
    }
  }
}

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
