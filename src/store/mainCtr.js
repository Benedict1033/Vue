var state = {
    extend: false,
    progress: false,
    snackBar: { type: "", message: "" },
    alert: { type: "", message: "", dialog: false },
    confirm: { type: "", message: "", dialog: false },
    confirmDial: { type: "", phoneNo: "", dialog: false },
    confirmYesNo: { type: "", message: "", dialog: false },
    alertOption: { type: "", message: "", dialog: false },
    marqueeData: null,
    recordPlayerData: { dialog: false, record: null, recordUrl: "" },
    notify: {
      type: "",
      schedId: 0,
      title: "",
      text: "",
      dialog: false,
      entity: {},
    },
  
    sso: false,
    isSave: true,
    isBlack: false,
    ring: false,
    screenPop: 0,
    clean: 0,
    autoSave: 0,
    authPwdStatus: false,
  
    marqueeUpdateTime: "",
    remindMin: 5,
    delayAgainSchedTime: 0,
    auxMaxMin: 0,
    auxWarn: "",
    queueEnable: null,
    auxEnable: null,
  
    scheduleData: [],
    scheduleMiss: 0,
    scheduleR: 0,
  };
  
  var getters = {};
  
  var actions = {
    actCloseAlert({ commit }) {
      commit("mutAlertCtrl", false);
    },
    actCloseAlertOption({ commit }) {
      commit("mutAlertOptionCtrl", false);
    },
    actCloseConfirm({ commit }) {
      commit("mutConfirmCtrl", false);
    },
    actCloseConfirmDial({ commit }) {
      commit("mutConfirmDialCtrl", false);
    },
    actCloseConfirmYesNo({ commit }) {
      commit("mutConfirmYesNoCtrl", false);
    },
  };
  
  var mutations = {
    mutAlertCtrl: function (state, Status) {
      state.alert.dialog = Status;
    },
    mutAlertOptionCtrl: function (state, Status) {
      state.alertOption.dialog = Status;
    },
    mutConfirmCtrl: function (state, Status) {
      state.confirm.dialog = Status;
    },
    mutConfirmDialCtrl: function (state, Status) {
      state.confirmDial.dialog = Status;
    },
    mutConfirmYesNoCtrl: function (state, Status) {
      state.confirmYesNo.dialog = Status;
    },
  };
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  };
  