import { ref, reactive, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useAccountsStore = defineStore('accounts', () => {

    // state

    const accounts = reactive([
        // { uuid: 1, order: 1, name: '中國信託', transactions: [], initialBalance: 0, initialBalanceModifyDate: , displayBalance: true},
    ])
    const displayNetBalance = ref(true)
    const accountTypes = ref(['銀行', '現金', '其他'])

    const balancedAccounts = computed(() => {
        return accounts.map(account => ({
            ...account,
            balance: account.initialBalance + account.transactions.reduce((acc, transaction) => {
                if (transaction.type === 'add') {
                    return acc + transaction.amount
                } else {
                    return acc - transaction.amount
                }
            }, 0)
        }))
    })

    // computed

    const netBalance = computed(() => {
        return accounts.reduce((acc, account) => {
            return acc + account.initialBalance + account.transactions.reduce((acc, transaction) => {
                if (transaction.type === 'add') {
                    return acc + transaction.amount
                } else {
                    return acc - transaction.amount
                }
            }, 0)
        }, 0)
    })

    // action

    function getAccount(uuid) {
        return accounts.find(account => account.uuid === uuid)
    }

    function setAccounts(newAccounts) {
        accounts.splice(0, accounts.length, ...newAccounts)
    }

    function addAccount(accountData) {
        accounts.push({ 
            uuid: crypto.randomUUID(), 
            name: accountData.name, 
            type: accountData.type,
            transactions: [], 
            initialBalance: Number(accountData.initialBalance),
            initialBalanceModifyDate: new Date().toISOString(),
            displayBalance: true,
            order: this.accounts.length
        })
    }

    function updateAccount(accountData) {
        const account = accounts.find(account => account.uuid === accountData.uuid)
        account.name = accountData.name
        account.type = accountData.type
        account.initialBalance = Number(accountData.initialBalance)
        account.initialBalanceModifyDate = new Date().toISOString()
    }

    function performTransaction(transaction) {
        const account = accounts.find(account => account.uuid === transaction.account)
        account.transactions.push(transaction)
    }

    // watch

    watch(accounts, saveOnUpdate)
    function saveOnUpdate(newValue) {
        localStorage.setItem('balanceKeeper', JSON.stringify(newValue));
    }

    return { accounts, 
        displayNetBalance, 
        accountTypes, 
        balancedAccounts,
        netBalance,
        addAccount,
        setAccounts,
        getAccount,
        updateAccount,
        performTransaction
    }
})