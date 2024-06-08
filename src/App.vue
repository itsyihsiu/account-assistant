<script setup>
    import { ref, reactive, computed, onMounted, toRaw } from 'vue'
    import { useAccountsStore } from './stores/accounts'
    import { useUIStore } from './stores/ui'
    import { useRouter, useRoute } from 'vue-router'
    import AddAccountBtn from './components/AddAccountBtn.vue'
    const router = useRouter()
    const accounts = useAccountsStore()
    const ui = useUIStore()

    function toggleDisplayNetBalance(event) {
        accounts.displayNetBalance = !accounts.displayNetBalance
    }

    function toggleDisplayBalance(event) {
        if (event) {
            let index = event.currentTarget.getAttribute('index')
            accounts.accounts[index].displayBalance = !accounts.accounts[index].displayBalance
        }
    }

    function focusInput() {
        try {
            let firstInput = document.getElementById('app-dialog').querySelector('input')
            if (firstInput) {
                firstInput.focus()
            }
        } catch (error) {
            console.warn(error)
        }
    }

    onMounted(() => {
        JSON.parse(localStorage.getItem('balanceKeeper')) && accounts.setAccounts(JSON.parse(localStorage.getItem('balanceKeeper')))
    })
</script>

<template>
    <div class="container mx-auto py-5 px-5 sm:px-0">

        <div class="text-2xl font-medium text-gray-700 text-center">理財小幫手</div>

        <div class="my-5 mb-9 flex items-center justify-center gap-5" v-show="accounts.accounts.length > 0">
            <h1 class="cursor-pointer font-bold text-right flex items-center justify-center gap-5" 
                :class="accounts.netBalance >= 0 ? '' : 'text-red-500'"
                @click="toggleDisplayNetBalance"
            >
                <span class="text-2xl">$</span> 
                <span class="text-5xl">
                    {{ accounts.displayNetBalance === true ? (accounts.netBalance).toLocaleString('en-US') : '*****' }}
                </span>
            </h1>
        </div>

        <el-empty description="尚未建立帳戶" v-show="accounts.accounts.length === 0">
            <AddAccountBtn />
        </el-empty>

        <div class="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            <el-card shadow="hover" 
                v-for="(account, index) in accounts.balancedAccounts" 
                :key="index" 
                :index="index"
                :uuid="account.uuid"
            >

                <div class="flex items-center justify-between">
                    <p class="text-md font-medium">{{ account.name }}</p>
                    
                </div>

                <div class="pt-2 pb-3 flex items-center justify-end">
                    <div class="text-right text-3xl font-medium relative cursor-pointer" style="top: -12px;"
                        @click="toggleDisplayBalance"
                        :index="index"
                    >
                        {{ account.displayBalance === true ? (account.balance).toLocaleString('en-US') : '*****' }}
                    </div>
                </div>
                <div class="flex items-center justify-evenly">
                    <el-button round class=""
                        @click="ui.dialogTitle = '設定'; ui.dialogVisible = true; router.push('/config-account/'+account.uuid);">
                        設定
                    </el-button>
                    <el-button type="primary" round class="grow"
                        @click="ui.dialogTitle = '修改'; ui.dialogVisible = true; router.push('/perform-transaction/'+account.uuid);">
                        修改
                    </el-button>
                </div>
            </el-card>

            <div class="flex justify-center items-center">
                <AddAccountBtn v-show="accounts.accounts.length !== 0"/>
            </div>
        </div>

    </div>

    <div>
        <el-dialog center
            id="app-dialog"
            :title="ui.dialogTitle"
            v-model="ui.dialogVisible" 
            width="90%" 
            :show-close="false"
            @opened="focusInput"
            :close-on-press-escape="false">
            <router-view />
        </el-dialog>
    </div>
</template>

<style scoped>

</style>