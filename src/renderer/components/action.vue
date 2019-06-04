<template>
  <section class="actions">
    <section class="th">
      <div>{{$t('label.operation')}}</div>
      <div>{{$t('label.account')}}</div>
      <div>{{$t('label.ptamount')}}</div>
      <div>{{$t('label.tradeTime')}}</div>
      <div></div>
    </section>
    <section class="content">
      <section class="td" v-for="(item, index) in tranfers" :data="item" :key="index">
        <div
          :class="cocosAccount.accounts === item.parse_operations.from ? 'out' : 'in'"
        >{{cocosAccount.accounts === item.parse_operations.from ? $t('label.ptaddress') : $t('label.ptfrom')}}</div>
        <div>{{cocosAccount.accounts === item.parse_operations.from ? item.parse_operations.to : item.parse_operations.from}}</div>
        <div>{{parseFloat(item.parse_operations.amount)}}</div>
        <div>{{item.date}}</div>
        <div
          @click="$router.push({name:'transferInfo',params:item})"
          class="cursor"
        >{{$t('title.sendDetail')}}</div>
      </section>
    </section>
  </section>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "action",
  props: ["tranfers"],
  methods: {},
  computed: {
    ...mapState(["cocosAccount"])
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.actions {
  width: 100%;
  // height: 100%;
  overflow-y: scroll;
  background: #fff;
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
      color: rgba(58, 123, 255, 1);
    }
    .in {
      color: rgba(47, 196, 159, 1);
    }
    div {
      &:nth-of-type(1) {
        width: 100px;
      }
      &:nth-of-type(2) {
        width: 18.6%;
        margin-left: 9%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      &:nth-of-type(3) {
        width: 14%;
        margin-left: 4%;
      }
      &:nth-of-type(4) {
        width: 30.6%;
        margin-left: 10%;
      }
      &:nth-of-type(5) {
        min-width: 70px;
        color: rgba(58, 123, 255, 1);
      }
    }
  }
}
</style>
