<template>
  <section class="panel">
    <section class="base">
      <span>{{$t('message.changeLanguage')}}</span>
      <el-select class="language-select" v-model="lang" @change="changeLanguage">
        <el-option
          v-for="(item, index) in langs"
          :key="index"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="mt45">{{$t('message.time')}}</span>
      <section class="mt20">
        <el-radio-group v-model="lockTime" @change="chooseTimeLock">
          <el-radio
            v-for="(item,index) in times"
            :key="index"
            :label="item.time"
          >{{item.title}} {{item.type === 'min' ? $t('unit.minute') : $t('unit.hour')}}</el-radio>
        </el-radio-group>
      </section>
      <span class="mt50">{{$t('title.loginWay')}}</span>
      <div>{{accountType === 'account' ? $t('title.accountType') : $t('title.walletType')}}</div>
    </section>
  </section>
</template>
<script>
const { ipcRenderer } = require("electron");
import { mapState, mapMutations } from "vuex";
export default {
  name: "baseSetting",
  data() {
    return {
      lang: "简体中文",
      lockTime: "",
      langs: [
        { name: "简体中文", value: "ZH" },
        { name: "English", value: "EN" }
      ],
      times: [
        { title: "30", time: "30", type: "min" },
        { title: "1", time: "60", type: "hour" },
        { title: "2", time: "120", type: "hour" },
        { title: "5", time: "300", type: "hour" }
      ]
    };
  },

  computed: {
    ...mapState(["accountType", "lockedTime"])
  },

  methods: {
    ...mapMutations(["setFirstLanguage", "setlockedTime", "setCurLng"]),
    changeLanguage(e) {
      this.setFirstLanguage(true);
      this.$i18n.locale = this.lang;
      this.setCurLng(this.lang);
    },
    chooseTimeLock(e) {
      this.setlockedTime(e);
    }
  },
  mounted() {
    this.lang = this.$i18n.locale;
    this.lockTime = this.lockedTime ? this.lockedTime : this.times[0].time;
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/settings.scss";
.base {
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
  div {
    margin-top: 15px;
    font-size: 18px;
    font-weight: 500;
    color: rgba(45, 45, 48, 1);
    line-height: 25px;
  }
}
</style>