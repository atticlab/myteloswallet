<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications transition-name="notification-list" transition-mode="out-in">

    </notifications>
    <router-view name="header"></router-view>
    <transition name="fade"
                mode="out-in">
      <router-view  ></router-view>
    </transition>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
  import ScatterJS from 'scatterjs-core'
  import ScatterEOS from 'scatterjs-plugin-eosjs'

  export default {}
</script>
<style lang="scss">

</style>
