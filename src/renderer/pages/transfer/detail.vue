<template>
  <section>
    <app-header/>
    <navigation/>
    <section class="detail">
      <p>{{$t('label.trasfer')}}</p>
      <section class="content" v-if="orderDeatil.parse_operations">
        <img src="../../assets/img/success.png" alt>
        <section class="panel">
          <p>{{$t('alert.tranferSuccess')}}</p>
          <span class="num">
            {{orderDeatil.parse_operations.amount}}
            <span class="test-coin">({{$t('title.test')}})</span>
          </span>
          <section class="message">
            <div class="item">
              <span>{{$t('label.send')}}：</span>
              <span>{{orderDeatil.parse_operations.from}}</span>
            </div>
            <div class="item">
              <span>{{$t('label.cost')}}：</span>
              <span>
                {{orderDeatil.parse_operations.fee}}
                <span class="test-coin">({{$t('title.test')}})</span>
              </span>
            </div>
            <div class="item">
              <span>{{$t('label.toAddress')}}：</span>
              <span>{{orderDeatil.parse_operations.to}}</span>
            </div>
            <div class="item">
              <span>{{$t('label.tradeTime')}}：</span>
              <span>{{orderDeatil.date}}</span>
            </div>
            <div class="item">
              <span>{{$t('label.amount')}}：</span>
              <span>
                {{orderDeatil.parse_operations.amount}}
                <span class="test-coin">({{$t('title.test')}})</span>
              </span>
            </div>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>
<script>
import AppHeader from "@/components/app-header";
import Navigation from "@/components/navigation";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      orderDeatil: {}
    };
  },
  components: {
    AppHeader,
    Navigation
  },
  computed: {
    ...mapState(["cocosAccount"])
  },
  mounted() {
    if (!this.$route.params.id) {
      this.$router.go(-1);
    }
    this.orderDeatil = this.$route.params;
  },
  name: "transferInfo",
  methods: {}
};
</script>
<style lang="scss" scoped>
.detail {
  padding: 28px 36px;
  p {
    font-size: 22px;
    font-weight: 500;
    color: rgba(45, 45, 48, 1);
    line-height: 30px;
  }
  .content {
    width: 100%;
    height: 311px;
    background: rgba(58, 123, 255, 0.0808);
    border-radius: 6px;
    margin-top: 30px;
    padding: 42px;
    display: flex;
    img {
      height: 44px;
      width: 44px;
    }
    .panel {
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      p {
        font-size: 26px;
        font-weight: 500;
        color: rgba(58, 123, 255, 1);
        line-height: 37px;
      }
      .num {
        font-size: 26px;
        color: rgba(45, 45, 48, 1);
        line-height: 31px;
        margin-top: 8px;
      }
      .message {
        display: flex;
        flex-wrap: wrap;
        margin-top: 28px;
        .item {
          margin-top: 12px;
          width: 40%;
          font-size: 16px;
          color: rgba(144, 148, 153, 1);
          line-height: 22px;
          span:nth-of-type(1) {
            min-width: 80px;
          }
          span:nth-of-type(2) {
            color: rgba(45, 45, 48, 1);
            margin-left: 8px;
          }
        }
      }
    }
  }
}
</style>
