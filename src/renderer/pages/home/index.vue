<template>
  <section>
    <app-header @refresh="refreshAccount"/>
    <div slot="content" class="content">
      <section class="left">
        <!-- <div class="search">
          <img src="../../assets/img/search.png" alt>
          <input type="text" placeholder="serach">
        </div>-->
        <p @click="loadData">{{$t('label.assert')}}</p>
        <div class="total">¥0.00</div>
        <section id="perfect-scroll">
          <section class="coins" v-for="(item,index) in accountList" :key="index">
            <section class="coin">
              <img src="../../assets/img/cocos2.png" alt>
              <!-- <div class="img" v-else></div> -->
              <span>
                {{item[0]}}
                <span class="test-coin">({{$t('title.test')}})</span>
              </span>
            </section>
            <span class="num">{{item[1]}}</span>
          </section>
        </section>
      </section>
      <section class="right">
        <el-button
          type="primary"
          class="position refresh"
          @click="loadData"
        >{{$t('button.refresh')}}</el-button>
        <el-button
          class="position transfer"
          @click="$router.push({name:'transfer'})"
          type="primary"
        >{{$t('button.transfer')}}</el-button>
        <p>{{$t('title.history')}}</p>
        <action :tranfers="tranfers" :refresh="refresh"/>
        <!-- <section class="page">
          <el-pagination
            @prev-click="prevPage"
            @next-click="nextPage"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="total"
            :page-size="1"
          ></el-pagination>
        </section>-->
      </section>
    </div>
  </section>
</template>
<script>
import AppHeader from "@/components/app-header";
import Action from "@/components/action";
import Navigation from "@/components/navigation";
import { mapState, mapMutations, mapActions } from "vuex";
import utils from "@/utils/utils";
import Cocos from "@/models/cocos";
import SocketService from "@/services/socketService";
import PerfectScrollbar from "perfect-scrollbar";
import { remote, ipcRenderer } from "electron";
export default {
  name: "home",
  components: {
    AppHeader,
    Action,
    Navigation
  },
  data() {
    return {
      accountKey: false,
      nameVisible: false,
      transactions: [],
      transactionsAll: [],
      total: 0,
      noResult: false,
      currentAccountPrivateKey: "",
      cocosInfo: {},
      tranfers: [],
      totalTx: [],
      endId: "",
      lastId: "",
      firstId: "",
      accountList: [],
      myInterval: null,
      refresh: false,
      coinsScroller: null
    };
  },
  computed: {
    ...mapState("account", ["balance", "assets"]),
    ...mapState("wallet", ["accounts", "pwdhash"]),
    ...mapState("trans", ["tranferList"]),
    ...mapState([
      "cocosAccount",
      "cocosCount",
      "lockedTime",
      "currentAccount",
      "cocos",
      "firstLanguage",
      "curLng"
    ])
  },
  watch: {
    "cocosAccount.accounts"() {
      this.loadData();
    }
  },
  async mounted() {
    this.UpdateVersion().then(res => {
      if (remote.app.loadCocosDesktop) {
        this.setUpdate(res);
        ipcRenderer.send("updateCocos", false);
      }
    });
    this.loadData();
    this.nodeLists();
    if (!this.firstLanguage) {
      this.$i18n.locale =
        remote.app.localLanguage === "zh_CN" ||
        remote.app.localLanguage === "zh_TW"
          ? "ZH"
          : "EN";
      this.setCurLng(this.$i18n.locale);
    }
    this.coinsScroller = new PerfectScrollbar("#perfect-scroll", {
      minScrollbarLength: 40,
      maxScrollbarLength: 40
    });
  },
  destroyed() {
    clearInterval(this.myInterval);
  },
  methods: {
    ...mapMutations([
      "setCurrentAccount",
      "setCocosCount",
      "setIsLocked",
      "setCocos",
      "setAccountType",
      "setUpdate",
      "setCurLng"
    ]),
    ...mapMutations("trans", ["setTranferList"]),
    ...mapMutations("wallet", ["addAccount", "updateAccount", "deleteWallet"]),
    ...mapActions(["lockCount", "nodeLists", "UpdateVersion"]),
    ...mapActions("account", [
      "loadingBCXAccount",
      "UserAccount",
      "OutPutKey",
      "logoutBCXAccount"
    ]),
    ...mapActions("trans", ["queryTranferList"]),
    handleCurrentChange(e) {
      this.tranfers = this.totalTx[e - 1];
    },

    loadData() {
      this.totalTx = [];
      this.total = 1;
      this.loadingBCXAccount().then(res => {
        if (res && res.locked) {
          if (this.cocosAccount.accounts) {
            this.setIsLocked(true);
            this.$router.replace({ name: "unlock" });
          } else {
            if (res.mode === "account") {
              this.logoutBCXAccount().then(res => {
                if (res.code === 1) {
                  this.$router.replace({ name: "initAccount" });
                }
              });
            } else {
              this.deleteWallet().then(res => {
                if (res.code === 1) {
                  this.$router.replace({ name: "initAccount" });
                }
              });
            }
          }
        } else {
          this.lockAccount();
          this.setIsLocked(false);
          this.listShow();
        }
      });
    },
    listShow() {
      this.UserAccount().then(res => {
        this.accountList = Object.entries(res.data);
        if (res.code === 1) {
          setTimeout(() => {
            this.transferList();
            clearInterval(this.myInterval);
            this.myInterval = setInterval(() => {
              this.transferList();
              this.setCocosCount(res.data.COCOS);
            }, 10000);
          }, 50);
        }
      });
    },
    prevPage(e) {
      this.tranfers = this.totalTx[e + 1];
    },
    nextPage(e) {
      this.tranfers = this.totalTx[e - 1];
    },
    lockAccount() {
      clearTimeout(pageTimer);
      const time = this.lockedTime ? this.lockedTime : 30;
      pageTimer = setTimeout(async () => {
        await this.lockCount();
        this.loadData();
      }, time * 60000);
    },
    transferList() {
      this.setTranferList({
        limit: 50,
        startId: "1.11.0",
        endId: "1.11.0"
      });
      this.queryTranferList().then(res => {
        this.tranfers = res;
        return;
        // if (res.length < 10) {
        // }
        // let j = 0;
        // let list = [];
        // this.totalTx = [];
        // this.tranfers = [];
        // for (let i = 0; i < res.length; i++) {
        //   if (j < 10) {
        //     j++;
        //     list.push(res[i]);
        //     if (res.length - 2 === i) {
        //       this.totalTx.push(list);
        //     }
        //   } else {
        //     j = 0;
        //     this.totalTx.push(list);
        //     list = [];
        //   }
        // }

        // this.total = this.totalTx.length;
        // this.tranfers = this.totalTx[0];
      });
    },
    closedAccountDialog() {
      this.accountKey = false;
    },
    copyError() {
      this.$kalert({
        message: this.$i18n.t("alert.copyFail")
      });
    },
    selectAccount(account) {
      this.setCurrentAccount(account);
      this.refreshTransactions();
    },
    async refreshAccount() {
      SocketService.initialize();
      this.refresh = true;
      this.loadData();
      if (!this.cocos) {
        const cocos = Cocos.placeholder();
        this.setCocos(cocos);
      } else if (!(this.cocos instanceof Cocos)) {
        let sfj = JSON.parse(JSON.stringify(this.cocos));
        const cocos = Cocos.fromJson(sfj);
        this.setCocos(cocos);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../theme/v1/variable";
@import "../../styles/home.scss";
</style>
