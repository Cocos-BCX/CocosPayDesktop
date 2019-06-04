<template>
  <header>
    <img src="../assets/img/logo.png" @click="logoutBCXAccount" alt>
  </header>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'logo-header',
  methods: {
    ...mapActions('account', ['logoutBCXAccount'])
  }
}
</script>
<style lang="scss" scoped>
header {
  position: relative;
  height: 216px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    90deg,
    rgba(48, 191, 253, 1) 0%,
    rgba(58, 123, 255, 1) 100%
  );
  span {
    font-size: 20px;
    padding-left: 10px;
  }
  img {
    // height: 125px;
    width: 134px;
  }
}
</style>
