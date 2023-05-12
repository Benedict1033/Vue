<template>
    <q-toolbar class="bg-grey-3">
        <q-toolbar-title><q-icon name="inbox" /> &nbsp; API Mapping</q-toolbar-title>
    </q-toolbar>

    <div class="q-pa-md">
        <q-table :columns="columns" :rows="rows" row-key="SystemName" @row-click="selectedRow = $event.row"
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
                    <q-td key="SystemName" class="systemName">{{ props.row.SystemName }}</q-td>
                    <q-td key="APIName" class="APIName">{{ props.row.APIName }}</q-td>
                    <q-td key="Actions">
                        <q-btn color="secondary" style="margin-left: 5px; width: 30px;" icon="edit"
                            @click="showDetails(props.row.SystemName)" />
                        <q-btn color="deep-orange-9" style="margin-left: 5px; width: 30px;" icon="delete"
                            @click="confirmDelete(props.row.SystemID)" />
                    </q-td>
                </q-tr>
            </template>

        </q-table>

        <q-dialog v-model="show_dialog">
            <q-card>

                <q-card-section>
                    <q-input style="width: 95%; margin-left: 10px; margin-right: 10px;" v-model="columns.SystemName"
                        label="SystemName" readonly="" />
                    <!-- <q-input style="width: 95%; margin-left: 10px; margin-right: 10px;" v-model="columns.DBName" label="DBName" /> -->
                </q-card-section>

                <q-card-section>
                    <q-table style="width: 400px;" :rows="table2Rows" :columns="table2Columns" row-key="APIName"
                        selection="multiple" v-model:selected="selected">

                        <template v-slot:body-cell-selection="props">
                            <q-checkbox :value="props.row" v-model="selected" dense />
                        </template>
                    </q-table>
                </q-card-section>

                <q-card-actions>
                    <q-btn flat label="OK" color="primary" v-close-popup
                        @click="isEditing ? updateData() : addData()"></q-btn>
                </q-card-actions>

            </q-card>
        </q-dialog>


        <q-dialog v-model="show_dialog2">
            <q-card>

                <q-card-section>
                    <q-input style="width: 95%; margin-left: 10px; margin-right: 10px;" v-model="columns.SystemName"
                        label="SystemName" />
                    <!-- <q-input style="width: 95%; margin-left: 10px; margin-right: 10px;" v-model="columns.DBName" label="DBName" /> -->
                </q-card-section>

                <q-card-actions>
                    <q-btn flat label="OK" color="primary" v-close-popup
                        @click="isEditing ? updateData() : addData()"></q-btn>
                </q-card-actions>

            </q-card>
        </q-dialog>

        <q-card-actions>
            <q-btn label="ADD" color="primary" @click="showDialog" style="width:110px" icon="add" />
        </q-card-actions>
    </div>
</template>
  
<script>
import { ref, onMounted } from 'vue'
import useNotify from 'src/composables/useNotify'
export default {
    name: "IndexPage",
    data() {
        // ----------- 以下區塊是變數宣告 --------------- //
        const { notifyError } = useNotify()

        const show_dialog = ref(false)
        const show_dialog2 = ref(false)
        const isEditing = ref(false)

        const expanded = ref([])
        const isAllCollapsed = ref(false)

        // const reversedRows = ref([])
        const selectedData = ref([])

        const selected = ref([])

        const data = ref([])

        // ----------- 以下區塊是Data --------------- //
        const rows = ref([])

        const columns = ref([
            { name: 'SystemName', align: 'left', label: 'SystemName', field: 'SystemName' },
            { name: 'APIName', align: 'left', label: 'APIName', field: 'APIName' },
            { name: 'Actions', align: 'left', label: 'Actions', field: 'Actions' },
        ])

        const table2Rows = ref([])

        const table2Columns = ref([
            { name: 'APIName', align: 'left', label: 'APIName', field: 'APIName', sortable: true },
        ])

        // ----------- 以下區塊是API的串接 --------------- //
        onMounted(async () => {
            const response = await fetch('https://localhost:44350/api/query_API_mapping')
            rows.value = await response.json()
            // reversedRows.value = [...rows.value].reverse()
        })

        const addData = () => {
            var temp;

            if (columns.value.SystemName === "") {
                notifyError("Value can't be null");
            }
            else {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "SYSTEM": columns.value.SystemName,
                    })
                };
                fetch('https://localhost:44350/api/Check_sys', requestOptions)
                    .then(response => { return response.text(); })
                    .then(data => {
                        // if (data === '"Updated Success"')

                        temp = JSON.parse(data)
                        console.log(temp[0].ID)


                        if (temp[0].ID === null) { }
                        else {
                            const requestOptions2 = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "s_id": temp[0].ID,
                                    "api_id": [73]
                                })
                            };
                            fetch('https://localhost:44350/api/create_apimapping', requestOptions2)
                                .then(response => { return response.text(); })
                                .then(data => {
                                    window.location.reload()

                                });
                        }

                    });
            }

        }

        const updateData = () => {
            selectedData.value.s_id
            data.value = selected.value

            for (var i = 0; i < data.value.length; i++) {
                data.value[i] = data.value[i].Id
            }

            if (data.value === "") {
                notifyError("Value can't be null");
            }
            else {
                console.log(selectedData.value.SystemID)
                console.log(data.value)
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "s_id": selectedData.value.SystemID,
                        "api_id": data.value
                    })
                };
                fetch('https://localhost:44350/api/create_apimapping', requestOptions)
                    .then(response => { return response.text(); })
                    .then(data => {
                        // if (data === '"Updated Success"')
                        window.location.reload()
                        // else
                        //   notifyError(data)
                    });
            }
        }

        const deleteRow = (APIName) => {
            console.log(APIName)

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "s_id": APIName,
                    "d_id": data.value
                })
            };
            fetch('https://localhost:44350/api/delete_apimapping', requestOptions)
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
            show_dialog2.value = !show_dialog2.value
            isEditing.value = false
        }

        const showDetails = (async (SystemName) => {

            selectedData.value = this.rows.find(row => row.SystemName === SystemName)

            const response2 = await fetch('https://localhost:44350/api/query_api')
            table2Rows.value = await response2.json()

            columns.value.SystemName = selectedData.value.SystemName
            columns.value.APIName = selectedData.value.APIName


            for (var i = 0; i < table2Rows.value.length; i++) {
                if (columns.value.APIName.includes(table2Rows.value[i].APIName)) {
                    table2Rows.value[i] = ""
                }
            }

            table2Rows.value = table2Rows.value.filter(function (el) {
                return el != "";
            });

            show_dialog.value = !show_dialog.value
            isEditing.value = true
        })

        return {
            columns,
            rows,
            table2Rows,
            table2Columns,


            addData,
            updateData,
            deleteRow,
            confirmDelete,

            expanded,
            isAllCollapsed,
            toggleExpandAll,

            show_dialog,
            show_dialog2,
            showDialog,
            isEditing,
            showDetails,

            selected,
            data
        }
    }
}
</script>
  
  
<style>
.dbName {
    max-width: 650px;
}

.systemName {
    max-width: 130px;
}

.q-table tbody td {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
  
  