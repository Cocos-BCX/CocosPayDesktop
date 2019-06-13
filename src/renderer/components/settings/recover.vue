<template>
  <section class="panel">
    <section class="upload">
      <span>{{$t('label.keyFile')}}(.bin)</span>
      <section class="box">
        <div>{{file ? file.name : $t('label.restoreKeyFile')}}</div>
        <input type="file" class="file" @change="fileUpload" name id>
        <img src="../../assets/img/cloud.png" alt>
      </section>
      <section class="sha" v-if="sha">{{sha}}</section>
    </section>
    <el-form class="mt40" ref="formwallet" :model="formDataWallet" :rules="WalletRules">
      <el-form-item prop="password">
        <section class="type">{{$t('title.walletPassword')}} ({{$t('message.walletPassword')}})</section>
        <el-input
          class="no-border"
          v-model="formDataWallet.password"
          type="password"
          :placeholder="$t('placeholder.password')"
        ></el-input>

        <input type="text" value style="display: none;">
      </el-form-item>
      <el-form-item class="mt110">
        <el-button type="primary" @click="StoreAccount('formwallet')">{{$t('button.submit')}}</el-button>
        <el-button class="ml40" @click="deleteWallet">{{$t('button.reset')}}</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Cocos from "../../models/cocos";
export default {
  name: "recover",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$i18n.t("verify.passwordNull")));
      } else {
        callback();
      }
    };
    return {
      file: "",
      formDataWallet: {
        password: ""
      },
      WalletRules: {
        password: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["cocosAccount", "sha"])
  },
  methods: {
    ...mapMutations([
      "setSha",
      "setAccount",
      "setIsLocked",
      "setLogin",
      "setCocos"
    ]),
    ...mapActions("wallet", ["deleteWallet", "RestoreWallet"]),
    ...mapActions("wallet", ["LoadWalletFile"]),
    ...mapActions("account", ["unlockAccount"]),
    fileUpload(e) {
      let file = e.target.files[0].name;
      if (!/.bin$/.test(file)) {
        this.$kalert({
          message: "Upload Key File(.bin)"
        });
        return;
      }
      this.file = e.target.files[0];
      this.fileLogin();
    },
    fileLogin() {
      if (this.file) {
        this.LoadWalletFile({ file: this.file }).then(res => {
          if (res.code === 1) {
            this.setSha(res.data.sha1);
          }
        });
      } else {
        this.$kalert({
          message: CommonJs.getI18nMessages(I18n).label.uploadKeyFile
        });
      }
    },
    StoreAccount(formName) {
      if (!this.file) {
        this.$kalert({
          message: CommonJs.getI18nMessages(I18n).label.uploadKeyFile
        });
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setAccount({
            account: this.cocosAccount.accounts,
            password: this.formDataWallet.password
          });
          this.RestoreWallet().then(result => {
            if (result.code === 1) {
              this.unlockAccount().then(unlock => {
                if (unlock.code === 1) {
                  this.setLogin(true);
                  this.setAccount({
                    account: result.data.account_name,
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
                  this.$router.push({ name: "home" });
                }
              });
            }
          });
        }
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../styles/settings.scss";
span {
  font-size: 16px;
  color: #606165;
  line-height: 22px;
}
.box {
  height: 56px;
  background: rgba(241, 244, 247, 1);
  border-radius: 6px;
  margin-top: 14px;
  position: relative;
  div {
    font-size: 18px;
    color: rgba(144, 148, 153, 1);
    position: absolute;
    top: 18px;
    left: 15px;
  }
  input.file {
    position: absolute;
    right: 15px;
    top: 13px;
    opacity: 0;
    height: 30px;
    width: 30px;
    z-index: 10;
  }
  img {
    position: absolute;
    right: 15px;
    top: 13px;
    height: 30px;
    width: 30px;
    z-index: 2;
  }
}
.sha {
  font-size: 16px;
  color: rgba(58, 123, 255, 1);
  line-height: 22px;
  margin-top: 10px;
}
</style>