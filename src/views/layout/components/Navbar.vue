<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <div class="avatar-container">
      <!--<screenfull class="screenfull" />-->
      <span class="refresh" @click="refresh"><svg-icon style="font-size: 18px; margin-bottom:-1px;margin-right: 5px" icon-class="shuaxin"/>刷新</span>
      <span v-if="hasBack" class="back" @click="back"><svg-icon style="font-size: 19px;margin-right: 5px" icon-class="back" /><span style="font-size: 12px">返回</span></span>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'hasBack'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    back() {
      sessionStorage.setItem('back', 1)
      this.$router.back(-1)
    },
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 46px;
  line-height: 46px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 54px;
    height: 46px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    font-size: 14px;
    display: inline-block;
  }
  .avatar-container {
    height: 46px;
    display: inline-block;
    position: absolute;
    right: 20px;
    .refresh{
      margin-left: 15px;
      cursor: pointer;
      font-size: 12px;
      .el-icon-refresh{
        font-size: 23px;
        vertical-align: middle;
        margin-bottom: 2px;
        color:#009494;
      }
    }
    .back{
      margin-left: 15px;
      cursor: pointer;
    }
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

