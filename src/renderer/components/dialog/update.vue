<template>
  <section class="panel">
    <section class="update-content" v-if="need_update">
      <section class="update">
        <span>{{$t('title.version')}}:</span>
        <div>{{updateMessage.version}}</div>
      </section>
      <section class="update">
        <span>{{$t('title.updateLog')}}:</span>
        <div class="list">
          <p v-for="(item,index) in des" :key="index">{{index + 1}}.{{item}}</p>
        </div>
      </section>
      <section class="btns mt40">
        <el-button
          v-if="!updateMessage.is_force && !cancel"
          @click="setUpdate(false)"
        >{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="Update()">{{$t('title.update')}}</el-button>
      </section>
    </section>
    <section class="no-update" v-else>
      <section>{{$t('title.newUpdate')}}</section>
      <section>
        <span>{{$t('label.version')}}:</span>
        {{version}}
      </section>
    </section>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { shell, remote } from "electron";
export default {
  name: "Update",
  props: ["cancel"],
  data() {
    return {
      des: [],
      need_update: false,
      version: ""
    };
  },
  mounted() {
    this.UpdateVersion().then(() => {
      this.des =
        this.$i18n.locale === "ZH"
          ? this.updateMessage.info.split(";")
          : this.updateMessage.en_info.split(";");
      this.need_update =
        this.updateMessage.version > remote.app.CocosDesktop ? true : false;
      this.version = remote.app.CocosDesktop;
    });
  },
  computed: {
    ...mapState(["updateMessage", "update"])
  },
  methods: {
    ...mapMutations(["setUpdate", "setupdateMessage"]),
    ...mapActions(["UpdateVersion"]),
    Update() {
      this.setUpdate(false);
      shell.openExternal(this.updateMessage.download_url);
    }
  }
};
</script>
<style lang="scss" scoped>
.update-content {
  display: flex;
  flex-direction: column;
  .update {
    span {
      min-width: 100px;
    }
    display: flex;
    margin: 10px 0 0 5px;
    font-size: 15px;
    div {
      margin-left: 10px;
    }
    line-height: 30px;
  }
  .list {
    display: flex;
    flex-direction: column;
    p {
      line-height: 30px;
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    .el-button {
      // height: 40px !important;
      width: 210px !important;
    }
  }
}
.no-update {
  font-size: 16px;
  section {
    line-height: 40px;
  }
}
</style>
