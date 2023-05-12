<template>
    <div>
    </div>
  </template>
  
  <script>
  import { useQuasar } from 'quasar'
  import { inject ,toRefs,watch  } from 'vue'
  
  export default {
    setup(){
      const $q = useQuasar()
      const mapGlobalState = inject("mapGlobalState");
      const { snackBar } = mapGlobalState;
  
      watch(()=>snackBar.message, function() {
        if (snackBar.message != "reset"){
           $q.notify({
            group: 'my-group',
            position: 'center',
            type: snackBar.type,
            message: snackBar.message,
            timeout: snackBar.duration,
          })
          }
        }
        ,{ deep: true }
      );
  
    return {
         ...toRefs(snackBar),
      }
    },
  
  };
  </script>
  
  <style lang="scss" scoped>
  .my_warn {
    background: #ffffbb;
    opacity: 0.8;
    border: 2px solid #ffff80;
  }
  
  .my_error {
    background: #ffd7d7;
    opacity: 1;
    border: 2px solid #ffbfbf;
  }
  
  .my_success {
    background: #e8f9f0;
    opacity: 0.95;
    border: 2px solid #d0f2e1;
  }
  
  .my_tmp {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    text-align: left;
    font-size: 13px;
    margin: 5px;
    margin-bottom: 0;
    align-items: center;
    justify-content: center;
    &,
    & > div {
      box-sizing: border-box;
    }
  
    .my_tmp-close {
      flex: 0 1 auto;
      padding: 0 20px;
      font-size: 16px;
      opacity: 0.2;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
    .my_tmp-title {
      letter-spacing: 1px;
      font-size: 10px;
      font-weight: 600;
    }
    .my_tmp-content {
      padding: 10px;
      flex: 1 0 auto;
    }
  }
  
  .v-fade-left-enter-active,
  .v-fade-left-leave-active,
  .v-fade-left-move {
    transition: all 0.5s;
  }
  
  .v-fade-left-enter,
  .v-fade-left-leave-to {
    opacity: 0;
    transform: translateX(-500px) scale(0.2);
  }
  </style>
  