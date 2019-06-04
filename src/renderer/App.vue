<template>
  <div id="app">
    <div class="loading" v-show="loading">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon">
        <path
          d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
        ></path>
      </svg>
    </div>
    <transition>
      <router-view :key="key"/>
    </transition>
    <Dialogs/>
  </div>
</template>
<script>
import Dialogs from "./components/dialog/dialog";
import { mapState } from "vuex";
import Storage from "./utils/storage";
export default {
  name: "root",
  components: {
    Dialogs
  },
  computed: {
    ...mapState(["loading"]),
    key: function() {
      return this.$route.name !== undefined
        ? this.$route.name + "" + new Date()
        : this.$route + "" + new Date();
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.icon {
  display: inline-block;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  width: 1em;
  height: 1em;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-size: 40px;
  color: #616161;
  z-index: 100000;
}
.loading .icon {
  -webkit-animation: spin 2s infinite linear;
  animation: spin 2s infinite linear;
}
</style>
