<template>
  <section class="panel">
    <section class="secret">
      <div class="alert">{{$t('message.changeAlert')}}</div>
      <el-form ref="form" :model="formData" :rules="formRules">
        <el-form-item prop="oldPassword">
          <span>{{$t('placeholder.oldPassword')}}</span>
          <el-input
            v-model="formData.oldPassword"
            type="password"
            :placeholder="$t('placeholder.oldPassword')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <span>{{$t('placeholder.newPassword')}}</span>
          <el-input
            v-model="formData.password"
            type="password"
            :placeholder="$t('verify.passwordType')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <span>{{$t('placeholder.repassword')}}</span>
          <el-input
            v-model="formData.repassword"
            type="password"
            :placeholder="$t('placeholder.repassword')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="mt60" type="primary" @click="onSubmit('form')">{{$t('button.sure')}}</el-button>
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
      let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,12}$/;
      if (value === "") {
        this.$kalert({
          message: this.$i18n.t("verify.passwordNull")
        });
        callback(new Error());
      } else if (!reg.test(value)) {
        this.$kalert({
          message: this.$i18n.t("verify.passwordType")
        });
        callback(new Error());
      } else {
        if (this.formData.repassword !== "") {
          this.$refs.form.validateField("repassword");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        this.$kalert({
          message: this.$i18n.t("verify.passwordSure")
        });
        callback(new Error());
      } else if (
        value !== this.formData.password &&
        this.formData.password !== ""
      ) {
        this.$kalert({
          message: this.$i18n.t("verify.passwordMatch")
        });
        callback(new Error());
      } else {
        callback();
      }
    };
    return {
      formData: {
        oldPassword: "",
        password: "",
        repassword: ""
      },
      formRules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        repassword: [{ validator: validatePass2, trigger: "blur" }]
      },
      oldPassword: "",
      show: true
    };
  },
  name: "secret",
  methods: {
    ...mapMutations(["setPassword"]),
    ...mapActions("account", ["changePassword"]),
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setPassword({
            oldPassword: this.formData.oldPassword,
            newPassword: this.formData.password
          });
          this.changePassword().then(res => {
            if (res.code === 1) {
              this.$kalert({
                message: this.$i18n.t("alert.modifyPasswordSuccess")
              });
              this.setPassword({
                oldPassword: "",
                newPassword: ""
              });
              setTimeout(() => {
                this.$router.replace({
                  name: "initAccount"
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
.secret {
  display: flex;
  flex-direction: column;
  span {
    font-size: 16px;
    color: rgba(96, 97, 101, 1);
    line-height: 22px;
  }
  .language-select {
    margin-top: 14px;
  }
  .alert {
    color: #ff5b5b;
    font-size: 16px;
    margin-bottom: 10px;
  }
}
</style>