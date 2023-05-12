const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/LoginPage.vue'), },
      { path: 'home', component: () => import('src/pages/Home.vue'), },
      {
        path: 'Management', component: () => import('src/pages/DB_Management.vue'), meta: {
          requireAuth: true,
          permission: ['Admin', 'DBA']
        }
      },
      { path: 'login', component: () => import('src/pages/LoginPage.vue') },
      {
        path: 'Mapping', component: () => import('src/pages/DB_Mapping.vue'), meta: {
          requireAuth: true,
          permission: ['Admin', 'DBA']
        }
      },
      {
        path: 'Role', component: () => import('src/pages/Role_Assign.vue'), meta: {
          requireAuth: true,
          permission: ['Admin']
        }
      },
      { path: 'Right', component: () => import('src/pages/Right_NotEnough.vue') },
      {
        path: 'API', component: () => import('src/pages/API_Mapping.vue'), meta: {
          requireAuth: true,
          permission: ['Admin', 'SysAdmin']
        }
      },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes