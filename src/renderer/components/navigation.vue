<template>
  <nav>
    <section @click="goBack">
      <span>
        <i class="left-arrow"></i>
      </span>
      <span class="title">{{$t('title.back')}}</span>
    </section>
  </nav>
</template>
<script>
export default {
  name: "navigation",
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
nav {
  position: relative;
  padding: 0 36px;
  border-bottom: 1px solid rgba(230, 233, 238, 1);
  height: 60px;
  width: 100%;
}
section {
  display: flex;
  align-items: center;
  height: 60px;
  width: 90px;
  cursor: pointer;
}
.title {
  margin-left: 8px;
  text-align: center;
  font-size: 18px;
  color: rgba(45, 45, 48, 1);
}
</style>
