<template>
    <div cla="row">&nbsp;</div>
    <div class="row justify-center items-center">
        <q-card square bordered class="q-pa-lg shadow-1">
            <q-card-section>
                <div class="text-h5 text-grey-9">Log In Your Account</div>
                <div>&nbsp;</div>
                <q-form class="q-gutter-md">
                    <q-input square filled v-model="form.userName" type="email" label="User Name" />
                    <q-input v-model="form.password" filled :type="isPwd ? 'password' : 'text'" label="Password"
                        @keyup.enter="actLogin()">
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="isPwd = !isPwd" />
                        </template>
                    </q-input>
                </q-form>
            </q-card-section>
            <q-card-actions class="q-px-md">
                <q-btn unelevated color="light-green-7" size="lg" class="full-width" label="Login" @click="actLogin()" />
            </q-card-actions>
        </q-card>
    </div>
</template>

<script>
import { ref, inject, toRefs, defineComponent } from 'vue'
import useNotify from 'src/composables/useNotify'
import { SessionStorage } from 'quasar'

export default defineComponent({
    name: 'LoginPage',
    setup() {
        const Admin = ref(false)
        const DBA = ref(false)
        const SysAdmin = ref(false)
        const userName = ref("")
        const mapGlobalState = inject("mapGlobalState");
        const { userInfo, setUserRights } = mapGlobalState;
        const { notifyError } = useNotify()

        const form = ref({
            userName: '',
            password: ''
        })

        const checkUserRight = () => {

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "UserMail": SessionStorage.getItem("User"),
                })
            };
            fetch('https://localhost:44350/api/query_right', requestOptions)
                .then(response => { return response.text(); })
                .then(data => {
                    try {
                        var json = JSON.parse(data);
                        json[0].RoleRight;

                        if (json[0].RoleRight === "Admin") {
                            Admin.value = true
                            DBA.value = true
                            SysAdmin.value = true
                            SessionStorage.set("Right", "Admin")
                        }

                        if (json[0].RoleRight === "DBA") {
                            DBA.value = true
                            SysAdmin.value = true
                            SessionStorage.set("Right", "DBA")
                        }

                        if (json[0].RoleRight === "SysAdmin") {
                            SysAdmin.value = true
                            SessionStorage.set("Right", "SysAdmin")
                        }

                        window.location.reload()
                    } catch {
                        SessionStorage.set("Right", "user")
                        window.location.reload()
                    }
                });

        }
        const actLogin = () => {
            SessionStorage.set("Login", false)

            if (form.value.userName != "Admin") {
                userName.value = form.value.userName + "@makalot.com"
            } else {
                userName.value = form.value.userName
            }

            SessionStorage.set("User", userName.value)

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Account: userName.value,
                    Password: form.value.password
                })
            };
            fetch('https://localhost:44350/api/login', requestOptions)
                .then(response => { return response.text(); })
                .then(data => {
                    if (data == '"ok"') {
                        SessionStorage.set("Login", true)
                        checkUserRight()
                    }
                    else
                        notifyError(data)
                });
        }

        return {
            ...toRefs(userInfo),
            isPwd: ref(true),
            form,
            actLogin,
            Admin, SysAdmin, DBA,
            checkUserRight,
            userName
        }
    }
})
</script>
  