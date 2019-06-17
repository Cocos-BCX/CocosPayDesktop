<template>
  <header class="header">
    <section class="title cursor">{{$t('title.wallet')}}</section>
    <section class="account">
      <div class="mr40 cursor" v-if="!isLocked" @click="listShow">
        <span>{{cocosAccount.accounts}}</span>
        <img v-if="accountType === 'wallet'" src="../assets/img/change.png" alt>
      </div>
      <section class="account-list cursor" v-if="selectAccount">
        <div
          class="item"
          v-for="(item,index) in list"
          @click="chooseAccount(item,index)"
          :key="index"
        >
          <span :class="item === cocosAccount.accounts ? 'active' : ''">{{item}}</span>
          <!-- <div class="check" ></div> -->
          <i v-if="item === cocosAccount.accounts" class="el-icon-check"></i>
        </div>
        <div class="add" @click="addAccounts">+ {{$t('label.newAccout')}}</div>
      </section>
      <img class="mr40 cursor" src="../assets/img/lock.png" v-if="isLocked" @click="lockCount" alt>
      <img class="mr40 cursor" src="../assets/img/unlock.png" v-else @click="lockCount" alt>
      <img
        class="cursor"
        @click="$router.push({name:'settings'})"
        src="../assets/img/setting.png"
        alt
      >
    </section>
  </header>
</template>
<script>
// import SocketService from "../services/socketService";
// const clickoutside = {
//   bind(el, binding, vnode) {
//     function documentHandler(e) {
//       if (binding.expression) {
//         binding.value(e);
//       }
//     }
//     el.__vueClickOutside__ = documentHandler;
//     document.addEventListener("click", documentHandler);
//   },
//   update() {},
//   unbind(el, binding) {
//     document.removeEventListener("click", el.__vueClickOutside__);
//     delete el.__vueClickOutside__;
//   }
// };
import Cocos from "../models/cocos";
import { mapState, mapMutations, mapActions } from "vuex";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      selectAccount: false,
      list: []
    };
  },
  computed: {
    ...mapState(["cocosAccount", "isLocked", "accountType", "cocos"])
  },
  mounted() {
    this.loadAccounts();
  },
  // directives: { clickoutside },
  watch: {
    "cocosAccount.accounts"(val) {
      if (val) {
        this.loadAccounts();
      }
    }
  },

  methods: {
    ...mapMutations("common", ["AccountLogin"]),
    ...mapMutations([
      "setAccount",
      "setIsLocked",
      "setCocos",
      "setAccount",
      "setAccountType",
      "setAccountAdd"
    ]),
    ...mapActions("wallet", ["getAccounts", "setCurrentAccount"]),
    ...mapActions(["lockCount"]),
    ...mapActions("account", ["loadingBCXAccount"]),
    loadAccounts() {
      // setTimeout(() => {
      this.getAccounts().then(res => {
        this.list = res.accounts;
        this.setAccountType(res.current_account.mode);
      });
      // }, 1000);
    },

    addAccounts() {
      this.AccountLogin(true);
      this.setAccountAdd(true);
      this.selectAccount = false;
    },

    listShow() {
      this.accountType === "wallet"
        ? (this.selectAccount = !this.selectAccount)
        : (this.selectAccount = false);
    },
    chooseAccount(account, index) {
      this.setCurrentAccount({ account }).then(res => {
        if (res.code === 1) {
          this.setAccount({
            account: account,
            password: ""
          });
          // SocketService.initialize();
          this.selectAccount = false;
          this.$emit("refresh");
          if (!this.cocos) {
            const cocos = Cocos.placeholder();
            this.setCocos(cocos);
          } else if (!(this.cocos instanceof Cocos)) {
            let sfj = JSON.parse(JSON.stringify(this.cocos));
            const cocos = Cocos.fromJson(sfj);
            this.setCocos(cocos);
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../theme/v1/variable";
header {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: linear-gradient(90deg, $info-color 0%, $primary-color 100%);
  font-size: 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  .account {
    display: flex;
    align-items: center;
    position: relative;
  }
  .account-list {
    width: 320px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 2px 2px 8px 1px rgba(204, 209, 218, 1);
    border-radius: 6px;
    position: absolute;
    top: 44px;
    right: 32%;
    z-index: 100;

    .item {
      &:first-child {
        border: none;
      }
      height: 71px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 24px;
      border-top: 1px solid rgba(230, 233, 238, 1);
      span {
        font-size: 20px;
        color: rgba(144, 148, 153, 1);
        line-height: 28px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 200px;
        &.active {
          color: rgba(26, 29, 38, 1);
        }
      }
    }

    .add {
      border-top: 1px solid rgba(230, 233, 238, 1);
      height: 71px;
      font-size: 20px;
      color: rgba(45, 45, 48, 1);
      display: flex;
      align-items: center;
      padding-left: 24px;
    }
  }
  .check {
    width: 8px;
    height: 16px;
    border-width: 0 3px 5px 0;
    border-color: #3a7bff;
    border-style: solid;
    background: #3a7bff;
    transform: rotate(45deg);
  }
  .el-icon-check {
    color: #3a7bff;
    font-size: 30px;
  }
}
</style>

