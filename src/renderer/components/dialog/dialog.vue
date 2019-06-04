<template>
  <div class="dialogs">
    <el-dialog
      center
      :title="$t('title.createAccount')"
      :visible.sync="Register"
      width="700px"
      :close-on-click-modal="false"
      @close="WalletRegister"
      v-if="Register"
    >
      <Create/>
    </el-dialog>
    <el-dialog
      center
      :title="$t('title.storeKey')"
      :visible.sync="storeKey"
      :close-on-click-modal="false"
      width="700px"
      @close="privateStore"
      v-if="storeKey"
    >
      <BackupKey/>
    </el-dialog>
    <el-dialog
      center
      :title="$t('title.login')"
      :visible.sync="accountLogin"
      width="700px"
      :close-on-click-modal="false"
      @close="AccountLogin"
      v-if="accountLogin"
    >
      <Login/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Create from "@/pages/createAccount";
import BackupKey from "@/pages/backupKey";
import Login from "@/pages/login";
export default {
  name: "Dialogs",
  components: {
    Create,
    BackupKey,
    Login
  },
  computed: {
    ...mapState("common", ["registerWallet", "storePrivate", "accounLogin"]),
    Register: {
      get() {
        return this.registerWallet;
      },
      set() {}
    },
    storeKey: {
      get() {
        return this.storePrivate;
      },
      set() {}
    },
    accountLogin: {
      get() {
        return this.accounLogin;
      },
      set() {}
    }
  },
  methods: {
    ...mapMutations("common", [
      "WalletRegister",
      "privateStore",
      "AccountLogin"
    ])
  }
};
</script>

<style lang="scss" scoped>
.logins {
  width: 200%;
}
</style>
