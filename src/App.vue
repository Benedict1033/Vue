<template>
  <div id="q-app">
    <router-view />
  <snackBar></snackBar>
    </div>
 
</template>
<script>
import { provide } from "vue";
import globalState from "./store/global";
import applicateionState from "./store/application";
import snackBar from 'components/snackBar'
export default ({
  name: "App",
  components: {
     snackBar,
  },
  setup(){
    provide("mapGlobalState", globalState);
    provide("mapApplcation", applicateionState);
  }
});
</script>
