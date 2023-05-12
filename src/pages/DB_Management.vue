<template>
  <q-toolbar class="bg-grey-3">
    <q-toolbar-title><q-icon name="build" /> &nbsp; DB Management</q-toolbar-title>
  </q-toolbar>

  <div class="q-pa-md">
    <q-table :columns="columns" :rows="rows" row-key="DBName" @row-click="selectedRow = $event.row"
      v-model:expanded="expanded">

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <q-toggle v-if="col.name === 'toggle'" v-model="isAllCollapsed" checked-icon="arrow_drop_up"
              unchecked-icon="arrow_drop_down" @click="toggleExpandAll"></q-toggle>
            <span v-else v-html="col.label"></span>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-toggle v-model="props.expand" checked-icon="arrow_drop_up" unchecked-icon="arrow_drop_down" />
          </q-td>
          <q-td key="DBName" class="dbName">{{ props.row.DBName }}</q-td>
          <q-td key="ConnectionString" class="connection-string">{{ props.row.ConnectiongString }}</q-td>
          <q-td key="Deadline">{{ props.row.Deadline }}</q-td>
          <q-td key="Actions">
            <q-btn color="secondary" style="margin-left: 5px; width: 30px;" icon="edit"
              @click="showDetails(props.row.DBName)" />
            <q-btn color="deep-orange-9" style="margin-left: 5px; width: 30px;" icon="delete"
              @click="confirmDelete(props.row.DBName)" />
          </q-td>

        </q-tr>

        <q-tr v-show="props.expand" :props="props" style="background-color: #fff4e7;">
          <q-td key="Show"></q-td>
          <q-td key="DBName"></q-td>
          <q-td key="ConnectionString" class="connection-string">{{ props.row.BackupConnectiongString }}</q-td>
          <q-td key="Deadline">{{ props.row.BackupDeadline }}</q-td>
          <q-td key="Actions"></q-td>
        </q-tr>
      </template>

    </q-table>

    <q-card-actions>
      <q-btn label="ADD" color="primary" @click="showDialog" style="width:110px" icon="add" />
    </q-card-actions>

    <q-dialog v-model="show_dialog" full-width>
      <q-card>

        <q-card-section>
          <q-card-section v-if="isEditing === false">
            <div class="text-h6">Add Connectiong String</div>
          </q-card-section>

          <q-card-section v-if="isEditing === true">
            <div class="text-h6">Update Connectiong String</div>
          </q-card-section>

          <div class="row">
            <q-input style=" width: 30%;; margin-left: 20px; " v-model="columns.DBName" label="DB Name"></q-input>
            <q-input style=" width: 75%; margin-left: 20px;" v-model="columns.ConnectiongString"
              label="First Connection String"></q-input>

            <q-input style=" width: 15%; margin-left: 10px;" v-model="columns.Deadline"
              label="First Expire Date"></q-input>
            <q-btn style="margin-top: 15px; margin-left: 8px;width: 35px;  height: 30px;" icon="event">
              <q-popup-proxy @before-show="updateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="proxyDate">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>

            <q-input style=" width: 75%;margin-left: 20px;" v-model="columns.ConnectionString2"
              label="Second Connection String"></q-input>

            <q-input style=" width: 15%; margin-left: 10px;" v-model="columns.Deadline2"
              label="Second Expire Date"></q-input>
            <q-btn style="margin-top: 15px; margin-left: 8px; width: 35px;  height: 30px;" icon="event">
              <q-popup-proxy @before-show="updateProxy2" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="proxyDate">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn label="OK" color="primary" flat @click="save2" v-close-popup />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>

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

    const selectedData = ref([])

    const today = new Date()
    const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`

    const date = ref(formattedDate)
    const proxyDate = ref(formattedDate)

    const date2 = ref(formattedDate)
    const proxyDate2 = ref(formattedDate)

    // ----------- 以下區塊是Data --------------- //
    const rows = ref([])

    const columns = ref([
      // { name: 'No', align: 'left', label: 'No', field: 'No' },
      { name: 'toggle', align: 'left', label: "", field: 'Show' },
      { name: 'DBName', align: 'left', label: 'DB Name', field: 'DBName', sortable: true },
      { name: 'ConnectiongString', align: 'left', label: 'Connection String', field: 'ConnectiongString' },
      { name: 'Deadline', align: 'left', label: 'Expire Date', field: 'Deadline' },
      { name: 'Actions', align: 'left', label: 'Actions', field: 'Actions' },
    ])

    // ----------- 以下區塊是API的串接 --------------- //
    onMounted(async () => {
      const response = await fetch('https://localhost:44350/api/query_db')
      rows.value = await response.json()

    })

    const addData = () => {
      if (columns.value.DBName === "" || columns.value.ConnectiongString === "" || columns.value.ConnectionString2 === "" || columns.value.Deadline === "" || columns.value.Deadline2 === "") {
        notifyError("Value can't be null");
      }
      else {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "DBName": columns.value.DBName,
            "ConnectiongString": columns.value.ConnectiongString,
            "ConnectiongString2": columns.value.ConnectionString2,
            "Deadline": columns.value.Deadline,
            "Deadline2": columns.value.Deadline2
          })
        };
        fetch('https://localhost:44350/api/create_db', requestOptions)
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
      if (columns.value.DBName === "" || columns.value.ConnectiongString === "" || columns.value.ConnectionString2 === "" || columns.value.Deadline === "" || columns.value.Deadline2 === "") {
        notifyError("Value can't be null");
      }
      else {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "DBName": columns.value.DBName,
            "ConnectiongString": columns.value.ConnectiongString,
            "ConnectiongString2": columns.value.ConnectionString2,
            "Deadline": columns.value.Deadline,
            "Deadline2": columns.value.Deadline2
          })
        };
        fetch('https://localhost:44350/api/update_db', requestOptions)
          .then(response => { return response.text(); })
          .then(data => {
            if (data === '"Updated Success"')
              window.location.reload()
            else
              notifyError(data)
          });
      }
    }

    const deleteRow = (DBName) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "DBName": DBName,
          "ConnectiongString": columns.value.ConnectiongString,
          "ConnectiongString2": columns.value.ConnectionString2,
          "Deadline": columns.value.Deadline,
          "Deadline2": columns.value.Deadline2
        })
      };
      fetch('https://localhost:44350/api/delete_db', requestOptions)
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
      columns.value.DBName = ''
      columns.value.ConnectiongString = ''
      columns.value.ConnectionString2 = ''
      columns.value.Deadline = ''
      columns.value.Deadline2 = ''

      show_dialog.value = !show_dialog.value
      isEditing.value = false
    }

    const showDetails = (DBName) => {
      selectedData.value = this.rows.find(row => row.DBName === DBName)

      columns.value.DBName = selectedData.value.DBName
      columns.value.ConnectiongString = selectedData.value.ConnectiongString
      columns.value.ConnectionString2 = selectedData.value.BackupConnectiongString
      columns.value.Deadline = selectedData.value.Deadline
      columns.value.Deadline2 = selectedData.value.BackupDeadline

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
      today,
      formattedDate,
      date,
      proxyDate,

      date2,
      proxyDate2,

      updateProxy() {
        proxyDate.value = date.value
      },

      save() {
        date.value = proxyDate.value
        columns.value.Deadline = proxyDate.value;
      },

      updateProxy2() {
        proxyDate2.value = date.value
      },

      save2() {
        date2.value = proxyDate.value
        columns.value.Deadline2 = proxyDate.value;
      }
    }
  }
}
</script>

<style>
.connection-string {
  max-width: 650px;
}

.dbName {
  max-width: 130px;
}

.q-table tbody td {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>