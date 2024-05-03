import { defineStore } from 'pinia'

export const useAccountsStore = defineStore('accounts', {
    state: () => ({ accounts: [
            { id: 1, name: '中國信託', transactions: [], initialBalance: 10000, displayBalance: true},
            // { id: 2, name: '玉山銀行', transactions: [], initialBalance: 10000},
            // { id: 1, name: '中國信託', transactions: [], initialBalance: 10000},
            // { id: 2, name: '玉山銀行', transactions: [], initialBalance: 10000},
            // { id: 1, name: '中國信託', transactions: [], initialBalance: 10000},
            // { id: 2, name: '玉山銀行', transactions: [], initialBalance: 10000},
            // { id: 1, name: '中國信託', transactions: [], initialBalance: 10000},
        ],
        displayNetBalance: true
    }),
    getters: {
        balancedAccounts(state) {
            return state.accounts.map(account => ({
                ...account,
                balance: account.initialBalance + account.transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
            }))
        },
        netBalance(state) {
            return state.accounts.reduce((acc, account) => acc + account.initialBalance + account.transactions.reduce((acc, transaction) => acc + transaction.amount, 0), 0)
        }
    },
})