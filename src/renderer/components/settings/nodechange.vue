<template>
  <section class="panel" v-if="add">
    <section class="base">
      <div class="title">
        <span>{{$t('label.nodeSelect')}}</span>
        <el-button class="add-node" type="primary" @click="Add">{{$t('button.addNode')}}</el-button>
      </div>
      <el-select class="language-select" v-model="selected" @change="changeSelectNode(selected)">
        <el-option v-for="(item, index) in nodes" :key="index" :label="item.name" :value="item.ws">
          <!-- <span>{{ item.ws }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>-->
        </el-option>
        <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
      </el-select>
    </section>
    <el-button
      class="mt40"
      type="primary"
      @click="Add('edit')"
      :disabled="edit"
    >{{$t('button.editNode')}}</el-button>
    <el-button class="mt40" type="primary" @click="onSubmit">{{$t('button.save')}}</el-button>
  </section>
  <section class="panel" v-else>
    <section class="base">
      <el-button
        class="add-node position"
        v-if="changeNode"
        type="primary"
        @click="DeleteNode"
      >{{$t('button.deleteNode')}}</el-button>
      <section class="type">Ws</section>
      <el-input
        class="no-border"
        v-model="formData.ws"
        type="text"
        :placeholder="$t('placeholder.input') + ' Ws'"
      ></el-input>
      <section class="type mt10">FaucetUrl</section>
      <el-input
        class="no-border"
        v-model="formData.faucet_url"
        type="text"
        :placeholder="$t('placeholder.input') + ' FaucetUrl'"
      ></el-input>
      <section class="type mt10">ChainId</section>
      <el-input
        class="no-border"
        v-model="formData.chainId"
        type="text"
        :placeholder="$t('placeholder.input') + ' ChainId'"
      ></el-input>
      <section class="type mt10">Name</section>
      <el-input
        class="no-border"
        v-model="formData.name"
        type="text"
        :placeholder="$t('placeholder.input') + ' Name'"
      ></el-input>
    </section>
    <el-button class="mt20" type="primary" @click="Back">{{$t('title.back')}}</el-button>
    <el-button class="mt20 ml40" type="primary" @click="AddNode">{{$t('button.save')}}</el-button>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import BCX from "bcxjs-api";
import Storage from "../../utils/storage";
import utils from "../../utils/utils";
export default {
  name: "baseSetting",
  data() {
    return {
      nodes: [],
      node: "",
      choose: "",
      formData: {
        ws: "",
        faucet_url: "",
        chainId: "",
        name: "",
        type: 2
      },
      add: true,
      selected: "",
      edit: false,
      changeNode: false
    };
  },
  methods: {
    ...mapActions("account", ["logoutBCXAccount"]),
    ...mapActions("wallet", ["deleteWallet"]),
    ...mapActions(["apiConfig", "switchAPINode", "init"]),
    changeSelectNode(selected) {
      this.nodes.forEach((item, index) => {
        if (item.ws === selected) {
          this.choose = index;
          this.edit = item.type === "0" ? true : false;
        }
      });
    },
    onSubmit() {
      if (
        this.nodes[this.choose].chainId === Storage.get("choose_node").chainId
      ) {
        this.switchAPINode({
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
        utils.init(Node);
        this.init().then(res => {
          if (res.code !== 1) {
            this.$kalert({
              message: this.$i18n.t(`error[${res.code}]`)
            });
            this.apiConfig(this.nodes[0]).then(() => {
              this.init().then(res => {
                this.switchAPINode({
                  url: this.nodes[0].ws
                }).then(api => {
                  this.apiConfig(this.nodes[0]);
                });
              });
            });
          }
        });
      }
    },
    Back() {
      this.add = !this.add;
      let add_node = Storage.get("add_node");
      add_node.forEach((item, index) => {
        if (item.id === this.formData.id) {
          this.formData = add_node[index];
        }
      });
    },
    Add(adit) {
      this.add = !this.add;
      if (adit === "edit") {
        this.ContractNode();
        this.formData = this.nodes[this.choose];
        this.changeNode = true;
      } else {
        this.changeNode = false;
        this.formData = {
          ws: "",
          faucet_url: "",
          chainId: "",
          name: "",
          type: 2
        };
      }
    },
    ContractNode() {
      this.nodes = Storage.get("node").concat(
        Storage.get("add_node") ? Storage.get("add_node") : []
      );
    },
    DeleteNode() {
      let add_node = Storage.get("add_node");
      add_node.forEach((item, index) => {
        if (item.id === this.formData.id) {
          add_node.splice(index, 1);
          Storage.set("add_node", add_node);
          this.ContractNode();
        }
      });
      this.add = !this.add;
      let choose = Storage.get("choose_node");
      this.selected = choose.ws;
      this.changeSelectNode(this.selected);
    },
    AddNode() {
      if (
        !this.formData.ws ||
        !this.formData.faucet_url ||
        !this.formData.chainId ||
        !this.formData.name
      ) {
        this.$kalert({
          message: this.$i18n.t("error[101]")
        });
        return;
      }
      //edit
      if (this.changeNode) {
        let add_node = Storage.get("add_node");
        add_node.forEach((item, index) => {
          if (item.id === this.formData.id) {
            add_node[index] = this.formData;
            Storage.set("add_node", add_node);
            this.ContractNode();
          }
        });
        this.add = !this.add;
      } else {
        this.formData.type = 2;
        this.formData.id = utils.uuid();
        let add_node = Storage.get("add_node") ? Storage.get("add_node") : [];
        add_node.push(this.formData);
        Storage.set("add_node", add_node);
        this.nodes = Storage.get("node").concat(
          Storage.get("add_node") ? Storage.get("add_node") : []
        );
        this.add = !this.add;
      }
    }
  },
  mounted() {
    this.ContractNode();
    let choose = Storage.get("choose_node");
    choose.connect = false;
    this.edit = choose.type === "0" ? true : false;
    this.apiConfig(choose);
    this.selected = choose.ws;
    this.nodes.forEach((item, index) => {
      if (item.ws === this.selected) {
        this.choose = index;
      }
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/settings.scss";
.base {
  display: flex;
  flex-direction: column;
  position: relative;
  .position {
    position: absolute;
    right: 0;
    top: -22px;
    z-index: 100;
  }
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
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .add-node {
    height: 40px !important;
    width: 100px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    // line-height: 45px !important;
    font-size: 16px !important;
  }
}
</style>