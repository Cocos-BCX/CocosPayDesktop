<template>
  <section class="avatar" ref="container"></section>
</template>
<script>
import jazzicon from 'jazzicon'
export default {
  name: 'k-avatar',
  props: {
    name: {
      type: [String, Number],
      required: true
    },
    diameter: {
      type: Number,
      default: 30
    }
  },
  mounted () {
    this.generateJazzicon()
  },
  methods: {
    generateJazzicon () {
      const seed = parseInt(this.name, 16)
      const identicon = jazzicon(this.diameter, seed)
      const cleanCopy = identicon.cloneNode(true)
      if (this.$refs.container.firstChild) {
        this.$refs.container.removeChild(this.$refs.container.firstChild)
      }
      this.$refs.container.appendChild(cleanCopy)
    }
  },
  watch: {
    'name': function () {
      this.generateJazzicon()
    }
  }
}
</script>
<style lang="scss" scoped>
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
