<template>
  <section class="panel" v-if="add">
    <section class="base">
      <span>{{$t('label.nodeSelect')}}</span>
      <el-select class="language-select" v-model="choose">
        <el-option v-for="(item, index) in nodes" :key="index" :label="item.ws" :value="index">
          <!-- <span>{{ item.ws }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>-->
        </el-option>
        <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
      </el-select>
    </section>
    <el-button class="mt60" type="primary" @click="Add">{{$t('button.addNode')}}</el-button>
    <el-button class="mt60" type="primary" @click="onSubmit">{{$t('button.sure')}}</el-button>
  </section>
  <section class="panel" v-else>
    <section class="base">
      <section class="type">{{$t('label.nodeConnect')}}</section>
      <el-input
        class="no-border"
        v-model="formData.ws"
        type="text"
        :placeholder="$t('placeholder.input') + $t('label.nodeConnect')"
      ></el-input>
      <section class="type mt10">{{$t('label.route')}}</section>
      <el-input
        class="no-border"
        v-model="formData.url"
        type="text"
        :placeholder="$t('placeholder.input') + $t('label.route')"
      ></el-input>
      <section class="type mt10">{{$t('label.nodeId')}}</section>
      <el-input
        class="no-border"
        v-model="formData.chainId"
        type="text"
        :placeholder="$t('placeholder.input') + $t('label.nodeId')"
      ></el-input>
      <section class="type mt10">{{$t('label.nodeName')}}</section>
      <el-input
        class="no-border"
        v-model="formData.name"
        type="text"
        :placeholder="$t('placeholder.input') + $t('label.nodeName')"
      ></el-input>
    </section>
    <el-button class="mt20" type="primary" @click="Add">{{$t('title.back')}}</el-button>
    <el-button class="mt20 ml40" type="primary" @click="AddNode">{{$t('button.sure')}}</el-button>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import BCX from "bcxjs-api";
import Storage from "../../utils/storage";
import { GetBCXWithState } from "../../utils/bcx";
export default {
  name: "baseSetting",
  data() {
    return {
      nodes: [],
      node: "",
      choose: "",
      formData: {
        ws: "",
        url: "",
        chainId: "",
        name: "",
        type: 2
      },
      add: true
    };
  },
  methods: {
    ...mapActions("account", ["logoutBCXAccount"]),
    ...mapActions("wallet", ["deleteWallet"]),
    onSubmit() {
      let NewBCX = GetBCXWithState();
      if (
        this.nodes[this.choose].chainId === Storage.get("choose_node").chainId
      ) {
        NewBCX.switchAPINode({
          url: this.nodes[this.choose].ws
        }).then(res => {
          if (res.code === 1) {
            this.$kalert({
              message: this.$i18n.t("alert.modifySuccess")
            });
            Storage.set("choose_node", this.nodes[this.choose]);
          }
        });
      } else {
        let Node = this.nodes[this.choose];
        this.init(Node);
        NewBCX.init({ refresh: true }).then(res => {
          if (res.code !== 1) {
            this.$kalert({
              message: this.$i18n.t(`error[${res.code}]`)
            });
            this.init(this.nodes[0]);
            NewBCX.init({ refresh: true }).then(res => {
              NewBCX.switchAPINode({
                url: this.nodes[0].ws
              }).then(res => {});
            });
          }
        });
      }
    },
    Add() {
      this.add = !this.add;
    },
    init(Node) {
      let NewBCX = new BCX({
        default_ws_node: Node.ws,
        ws_node_list: [
          {
            url: Node.ws,
            name: Node.name
          }
        ],
        networks: [
          {
            core_asset: "COCOS",
            chain_id: Node.chainId
          }
        ],
        faucet_url: Node.url,
        auto_reconnect: false,
        worker: false
      });
    },
    AddNode() {
      this.formData.type = 2;
      let add_node = Storage.get("add_node") ? Storage.get("add_node") : [];
      add_node.push(this.formData);
      Storage.set("add_node", add_node);
      this.nodes = Storage.get("node").concat(
        Storage.get("add_node") ? Storage.get("add_node") : []
      );
      this.add = !this.add;
    }
  },
  mounted() {
    this.nodes = Storage.get("node").concat(
      Storage.get("add_node") ? Storage.get("add_node") : []
    );
    this.choose = Storage.get("choose_node").ws;
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/settings.scss";
.base {
  display: flex;
  flex-direction: column;
  span {
    font-size: 16px;
    color: rgba(96, 97, 101, 1);
    line-height: 22px;
  }
  .language-select {
    margin-top: 14px;
  }
  div {
    margin-top: 15px;
    font-size: 18px;
    font-weight: 500;
    color: rgba(45, 45, 48, 1);
    line-height: 25px;
  }
}
</style>