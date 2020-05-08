<style scoped>
</style>
<template>
  <div>
    <slot>12</slot>
  </div>
</template>
<script>
import store from '@/store'
export default {
  props: {
    has_back: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    store.dispatch('SetBack', this.has_back)
  }
}
</script>
