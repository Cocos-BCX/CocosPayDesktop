<template>
  <section id="perfect-scroll-wrapper" v-loading="!tranfers.length">
    <!-- <section class="th">
      <div>{{$t('label.operation')}}</div>
      <div>{{$t('label.account')}}</div>
      <div>{{$t('label.ptamount')}}</div>
      <div>{{$t('label.tradeTime')}}</div>
      <div></div>
    </section>-->
    <section class="content">
      <section v-for="(item, index) in tranfers" :data="item" :key="index">
        <section class="td" v-if="item.type === 'transfer'">
          <div
            :class="cocosAccount.accounts === item.parse_operations.from ? 'out' : 'in'"
          >{{cocosAccount.accounts === item.parse_operations.from ? $t('label.ptaddress') : $t('label.ptfrom')}}</div>
          <div>{{cocosAccount.accounts === item.parse_operations.from ? item.parse_operations.to : item.parse_operations.from}}</div>
          <div
            :class="cocosAccount.accounts === item.parse_operations.from ? 'out' : 'in'"
          >{{cocosAccount.accounts === item.parse_operations.from ? '-' : '+'}}{{item.parse_operations.amount}}({{$t('title.test')}})</div>
          <div>{{item.date}}</div>
          <div
            @click="$router.push({name:'transferInfo',params:item})"
            class="cursor"
          >{{$t('title.sendDetail')}}</div>
        </section>
        <section class="td" v-if="item.type === 'call_contract_function'">
          <div class="call">{{$t('label.contract')}}</div>
          <div>{{item.parse_operations.caller}}</div>
          <div class="call">{{item.parse_operations.contract_name}}</div>
          <div>{{item.date}}</div>
          <div
            @click="$router.push({name:'transferInfo',params:item})"
            class="cursor"
          >{{$t('title.sendDetail')}}</div>
        </section>
        <section class="td" v-if="item.type === 'transfer_nh_asset'">
          <div :class="cocosAccount.accounts === item.parse_operations.from ? 'out' : 'in'">NH</div>
          <div>{{item.parse_operations.from}}</div>
          <div
            :class="cocosAccount.accounts === item.parse_operations.from ? 'out' : 'in'"
          >{{cocosAccount.accounts === item.parse_operations.from ? '-' : '+'}}{{item.parse_operations.nh_asset}}</div>
          <div>{{item.date}}</div>
          <div
            @click="$router.push({name:'transferInfo',params:item})"
            class="cursor"
          >{{$t('title.sendDetail')}}</div>
        </section>
      </section>
    </section>
  </section>
</template>
<script>
import { mapState } from "vuex";
import PerfectScrollbar from "perfect-scrollbar";
export default {
  name: "action",
  props: ["tranfers", "refresh"],
  methods: {},
  computed: {
    ...mapState(["cocosAccount"])
  },
  data() {
    return {
      transactionsScroller: null
    };
  },
  mounted() {
    this.transactionsScroller = new PerfectScrollbar(
      "#perfect-scroll-wrapper",
      {
        minScrollbarLength: 40,
        maxScrollbarLength: 40
      }
    );
  }
};
</script>
<style lang="scss" scoped>
#perfect-scroll-wrapper {
  width: 100%;
  // height: 100%;
  // overflow: hidden;
  background: #fff;
  position: relative;
  margin-top: 30px;
  padding: 0 24px 34px;
  height: 600px;
  .th {
    color: rgba(144, 148, 153, 1);
    line-height: 22px;
    height: 76px;
  }
  .content {
    display: flex;
    flex-direction: column;
    // height: 500px;
  }
  .td {
    border-bottom: 1px solid rgba(230, 233, 238, 1);
    height: 66px !important;
  }
  .th,
  .td {
    display: flex;
    align-items: center;
    font-size: 16px;
    width: 100%;
    .out {
      color: rgb(73, 132, 248);
    }
    .in {
      color: rgba(47, 196, 159, 1);
    }
    .call {
      color: #033caf;
    }
    div {
      &:nth-of-type(1) {
        width: 100px;
      }
      &:nth-of-type(2) {
        width: 18.6%;
        margin-left: 4%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      &:nth-of-type(3) {
        width: 20%;
        margin-left: 3%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      &:nth-of-type(4) {
        width: 30.6%;
        margin-left: 4%;
      }
      &:nth-of-type(5) {
        min-width: 70px;
        color: rgba(58, 123, 255, 1);
      }
    }
  }
}
</style>
