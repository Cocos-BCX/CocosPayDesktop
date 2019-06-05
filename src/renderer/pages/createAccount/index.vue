<template>
  <section class="init">
    <section class="type">{{$t('label.type')}}</section>
    <section class="radio-groups">
      <el-radio-group v-model="radio" @change="changeType()">
        <el-radio :label="'wallet'">{{$t('title.walletType')}}</el-radio>
        <el-radio :label="'account'">{{$t('title.accountType')}}</el-radio>
      </el-radio-group>
    </section>
    <el-form ref="form" :model="formData" :rules="formRules" class="mt20">
      <el-form-item prop="account">
        <section class="type">{{$t('label.account')}}</section>
        <el-input
          class="no-border"
          v-model="formData.account"
          type="text"
          :placeholder="$t('verify.accountType')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <section class="type">{{$t('label.password')}}</section>
        <el-input
          class="no-border"
          v-model="formData.password"
          type="password"
          :placeholder="$t('verify.passwordType')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="repassword">
        <section class="type">{{$t('placeholder.repassword')}}</section>
        <el-input
          class="no-border"
          v-model="formData.repassword"
          type="password"
          :placeholder="$t('placeholder.repassword')"
        ></el-input>
      </el-form-item>
      <el-form-item class="mt40" style="margin-bottom:0">
        <el-button
          class="full-btn height-button"
          type="primary"
          @click="createWallet('form')"
          :disabled="!formData.account || !formData.password || !formData.repassword"
        >{{$t('button.create')}}</el-button>
      </el-form-item>
    </el-form>
    <section
      v-if="radio === 'wallet'"
      class="small-tip text-center red mt30"
      @click="deleteWallet"
    >{{$t('message.wallet')}}</section>
    <section v-if="radio === 'account'" class="text-center red mt20">{{$t('message.account')}}</section>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Navigation from "../../components/navigation";
import SocketService from "../../services/socketService";
import Cocos from "../../models/cocos";
export default {
  components: {
    Navigation
  },
  data() {
    const validatePass = (rule, value, callback) => {
      let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,12}$/;
      if (value === "") {
        if (this.changeRadio) {
          this.setChangeRadio(false);
          return;
        }
        this.$kalert({
          message: this.$i18n.t("verify.passwordNull")
        });
        callback(new Error());
      } else if (!reg.test(value)) {
        if (this.changeRadio) {
          this.setChangeRadio(false);
          return;
        }
        this.$kalert({
          message: this.$i18n.t("verify.passwordType")
        });
        callback(new Error());
      } else {
        callback();
      }
    };
    const accountPass = (rule, value, callback) => {
      let reg = /^[a-z]([a-z0-9\.-]){4,63}$/;
      if (value === "") {
        if (this.changeRadio) {
          this.setChangeRadio(false);
          return;
        }
        this.$kalert({
          message: this.$i18n.t("verify.accountNull")
        });
        callback(new Error());
      } else if (!reg.test(value)) {
        if (this.changeRadio) {
          this.setChangeRadio(false);
          return;
        }
        this.$kalert({
          message: this.$i18n.t("verify.accountType")
        });
        callback(new Error());
      } else {
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        if (this.changeRadio) {
          this.setChangeRadio(false);
          return;
        }
        this.$kalert({
          message: this.$i18n.t("verify.passwordSure")
        });
        callback(new Error());
      } else if (value !== this.formData.password) {
        if (this.changeRadio) {
          this.setChangeRadio(false);
          return;
        }
        this.$kalert({
          message: this.$i18n.t("verify.passwordMatch")
        });
        callback(new Error());
      } else {
        callback();
      }
    };
    return {
      radio: "wallet",
      wallet: null,
      lang: "zh",
      formData: {
        account: "",
        password: ""
        // repassword: ""
      },
      formRules: {
        account: [{ validator: accountPass, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        repassword: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["curLng", "accounts", "passwords", "accountType", "cocos"])
  },
  created() {
    this.lang = this.curLng;
  },
  methods: {
    ...mapMutations([
      "setCurLng",
      "setAccount",
      "setAccountType",
      "settemporaryKeys",
      "setKeys",
      "setChangeRadio",
      "setCocos",
      "loading"
    ]),
    ...mapMutations("common", [
      "WalletRegister",
      "privateStore",
      "AccountLogin"
    ]),
    ...mapActions("account", [
      "loadBCXAccount",
      "loginBCXAccount",
      "logoutBCXAccount",
      "OutPutKey"
    ]),
    ...mapActions("wallet", [
      "WalletBCXAccount",
      "deleteWallet",
      "importPrivateKey",
      "OutWalletPutKey"
    ]),
    createWallet(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.radio === "account") {
            this.setAccount({
              account: this.formData.account,
              password: this.formData.password
            });
            this.loadBCXAccount().then(res => {
              if (res.code === 1) {
                this.loading(true);
                setTimeout(() => {
                  this.loading(false);
                  this.loginBCXAccount().then(result => {
                    if (result.code === 1) {
                      SocketService.initialize();
                      this.WalletRegister(false);
                      this.setAccount({
                        account: this.formData.account,
                        password: ""
                      });
                      if (!this.cocos) {
                        const cocos = Cocos.placeholder();
                        this.setCocos(cocos);
                      } else if (!(this.cocos instanceof Cocos)) {
                        let sfj = JSON.parse(JSON.stringify(this.cocos));
                        const cocos = Cocos.fromJson(sfj);
                        this.setCocos(cocos);
                      }
                      this.OutPutKey().then(key => {
                        if (key.code === 1) {
                          this.settemporaryKeys(key.data.active_private_keys);
                          this.setKeys(key.data.owner_private_keys);
                          this.privateStore(true);
                          this.$router.push({ name: "home" });
                        }
                      });
                    }
                  });
                }, 1000);
              }
            });
          } else {
            this.setAccount({
              account: this.formData.account,
              password: this.formData.password
            });
            this.WalletBCXAccount().then(res => {
              // this.setAccount({
              //   account: this.formData.account,
              //   password: ""
              // });
              if (res.code === 1) {
                this.OutWalletPutKey().then(key => {
                  if (key.code === 1) {
                    this.settemporaryKeys(key.data.active_private_keys);
                    this.setKeys(key.data.owner_private_keys);
                    this.privateStore(true);
                    this.$router.push({ name: "home" });
                  }
                });
                this.WalletRegister(false);
              }
            });
          }
        }
      });
    },
    changeType() {
      this.setChangeRadio(true);
    },
    noAlert() {
      if (this.changeRadio) {
        this.setChangeRadio(false);
        return;
      }
    }

    // changeLanguage() {
    //   this.setCurLng(this.lang);
    //   this.$i18n.locale = this.lang;
    // }
  }
};
</script>
<style lang="scss" scoped>
.init {
  .el-input {
    margin-top: 14px !important;
  }
}
.type {
  font-size: 16px;
  color: rgba(96, 97, 101, 1);
  line-height: 22px;
}
.radio-groups {
  margin-top: 16px;
}
.select-lang {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 50px;
}
.index-title {
  font-size: 30px;
  margin: 25px auto 40px;
}
</style>
