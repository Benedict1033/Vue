import globalState from "./global";

var MakalotGlobal = {
  mixinData: {
    data() {
      return {

      };
    },
    computed: {
      autoHeight() {
        return function (v) {
          if (v) {
            var h = window.innerHeight;
            return h - v + "px";
          } else {
            return window.innerHeight + "px";
          }
        };
      },
      autoWidth() {
        return function (v) {
          if (v) {
            var w = document.body.clientWidth;
            return w - v + "px";
          } else {
            return document.body.clientWidth + "px";
          }
        };
      },
      getOperInfo(data) {
        return EventusGlobal.getOperInfo(data);
      },
    },
    filters: {
      formatType(v) {
        return MakalotGlobal.formatType(v);
      },
      formatLocation(v) {
        return MakalotGlobal.formatLocation(v);
      },
      formatLocal(v) {
        return EventusGlobal.formatLocal(v);
      },
      formatAlertStatus(v) {
        return MakalotGlobal.formatAlertStatus(v);
      },
      formatBool(v) {
        return MakalotGlobal.formatBool(v);
      },
      formatCommas(v) {
        if (v >= 0) {
          return MakalotGlobal.formatCommas(v);
        }
      },

      trimText(v) {
        if (v != "" && v) {
          var t = v.trim();
          t = t.replace(/ /g, "");
          return t.replace(/ /g, "");
        }
      },
    },
  },
  trimText(v) {
    if (v != "" && v) {
      var t = v.trim();
      t = t.replace(/ /g, "");
      return t.replace(/ /g, "");
    }
  },
  oper() {
    return JSON.parse(sessionStorage.getItem("jsonObject"));
  },
  getOperInfo(data) {
    var loginStr = sessionStorage.getItem("jsonObject");
    if (loginStr) {
      var loginObject = JSON.parse(loginStr);

      data.oper = loginObject.operId;
      data.deptId = loginObject.deptId;
      data.deptName = loginObject.deptName;
    }
    return data;
  },


  setConfirm(message, methods) {
    var confirmObj = {};
    confirmObj.dialog = true;
    confirmObj.message = message;
    confirmObj.methods = methods;

    // mainCtr.state.confirm = confirmObj;
  },
  setAlert(message, type = "error", option = undefined) {
    var alertObj = {};
    alertObj.dialog = true;
    alertObj.message = message;
    alertObj.width = "40%";

    if (type == "success") {
      alertObj.title = "Welcome";
      alertObj.icon = "mdi-emoticon-happy-outline";
      alertObj.color = "green";
    } else if (type == "error") {
      alertObj.title = "ERROR";
      alertObj.icon = "mdi-emoticon-dead-outline";
      alertObj.color = "red";
    } else if (option != undefined) {
      alertObj.title = option.title;
      alertObj.icon = option.icon;
      alertObj.color = option.color;
    }
    // mainCtr.state.alert = alertObj;
  },
  setSnackBar(message, type = "negative", sys = "", duration=6000) {
    globalState.setSnackBar(type,message, duration);
  },

  isEmptyObj(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  },

  formatCommas(val) {
    var intVal = parseInt(val);
    if (intVal) {
      var aIntNum = intVal.toString().split(".");
      if (aIntNum[0].length >= 4) {
        aIntNum[0] = aIntNum[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
      }
      if (aIntNum[1] && aIntNum[1].length >= 4) {
        aIntNum[1] = aIntNum[1].replace(/(\d{3})/g, "$1 ");
      }
      return aIntNum.join(".");
    } else {
      return "";
    }
  },
  formatBool(value) {
    return value ? "✔️" : "✖️";
  },

  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  },
  arrayDiff(a, b) {
    return b.filter((i) => {
      return a.indexOf(i) < 0;
    });
  },
  getApConfig(key) {
    var configs = MakalotGlobal.oper().apConfig;
    return key == undefined ? configs : configs[key];
  },
};

export default MakalotGlobal;
