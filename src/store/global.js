import { reactive, readonly } from "vue";
import { date } from 'quasar'

const snackBar = reactive({
  type: "",
  message: "",
  duration:1000,
  isShow:false
});

const apply = reactive({
  applyId:0,
  requestNo:"",
})

const userInfo = reactive({
  userName:"",
  password:"",
  userID:0,
  userRights:[]
})

const history = reactive({
  formUrl:"",
  query:{},
})

//actions
const setSnackBar = (_type, _message, _duration, _isShow) => {
  snackBar.type = _type
  snackBar.message = _message
  snackBar.duration = _duration
  snackBar.isShow  = _isShow
};

const setApplyData= (_id, _requestno) =>{
  apply.applyId = _id,
  apply.requestNo = _requestno
}

const setUserRights= (_rights) =>{
  userInfo.password = "",
  userInfo.userID = (_rights!= null &&  _rights[0] != undefined )?_rights[0].ID: 0,
  userInfo.userRights = _rights
}

const setToUrl= (_url, _query) =>{
  history.formUrl = _url;
  history.query = _query
}

const dateformat=((data)=>{
  return date.formatDate(data, 'YYYY-MM-DD HH:mm:ss')
})

export default {
  snackBar: readonly(snackBar),
  apply: readonly(apply),
  userInfo: userInfo,
  history: readonly(history),
  setSnackBar,
  setApplyData,
  setUserRights,
  setToUrl,
  dateformat,
};
