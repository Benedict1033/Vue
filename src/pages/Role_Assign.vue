<template>
  <q-toolbar class="bg-grey-3">
    <q-toolbar-title><q-icon name="people" /> &nbsp; Role Assign</q-toolbar-title>
  </q-toolbar>

  <div class="q-pa-md">
    <q-table :columns="columns" :rows="rows" row-key="UserMail" @row-click="selectedRow = $event.row"
      v-model:expanded="expanded">

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <span v-html="col.label"></span>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="UserMail">{{ props.row.UserMail }}</q-td>
          <q-td key="RoleRight">{{ props.row.RoleRight }}</q-td>
          <q-td key="Actions">
            <q-btn color="secondary" style="margin-left: 5px; width: 30px;" icon="edit"
              @click="showDetails(props.row.UserMail)" />
            <q-btn color="deep-orange-9" style="margin-left: 5px; width: 30px;" icon="delete"
              @click="confirmDelete(props.row.UserMail)" />
          </q-td>
        </q-tr>
      </template>

    </q-table>

    <q-card-actions>
      <q-btn label="ADD" color="primary" @click="showDialog" style="width:110px" icon="add" />
    </q-card-actions>

    <q-dialog v-model="show_dialog" full-width>
      <q-card>

        <q-card-section>
          <div class="text-h6">Update Role Right!</div>
        </q-card-section>

        <q-card-section>
          <div class="row">
            <q-input style=" width: 60%;; margin-left: 25px; " v-model="columns.UserMail" label="UserMail"></q-input>
            <!-- <q-input style=" width: 20%; margin-left: 5px;" v-model="columns.RoleRight" label="RoleRight"></q-input> -->
            <q-select style=" width: 30%; margin-left: 25px;" v-model="selectedOption" :options="options"
              label="Select an option" filled />
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="OK" color="primary" v-close-popup @click="isEditing ? updateData() : addData()"></q-btn>
        </q-card-actions>

      </q-card>
    </q-dialog>

  </div>
</template>
  
<script>
import { ref, onMounted } from 'vue'
import useNotify from 'src/composables/useNotify'
export default {
  data() {
    // ----------- 以下區塊是變數宣告 --------------- //
    const { notifyError } = useNotify()

    const show_dialog = ref(false)
    const isEditing = ref(false)

    const expanded = ref([])
    const isAllCollapsed = ref(false)

    // const reversedRows = ref([])
    const selectedData = ref([])

    const selectedOption = ref(null)
    const UserMail = ref("")


    // ----------- 以下區塊是Data --------------- //
    const rows = ref([])

    const columns = ref([
      // { name: 'No', align: 'left', label: 'No', field: 'No' },
      { name: 'UserMail', align: 'left', label: 'UserMail', field: 'UserMail' },
      { name: 'UserRight', align: 'left', label: 'UserRight', field: 'UserRight' },
      { name: 'Actions', align: 'left', label: 'Actions', field: 'Actions' },
    ])

    // ----------- 以下區塊是API的串接 --------------- //
    onMounted(async () => {
      const response = await fetch('https://localhost:44350/api/query_user')
      rows.value = await response.json()

      console.log(rows.value)
      // reversedRows.value = [...rows.value].reverse()

    })

    const addData = () => {
      if (columns.value.UserMail === "" || this.selectedOption === null) {
        notifyError("Value can't be null");
      }
      else {

        if (columns.value.UserMail === "Admin") {

        } else {
          UserMail.value = columns.value.UserMail + "@makalot.com"

        }

        columns.value.UserRight = this.selectedOption

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "UserMail": UserMail.value,
            "UserRight": columns.value.UserRight,
          })
        };
        fetch('https://localhost:44350/api/create_right', requestOptions)
          .then(response => { return response.text(); })
          .then(data => {
            if (data === '"Create Success"')
              window.location.reload()
            else
              notifyError(data)
          });
      }
    }

    const updateData = () => {
      if (this.selectedOption === null) {
        notifyError("Value can't be null");
      }
      else {

        columns.value.UserRight = this.selectedOption

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "UserMail": columns.value.UserMail,
            "UserRight": columns.value.UserRight,
          })
        };
        fetch('https://localhost:44350/api/update_right', requestOptions)
          .then(response => { return response.text(); })
          .then(data => {
            if (data === '"Updated Success"')
              window.location.reload()
            else
              notifyError(data)

          });
      }
    }

    const deleteRow = (UserMail) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "UserMail": UserMail,
        })
      };
      fetch('https://localhost:44350/api/delete_right', requestOptions)
        .then(window.location.reload());
    }

    // ----------- 以下區塊是操作畫面的Function --------------- //
    const confirmDelete = (DBName) => {
      if (window.confirm('確定要刪除此項目嗎？'))
        this.deleteRow(DBName);
    }

    const toggleExpandAll = () => {
      if (isAllCollapsed.value) {
        expanded.value = rows.value.map(row => row.DBName)
        isAllCollapsed.value = true
      }
      else {
        expanded.value = []
        isAllCollapsed.value = false
      }
    }

    const showDialog = () => {
      columns.value.UserMail = ''
      columns.value.RoleRight = ''

      show_dialog.value = !show_dialog.value
      isEditing.value = false
    }

    const showDetails = (UserMail) => {
      selectedData.value = this.rows.find(row => row.UserMail === UserMail)

      columns.value.UserMail = selectedData.value.UserMail
      columns.value.RoleRight = selectedData.value.RoleRight

      show_dialog.value = !show_dialog.value
      isEditing.value = true
    }

    return {
      columns,
      rows,

      addData,
      updateData,
      deleteRow,
      confirmDelete,

      expanded,
      isAllCollapsed,
      toggleExpandAll,

      show_dialog,
      showDialog,
      isEditing,
      showDetails,
      selectedOption,
      options: ['Admin', 'DBA', "SysAdmin", "user"],
      // 'SysAdmin',
      UserMail
    }
  }
}
</script>