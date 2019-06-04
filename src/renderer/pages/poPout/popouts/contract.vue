<template>
  <section>
    <header>
      <span>Signature Request</span>
      <span>{{cocosAccount.accounts}}</span>
    </header>
    <section class="detail">
      <section class="left">
        <p>{{$t('label.ptcontract')}} & {{$t('label.operation')}}</p>
        <p>{{payload.nameOrId}} -> {{payload.functionName}}</p>
      </section>
      <section class="right">
        <div class="item">
          <span>from</span>
          <span>{{cocosAccount.accounts}}</span>
        </div>
        <div class="item">
          <span>contract</span>
          <span>{{payload.nameOrId}}</span>
        </div>
        <div class="item">
          <span>operation</span>
          <span>{{payload.functionName}}</span>
        </div>
        <div class="item">
          <span>valueList</span>
          <span>{{payload.valueList}}</span>
        </div>
      </section>
    </section>
    <footer>
      <section class="check">
        <el-checkbox v-model="checked">{{$t('message.joinWhiteList')}}</el-checkbox>
        <p>{{$t('message.whiteListDes')}}</p>
      </section>
      <section class="btns">
        <el-button @click="returnResult(null)">{{$t('button.reject')}}</el-button>
        <el-button type="primary" @click="returnResult(true)">{{$t('button.receive')}}</el-button>
      </section>
    </footer>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import PopupService from "../../../services/PopupService";
import { Popup } from "../../../models/popups/Popup";
import { GetBCXWithState } from "../../../utils/bcx";
import utils from "../../../utils/utils";

export default {
  data() {
    return {
      checked: false,
      selectedAccount: null,
      searchTerms: "",
      balances: [],
      accountsArr: [],
      customAmount: 0,
      isWhite: false
    };
  },
  computed: {
    ...mapState(["state", "cocosAccount"])
  },
  mounted() {
    let contract = JSON.parse(localStorage.getItem("contractWhite")) || [];
    if (contract.length) {
      contract.forEach(item => {
        if (
          utils.compare(item, {
            from: this.cocosAccount.accounts,
            nameOrId: this.payload.nameOrId,
            functionName: this.payload.functionName
          })
        ) {
          this.isWhite = true;
          this.returnResult(true);
        }
      });
    }
  },
  methods: {
    returnResult(result) {
      let contract = JSON.parse(localStorage.getItem("contractWhite")) || [];
      if (this.checked && !this.isWhite) {
        contract.push({
          from: this.cocosAccount.accounts,
          nameOrId: this.payload.nameOrId,
          functionName: this.payload.functionName
        });
        localStorage.setItem("contractWhite", JSON.stringify(contract));
        this.isWhite = false;
      }
      let returned = null;
      if (result) {
        returned = {};
      }
      this.$emit("returned", returned);
    },
    selectAccount(account) {
      if (this.balance(account) < this.amount) return;
      this.selectedAccount = account;
    },
    async getBalance(account) {
      let resData = await GetBCXWithState()
        .queryAccountBalances({
          unit: "",
          account: account
        })
        .then(res => {
          if (res.code !== 1) {
            res = 0;
          }
          resData = res;
        });
      return resData;
    },
    balance(account) {
      return this.getBalance(account);
    }
  },
  props: ["payload", "pluginOrigin"]
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "../../../styles/_variables.scss";
@import "../../../styles/dialog.scss";
</style>
