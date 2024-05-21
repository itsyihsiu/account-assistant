import { createRouter, createWebHistory } from 'vue-router'
import Empty from './components/Empty.vue'
import AddAccount from './components/AddAccount.vue'
import ConfigAccount from './components/ConfigAccount.vue'
import PerformTransaction from './components/PerformTransaction.vue'
import ShowTransactions from './components/ShowTransactions.vue'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Empty },
        { path: '/add-account', component: AddAccount },
        { path: '/config-account', component: ConfigAccount },
        { path: '/perform-transaction', component: PerformTransaction },
        { path: '/show-transaction', component: ShowTransactions },
    ]
});