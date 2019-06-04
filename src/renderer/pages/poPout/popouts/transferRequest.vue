<template>
  <section>
    <header>
      <span>Signature Request</span>
      <span>{{cocosAccount.accounts}}</span>
    </header>
    <section class="detail">
      <section class="left">
        <p>{{$t('label.ptcontract')}} & {{$t('label.operation')}}</p>
        <p>cocos -> transfer</p>
      </section>
      <section class="right">
        <div class="item">
          <span>from</span>
          <span>{{cocosAccount.accounts}}</span>
        </div>
        <div class="item">
          <span>to</span>
          <span>{{to}}</span>
        </div>
        <div class="item">
          <span>quantity</span>
          <span>{{amount}} COCOS ({{this.$t('title.test')}})</span>
        </div>
        <div class="item">
          <span>memo</span>
          <span>{{memo}}</span>
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
    ...mapState(["state", "cocosAccount"]),
    to() {
      return this.payload.toAccount;
    },
    amount() {
      return parseFloat(this.payload.amount);
    },
    options() {
      return this.payload.options || {};
    },
    symbol() {
      return this.payload.symbol;
    },
    contract() {
      return this.payload.contract;
    },
    memo() {
      return this.payload.memo;
    },
    decimals() {
      return this.options.decimals || 4;
    },
    displayAmount() {
      const amount =
        this.amount > 0
          ? parseFloat(this.amount).toFixed(this.decimals)
          : parseFloat(this.customAmount).toFixed(this.decimals);
      return !isNaN(amount) ? amount : 0;
    }
  },
  mounted() {
    this.accountsArr.push(this.cocosAccount);
    this.accountsArr.map(async account => {
      this.balances.push({
        account: account.accounts,
        balance: await this.getBalance(account)
      });
    });
    let transfer = JSON.parse(localStorage.getItem("tranferWhite")) || [];
    if (transfer.length) {
      transfer.forEach(item => {
        if (
          utils.compare(item, {
            from: this.cocosAccount.accounts,
            toAccount: this.to,
            amount: this.amount
          })
        ) {
          this.returnResult(true);
          this.isWhite = true;
        }
      });
    }
  },
  methods: {
    returnResult(result) {
      let transfer = JSON.parse(localStorage.getItem("tranferWhite")) || [];
      if (this.checked && !this.isWhite) {
        transfer.push({
          from: this.cocosAccount.accounts,
          toAccount: this.to,
          amount: this.amount
        });
        localStorage.setItem("tranferWhite", JSON.stringify(transfer));
        this.isWhite = false;
      }
      let returned = null;
      if (result) {
        let amount = this.displayAmount;
        if (parseFloat(amount) <= 0) {
          return PopupService.push(
            Popup.prompt(
              "Invalid Amount",
              `You can not send 0 ${this.symbol}`,
              "exclamation-triangle",
              "Okay"
            )
          );
        }
        returned = {
          account: this.selectedAccount,
          amount
        };
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
