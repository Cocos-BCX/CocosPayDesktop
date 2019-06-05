<template>
  <section class="panel">
    <section class="import">
      <el-form ref="form" :model="formData" :rules="formRules">
        <el-form-item prop="oldPassword">
          <span>{{$t('title.privateKey')}}</span>
          <el-input v-model="formData.keys" type="text" :placeholder="$t('placeholder.privateKey')"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <span>{{$t('title.tempassword')}}</span>
          <el-input
            v-model="formData.password"
            type="password"
            :placeholder="$t('verify.passwordType')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="mt40" type="primary" @click="onSubmit('form')">{{$t('button.sure')}}</el-button>
        </el-form-item>
      </el-form>
    </section>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$i18n.t("verify.passwordNull")));
      } else {
        if (this.formData.keys !== "") {
          this.$refs.form.validateField("repassword");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        this.$kalert({
          message: this.$i18n.t("verify.privateNull")
        });
        callback(new Error());
      } else {
        callback();
      }
    };
    return {
      formData: {
        keys: "",
        password: ""
      },
      formRules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        keys: [{ validator: validatePass2, trigger: "blur" }]
      },
      oldPassword: "",
      show: true
    };
  },
  computed: {
    ...mapState(["cocosAccount"])
  },
  name: "import",
  methods: {
    ...mapActions("account", ["importPrivateKey"]),
    ...mapMutations(["setAccount", "setKeys", "setIsImportKeys"]),
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setAccount({
            account: this.cocosAccount.accounts,
            password: this.formData.password
          });
          this.setKeys(this.formData.keys);
          this.importPrivateKey().then(res => {
            if (res.code === 1) {
              this.setIsImportKeys(true);
              this.$kalert({
                message: this.$i18n.t("alert.importSuccess")
              });
              this.setAccount({
                account: this.cocosAccount.accounts,
                password: ""
              });
              this.setKeys("");
              setTimeout(() => {
                this.$router.replace({
                  name: "home"
                });
              }, 1000);
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
</style>