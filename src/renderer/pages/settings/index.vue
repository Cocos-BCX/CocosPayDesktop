<template>
  <section>
    <app-header/>
    <navigation/>
    <div slot="content" class="content">
      <section class="left">
        <section
          class="list"
          v-for="(item,index) in setting"
          :key="index"
          :class="item.active ? 'active' : ''"
          @click="changeSetting(item)"
        >
          <div class="coin">
            <span>{{$t(item.title)}}</span>
          </div>
        </section>
      </section>
      <section class="right">
        <p>{{$t(type.title)}}</p>
        <settings-base-setting v-if="type.value === 'base'"/>
        <settings-import v-if="type.value === 'import' && !isImportKeys"/>
        <node-change v-if="type.value === 'node'"></node-change>
        <settings-logout @goStore="goStore" v-if="type.value === 'logout'"/>
        <settings-recover v-if="type.value === 'recover'"/>
        <settings-secret v-if="type.value === 'secret'"/>
        <settings-store-wallet v-if="type.value === 'storeWallet'"/>
        <settings-store-account v-if="type.value === 'storeAccount'"/>
        <update v-if="type.value === 'update'" :cancel="true"></update>
      </section>
    </div>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import AppHeader from "@/components/app-header";
import Navigation from "@/components/navigation";
import SettingsBaseSetting from "@/components/settings/basesetting";
import SettingsImport from "@/components/settings/import";
import SettingsLogout from "@/components/settings/logout";
import SettingsRecover from "@/components/settings/recover";
import SettingsSecret from "@/components/settings/secret";
import SettingsStoreWallet from "@/components/settings/storewallet";
import SettingsStoreAccount from "@/components/settings/storeaccount";
import NodeChange from "@/components/settings/nodechange";
import Update from "@/components/dialog/update";
export default {
  name: "home",
  components: {
    AppHeader,
    Navigation,
    SettingsBaseSetting,
    SettingsImport,
    SettingsLogout,
    SettingsRecover,
    SettingsSecret,
    SettingsStoreWallet,
    SettingsStoreAccount,
    NodeChange,
    Update
  },
  data() {
    return {
      type: "",
      setting: [
        {
          title: "settings.base",
          value: "base",
          login: true,
          type: "base",
          active: false
        },
        {
          title: "button.modifyPassword",
          value: "secret",
          login: true,
          type: "account",
          active: false
        },
        {
          title: "settings.backup",
          value: "storeAccount",
          login: true,
          type: "account",
          active: false
        },
        {
          title: "settings.backupWallet",
          value: "storeWallet",
          login: true,
          type: "wallet",
          active: false
        },
        {
          title: "settings.recover",
          value: "recover",
          login: true,
          type: "wallet",
          active: false
        },
        {
          title: "settings.node",
          value: "node",
          login: true,
          type: "node",
          active: false,
          locked: true
        },
        {
          title: "settings.update",
          value: "update",
          login: true,
          type: "base",
          active: false,
          locked: true
        },
        {
          title: "settings.quit",
          value: "logout",
          login: true,
          type: "base",
          active: false,
          locked: true
        }
      ]
    };
  },

  computed: {
    ...mapState(["accountType", "isImportKeys"])
  },
  methods: {
    ...mapMutations(["setIsLocked"]),
    ...mapActions("account", ["loadingBCXAccount"]),
    ...mapActions(["nodeLists"]),
    changeSetting(type) {
      this.type = type;
      this.setting.map(item => {
        type.value === item.value
          ? (item.active = true)
          : (item.active = false);
      });
    },
    goStore() {
      this.setting.map(item => {
        item.active = false;
        if (
          item.value ===
          (this.accountType === "wallet" ? "storeWallet" : "storeAccount")
        ) {
          this.type = item;
          this.type.active = true;
        }
      });
    }
  },
  async mounted() {
    this.nodeLists();
    let settingTypes = [];
    this.setting.forEach(item => {
      if (item.type !== "wallet" && this.accountType === "account") {
        settingTypes.push(item);
      } else if (
        item.type !== "account" &&
        item.value !== "recover" &&
        this.accountType === "wallet"
      ) {
        settingTypes.push(item);
      }
    });
    await this.loadingBCXAccount().then(res => {
      if (res && res.locked) {
        settingTypes = [];
        this.setIsLocked(true);
        this.setting.forEach(item => {
          if (
            (item.value === "recover" && this.accountType === "wallet") ||
            item.value === "base" ||
            item.value === "logout" ||
            item.value === "update" ||
            item.value === "node"
            //  || (item.value === "import" && !this.isImportKeys)
          ) {
            settingTypes.push(item);
          }
        });
      } else {
        this.setIsLocked(false);
      }
    });
    this.setting = settingTypes;
    this.type = this.setting[0];
    this.type.active = true;
  }
};
</script>
<style lang="scss" scoped>
@import "../../theme/v1/variable";
@import "../../styles/settings.scss";
</style>
