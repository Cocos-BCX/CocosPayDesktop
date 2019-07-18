<template>
  <section>
    <header>
      <span>Signature Request</span>
      <span>{{cocosAccount.accounts}}</span>
    </header>
    <section class="detail" v-if="popupType === apiActions.CALLCONTRACTFUNCTION">
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
        <div class="item memo">
          <span>valueList</span>
          <div>{{payload.valueList}}</div>
        </div>
      </section>
    </section>
    <section class="detail" v-if="popupType === apiActions.CREATE_NH_ASSET_ORDER">
      <section class="left">
        <p>{{$t('label.otcAccount')}} & {{$t('label.operation')}}</p>
        <p>{{payload.otcAccount}} -> creatNHAssetOrder</p>
      </section>
      <section class="right">
        <div class="item">
          <span>orderFee</span>
          <span>{{payload.orderFee}}</span>
        </div>
        <div class="item">
          <span>NHAssetId</span>
          <span>{{payload.NHAssetId}}</span>
        </div>
        <div class="item">
          <span>price priceAssetId</span>
          <span>{{payload.price}}{{payload.priceAssetId}}</span>
        </div>
        <div class="item">
          <span>expiration</span>
          <span>{{payload.expiration}}</span>
        </div>
        <div class="item memo">
          <span>memo</span>
          <div>{{payload.memo}}</div>
        </div>
      </section>
    </section>
    <section class="detail" v-if="popupType === apiActions.FILL_NH_ASSET_ORDER">
      <section class="left">
        <p>account & {{$t('label.operation')}}</p>
        <p>{{cocosAccount.accounts}} -> fillNHAssetOrder</p>
      </section>
      <section class="right">
        <div class="item">
          <span>orderId</span>
          <span>{{payload.orderId}}</span>
        </div>
      </section>
    </section>
    <section class="detail" v-if="popupType === apiActions.CANCEL_NH_ASSET_ORDER">
      <section class="left">
        <p>account & {{$t('label.operation')}}</p>
        <p>{{cocosAccount.accounts}} -> cancelNHAssetOrder</p>
      </section>
      <section class="right">
        <div class="item">
          <span>orderId</span>
          <span>{{payload.orderId}}</span>
        </div>
      </section>
    </section>
    <section class="detail" v-if="popupType === apiActions.TRANSFER_NH_ASSET">
      <section class="left">
        <p>account & {{$t('label.operation')}}</p>
        <p>{{cocosAccount.accounts}} -> transferNHAsset</p>
      </section>
      <section class="right">
        <div class="item">
          <span>toAccount</span>
          <span>{{payload.toAccount}}</span>
        </div>
        <div class="item">
          <span>NHAssetIds</span>
          <span>{{payload.NHAssetIds}}</span>
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
import { mapState, mapMutations, mapActions } from "vuex";
import * as ApiActions from "../../../models/apiActions";
import { GetBCXWithState } from "../../../utils/bcx";
import utils from "../../../utils/utils";
import Storage from "../../../utils/storage";
import AuthorizedApp from "../../../models/authorizedApp";
export default {
  data() {
    return {
      checked: false,
      selectedAccount: null,
      searchTerms: "",
      balances: [],
      accountsArr: [],
      customAmount: 0,
      isWhite: false,
      fee: "",
      apiActions: ApiActions
    };
  },
  computed: {
    ...mapState(["state", "cocosAccount", "isLocked"]),
    app() {
      return AuthorizedApp.fromJson(this.payload);
    }
  },
  mounted() {
    let whiteList = Storage.get("whiteList") || [];
    let white = whiteList.some(ele => {
      return (
        ele.domain === this.app.origin &&
        ele.account === this.cocosAccount.accounts
      );
    });
    if (white) {
      this.returnResult(true);
      this.isWhite = true;
    }
  },
  methods: {
    ...mapMutations("wallet", ["addWhiteList"]),
    returnResult(result) {
      let whiteList = Storage.get("whiteList") || [];
      if (this.checked && !this.isWhite && result) {
        whiteList.push({
          domain: this.app.origin,
          account: this.cocosAccount.accounts,
          createTime: this.$moment().format("x")
        });
        Storage.set("whiteList", whiteList);
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
  props: ["payload", "pluginOrigin", "popupType"]
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "../../../styles/_variables.scss";
@import "../../../styles/dialog.scss";
</style>
