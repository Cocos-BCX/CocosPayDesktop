<template>
  <section class="panel">
    <section class="unlock" v-if="unlock">
      <section class="mt40">
        <img src="../../assets/img/128px.png" alt>
        <p>{{$t('placeholder.temporary')}}</p>
        <div class="input-box">
          <el-input
            clear="no-margin"
            v-model="password"
            type="password"
            @keyup.enter.native="unlockWallet"
            :placeholder="$t('placeholder.password')"
          ></el-input>
          <i @click="unlockWallet" class="right-arrow"></i>
        </div>
      </section>
    </section>
    <section v-else>
      <el-tabs v-model="keyTab" @tab-click="changeStore">
        <el-tab-pane :label="$t('settings.backupFile')" name="bin"></el-tab-pane>
        <el-tab-pane :label="$t('settings.backupPrivate')" name="key"></el-tab-pane>
      </el-tabs>
      <section class="bin" v-if="keyTab === 'bin'">
        <p>{{$t('message.bin')}}</p>
        <el-button class="mt80" type="primary" @click="StoreBin">{{$t('button.createBackup')}}</el-button>
      </section>
      <section v-else>
        <section class="piece" v-if="temporaryKeys">
          <span>{{$t('title.activeKey')}}(active)</span>
          <p>{{$t('message.accountActive')}}</p>
          <section>
            <div class="keys">{{temporaryKeys}}</div>
            <el-button @click="copySuccess(temporaryKeys)" type="primary">{{$t('button.copy')}}</el-button>
          </section>
        </section>
        <section class="piece" v-if="privateKeys">
          <span>{{$t('title.ownerKey')}}(owner)</span>
          <p>{{$t('message.accountOwner')}}</p>
          <section>
            <div class="keys">{{privateKeys}}</div>
            <el-button @click="copySuccess(privateKeys)" type="primary">{{$t('button.copy')}}</el-button>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { clipboard, ipcRenderer } from "electron";
export default {
  data() {
    return {
      keyTab: "bin",
      unlock: true,
      password: ""
    };
  },
  name: "storeWallet",
  computed: {
    ...mapState(["privateKeys", "temporaryKeys", "cocosAccount"])
  },
  methods: {
    ...mapActions("account", ["unlockAccount"]),
    ...mapActions("wallet", ["OutWalletPutKey", "BackupDownload"]),
    ...mapMutations(["settemporaryKeys", "setKeys", "setAccount"]),
    changeStore() {},
    StoreBin() {
      // ipcRenderer.on("downstate", (event, arg) => {
      //   alert("下载状态：" + arg);
      // });
      this.BackupDownload();
    },
    copySuccess(key) {
      clipboard.writeText(key);
      this.$kalert({
        message: this.$i18n.t("alert.copySuccess")
      });
    },
    unlockWallet() {
      if (!this.password) {
        this.$kalert({
          message: this.$i18n.t("placeholder.password")
        });
        return;
      }
      this.setAccount({
        account: this.cocosAccount.accounts,
        password: this.password
      });
      this.unlockAccount().then(res => {
        this.setAccount({
          account: this.cocosAccount.accounts,
          password: ""
        });
        if (res.code === 1) {
          this.unlock = false;
        }
      });
    }
  },
  mounted() {
    this.OutWalletPutKey().then(key => {
      this.settemporaryKeys(key.data.active_private_keys);
      this.setKeys(key.data.owner_private_keys);
    });
  },
  destroyed() {
    this.settemporaryKeys("");
    this.setKeys("");
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/settings.scss";
@import "../../styles/unlock.scss";
.bin {
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    margin-top: 30px;
    font-size: 18px;
    color: rgba(45, 45, 48, 1);
    line-height: 36px;
  }
}
</style>