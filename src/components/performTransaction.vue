<script setup>
    import { ref, reactive, computed, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useUIStore } from '../stores/ui'
    import { useAccountsStore } from '../stores/accounts'
    import moment from 'moment'

    const route = useRoute()
    const router = useRouter()

    const ui = useUIStore()
    const accounts = useAccountsStore()

    const transactionType = ref('transfer')
    const transactionAmount = ref(0)

    onMounted(() => {
        localStorage.getItem('transactionType') && (transactionType.value = localStorage.getItem('transactionType'))
    })

    const account = reactive(accounts.getAccount(route.params.uuid))

    const destinationAccountUUID = ref('')

    const otherAccounts = computed(() => {
        console.log(accounts.accounts)
        return accounts.accounts.filter(account => account.uuid !== route.params.uuid).map(account => {
            return {
                label: account.name,
                value: account.uuid
            }
        })
    })

    const transactionHistory = computed(() => {
        let history = [
            {
                date: moment(account.initialBalanceModifyDate).format('YYYY/MM/DD hh:mm:ss'),
                type: '初始金額',
                amount: account.initialBalance.toLocaleString()
            }
        ]
        for (const transaction of account.transactions) {
            history.push({
                date: moment(transaction.date).format('YYYY/MM/DD hh:mm:ss'),
                type: transaction.type === 'add' ? '存入' : transaction.type === 'delete' ? '提出' : '轉帳',
                amount: transaction.amount.toLocaleString()
            })
        }
        return history.reverse()
    })

    function onTransactionTypeChange(value) {
        localStorage.setItem('transactionType', value)
    }

    function onTransactionAmountInput(value) {
        transactionAmount.value = String(transactionAmount.value).replace(/[^0-9.]/g, '')
        transactionAmount.value = String(transactionAmount.value).replace(/^0([1-9]+)/g, '$1')
        transactionAmount.value = Number(transactionAmount.value).toLocaleString()
    }

    function onConfirm() {
        transactionAmount.value = String(transactionAmount.value).replace(/[^0-9.]/g, '')
        transactionAmount.value = String(transactionAmount.value).replace(/^0([1-9]+)/g, '$1')
        transactionAmount.value = Number(transactionAmount.value)
        if (transactionAmount.value <= 0) {
            // ui.notify('金額必須大於 0', 'error')
            return
        }


        console.log(transactionAmount.value)

        const transaction = {
            account: route.params.uuid,
            type: transactionType.value,
            amount: Number(transactionAmount.value),
            date: new Date().toISOString(),
        }

        accounts.performTransaction(transaction)

        router.replace('/')
        ui.dialogVisible = false
    }

    const onCancel = () => {
        router.replace('/')
        ui.dialogVisible = false
    }

</script>

<template>

    <div class="mb-2 text-2xl font-medium text-gray-700 text-center"> {{ account.name }} </div>

    <div class="mb-5 h-20 border bg-zinc-50 text-6xl font-medium flex justify-end items-center px-5 rounded">
        <input
            v-model="transactionAmount"
            type="text"
            class="w-full text-right"
            placeholder="請輸入金額"
            style="outline: none; border: none; background-color: transparent; overflow: hidden;"
            @input="onTransactionAmountInput"
        />
    </div>

    <div class="text-center mb-8">
        <el-radio-group v-model="transactionType" size="large" @change="onTransactionTypeChange">
            <el-radio-button value="add">
                <div class="w-20">
                    <i class="fa-solid fa-plus"></i>
                </div>
            </el-radio-button>
            <el-radio-button value="delete">
                <div class="w-20">
                    <i class="fa-solid fa-minus"></i>
                </div>
            </el-radio-button>
            <el-radio-button value="transfer">
                <div class="w-20">
                    <i class="fa-solid fa-arrow-right-arrow-left"></i>
                    轉帳
                </div>
            </el-radio-button>
        </el-radio-group>
    </div>

    <el-select
        v-model="destinationAccountUUID"
        placeholder="請選擇帳戶"
        size="large"
        style="width: 240px"
    >
        <el-option
            v-for="item in otherAccounts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
    </el-select>

    <div class="mb-8 text-center">
        <el-button @click="onCancel" size="large">
            取消
        </el-button>
        <el-button type="primary" @click="onConfirm" size="large">
            確認
        </el-button>
    </div>

    <el-table :data="transactionHistory" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="180" header-row-style="text-align: center;" />
        <el-table-column prop="type" label="類型" width="180" :header-row-style="{textAlign: 'center'}"/>
        <el-table-column prop="amount" label="金額" />
    </el-table>
</template>

<style scoped>
</style>