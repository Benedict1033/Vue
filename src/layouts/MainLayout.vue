<template>
  <q-layout view="hHh lpR fFf">

    <!-- Header Bar -->
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" v-if="isLoggedIn()" @click="toggleLeftDrawer" />
        <q-toolbar-title>HelloAuth</q-toolbar-title>
        <q-btn dense flat round icon="logout" v-if="isLoggedIn()" @click="logout()" to="login" />
      </q-toolbar>
    </q-header>

    <!-- Hamburger Menu -->
    <q-drawer v-model="leftDrawerOpen" side="left" :width="200" v-if="isLoggedIn()">
      <q-scroll-area class="fit bg-grey-2">
        <q-list padding class="menu-list">

          <q-item>
            <!-- <q-item-section avatar><q-icon name="build" /></q-item-section> -->
            <q-item-section><b>Home</b></q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/home" @click="resetGlobalApply(), toggleLeftDrawer()">
            <q-item-section avatar><q-icon name="home" /></q-item-section>
            <q-item-section>Home Page</q-item-section>
          </q-item>

          <q-item>
            <!-- <q-item-section avatar><q-icon name="build" /></q-item-section> -->
            <q-item-section><b>DB Admin</b></q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/Management" @click="resetGlobalApply(), toggleLeftDrawer()">
            <q-item-section avatar><q-icon name="build" /></q-item-section>
            <q-item-section>DB Management</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/Mapping" @click="resetGlobalApply(), toggleLeftDrawer()">
            <q-item-section avatar><q-icon name="send" /></q-item-section>
            <q-item-section>DB Mapping</q-item-section>
          </q-item>

          <q-item>
            <q-item-section><b>Sys Admin</b></q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/API" @click="resetGlobalApply(), toggleLeftDrawer()">
            <q-item-section avatar><q-icon name="inbox" /></q-item-section>
            <q-item-section>API Mapping</q-item-section>
          </q-item>

          <q-item>
            <!-- <q-item-section avatar><q-icon name="build" /></q-item-section> -->
            <q-item-section><b>Admin</b></q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/Role" @click="resetGlobalApply(), toggleLeftDrawer()">
            <q-item-section avatar><q-icon name="people" /></q-item-section>
            <q-item-section> Role Assign </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref, inject } from 'vue'
import { SessionStorage } from 'quasar'

export default {
  setup() {
    const mapGlobalState = inject("mapGlobalState");
    const { setApplyData, setUserRights } = mapGlobalState;
    const leftDrawerOpen = ref(false)

    const resetGlobalApply = () => {
      setApplyData(0, "")
    }

    const logout = () => {
      SessionStorage.clear()
      setUserRights({})
      window.location.reload()
    }

    const isLoggedIn = () => {
      let login = SessionStorage.getItem("Login")
      // console.log(login)
      return login
    }

    return {
      leftDrawerOpen,
      resetGlobalApply,
      logout,
      isLoggedIn,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  }
}
</script> 

<style>
/* 隐藏垂直滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>