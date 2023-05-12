import { reactive, readonly } from "vue";
import axiosAPI from "../store/axiosAPI";
import PG from "../store/plugin"
import global from "../store/global"
import { Dialog } from 'quasar'

const gridList= reactive({
  data: [],
  loading: false,
  headers: [
    { name: 'action' },
    { name: 'no' , align: 'left', label: 'No'  },
    { name: 'assetNo', align: 'left', label: 'Asset Number', field: 'ASSETNUMBER', sortable: true },
    { name: 'category', align: 'left', label: 'Category', field: 'SUBCATEGORY', sortable: true },
    { name: 'machine', align: 'left', label: 'Machine', field: 'CATEGORYNAME' },
    { name: 'brand', align: 'left', label: 'Brand', field: 'BRAND' },
    { name: 'model', align: 'left', label: 'Model', field: 'MODEL_NUMBER' },
    { name: 'machineCode', align: 'left', label: 'Machine Code', field: 'MACHINECODE', sortable: true },
    { name: 'manage', align: 'left', label: 'Manage', field: 'MANAGE', sortable: true },
    { name: 'realLocation', align: 'left', label: 'Real Location', field: 'REALLOCATION_NAME', sortable: true }
  ],
  totalCount: 0,
})

const formData = reactive({
  ASSETS: [],
  FROMNAME: "",
  BUYERNAME: "",
  ID: null,
  REQUESTNO: "",
  LOCATIONID: null,
  LOCATIONNAME:null,
  BUYERID: null,
  STATUS: 1,
  APPLIER: null,
  CREATEDATE: null,
  LASTUPDATOR: null,
  LASTUPDATEDATE: null,
  HOAPPROVER: null,
  HOAPPROVEDATE: null,
})
const listLocation = reactive({
  locationData: [],
})
const listBuyer = reactive({
  buyerData: [],
})


const actGetLocation = (userCode) =>{
  return new Promise((resolve ,reject)=>{
  axiosAPI.instance
    .post("/listLocation?sUserCode=" + userCode)
    .then((response) => {
      if (response.data.Success) {
        if (response.data.Data != null && response.data.Data.length > 0) {
          listLocation.locationData = response.data.Data.filter(function(opts) {
            return opts.ATTRIBUTE4 == 'IND'
          });
        } else {
          listLocation.locationData = []
        }
        return resolve('')
      }else {
        actSetSanckBar(response.data.Message)
        return reject('')
      }
    })
    .finally(()=>{
      return reject('')
    })
  })
}

const actGetBuyer = () =>{
  return new Promise((resolve ,reject)=>{
  axiosAPI.instance
    .post("/listBuyer")
    .then((response) => {
      if (response.data.Success) {
        if (response.data.Data != null && response.data.Data.length > 0) {
          listBuyer.buyerData = response.data.Data;
        } else {
          listBuyer.buyerData = [];
        }
        return resolve('')
      }else {
            actSetSanckBar(response.data.Message)
      }
      return reject('')
    })
    .finally(()=>{
      return reject('')
    })
  })
}

const actGetApplication =(apply) =>{
  formData.BUYERID = null
  formData.LOCATIONID = null
  formData.STATUS = null
  formData.ID = null
  formData.REQUESTNO = null
  formData.APPLIER = null
  formData.CREATEDATE = null
  formData.FROMNAME = null
  formData.BUYERNAME = null
  gridList.data = []

  return new Promise((resolve ,reject)=>{
    if (apply != null){
      if (apply.applyId != undefined && (apply.applyId != 0 || apply.requestNo != "")){
        var url = "/GetApplicationByID/" + apply.applyId
        if (apply.requestNo != "" )
        url = "/GetApplicationByNo/" + apply.requestNo
        axiosAPI.instance
          .post(url)
          .then((response) => {
            if (response.data.Success) {
              if (response.data.Data != null) {
                formData.BUYERID = response.data.Data.BUYERID
                formData.LOCATIONID = response.data.Data.LOCATIONID
                formData.STATUS = response.data.Data.STATUS
                formData.ID = response.data.Data.ID
                formData.REQUESTNO = response.data.Data.REQUESTNO
                formData.APPLIER = response.data.Data.APPLIER
                formData.CREATEDATE = response.data.Data.CREATEDATE
                formData.FROMNAME = response.data.Data.FROMNAME
                formData.BUYERNAME = response.data.Data.BUYERNAME
                gridList.data = response.data.Data.ASSETS
              }
            }
            else {
              PG.setSnackBar(response.data.Message)
            }
            return resolve('')
          })
          .catch ((ex) => {
            console.log(ex)
            return reject('')
          })
      }
      else
       return resolve('')
    }
  })
}

const actDelete = (data, type) =>{
  var title = ""
  if (type == -2){
    title = 'Would you like to reject application?'
  }else if (type == -1){
    title = 'Would you like to delete application?'
  }
  return new Promise((resolve ,reject)=>{
    Dialog.create({
      title: 'Confirm',
      message: title,
      cancel: true,
      persistent: true
    }).onOk(() => {
      actSave(data, type).then(()=> resolve("resolve"));
    }).onCancel(() => {
      // console.log('>>>> Cancel')
    })
  })
}

const actSave = (data, type, _callback) =>{
  PG.setSnackBar("reset")
  // check formdata not null
  if (data.LOCATIONID == null || data.LOCATIONID ==  "" || data.LOCATIONID == 0 ){
    PG.setSnackBar("Form Location can't be empty", "negative")
  }
  else if (data.BUYERID == null || data.BUYERID ==  "" ||  data.LOCATIONID == 0){
    PG.setSnackBar("Buyer can't be empty", "negative")
  }
  else if (gridList.data.length == 0 && (type == 1 || type == 2)){
    PG.setSnackBar("Asset can't be empty", "negative")
  }
  else  {
    return new Promise((resolve ,reject)=>{
      const dialog = Dialog.create({
        message: 'Uploading...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })
      data.ASSETS = gridList.data
      data.STATUS = type
      data.APPLIER = data.LASTUPDATOR = global.userInfo.userName

      var title = ''
      var message = ''
      if (type == 1 ){
        title = 'The application is saved, please click confirm to send.'
      } else if (type == 2){
        title = 'The application is sent, please wait approval from HO.'
      } else if (type ==3){
        title = 'The application is approved.'
        data.HOAPPROVER = global.userInfo.userName
      } else if (type == -2){
        title = 'The application is rejected.'
        data.HOAPPROVER = global.userInfo.userName
      }else if (type == -1){
        title = 'The application is deleted.'
      }

      axiosAPI.instance
      .post("/Save", data )
      .then((response) => {
        if (response.data.Success) {
          if (response.data.Data != null){
            var msg = ''
            if (formData.REQUESTNO == null || formData.REQUESTNO == undefined || formData.REQUESTNO =='')
              msg = 'Application No. ' +  response.data.Data.REQUESTNO
            formData.REQUESTNO = response.data.Data.REQUESTNO
            formData.ID = response.data.Data.ID
            dialog.update({
              title: title,
              message: msg,
              progress: false,
              ok: true
            })

          }
          else
            dialog.hide()
          resolve("Resolved");
        }
        else {
          dialog.update({
            title: 'The application sent error, please check with MIS.',
            message: response.data.Message,
            progress: false,
            ok: true
          })
        }
        resolve("Resolved");
      })
      .catch((ex)=>{
        dialog.update({
          title: 'The application sent error, please check with MIS.',
          message: ex,
          progress: false,
          ok: true
        })
        dialog.hide()
        reject("Rejected")
      })
    })
  }
}
const actSetSanckBar=(message, type = "negative")=>{
  PG.setSnackBar(message, type)
}

export default {
  gridList: gridList,
  formData: formData,
  listLocation: listLocation,
  listBuyer:listBuyer,
  statusOptions : readonly([
    {
      id: '1',
      desc: 'Save Temp'
    },
    {
      id: '2',
      desc: 'Waiting HO Approve'
    },
    {
      id: '3',
      desc: 'HO Approved'
    },
    {
      id: '-1',
      desc: 'Deleted'
    },
    {
      id: '-2',
      desc: 'HO Rejected'
    },
  ]),
  actGetApplication,
  actSave,
  actSetSanckBar,
  actDelete,
  actGetLocation,
  actGetBuyer
};
