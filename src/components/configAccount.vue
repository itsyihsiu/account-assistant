<script setup>
    import { ref, reactive, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useUIStore } from '../stores/ui'
    import { useAccountsStore } from '../stores/accounts'
    import DialogActionBar from './DialogActionBar.vue'

    const route = useRoute()
    const router = useRouter()

    const ui = useUIStore()
    const accounts = useAccountsStore()

    const ruleFormRef = ref()

    const ruleForm = reactive({
        uuid: route.params.uuid,
        name: '',
        type: accounts.accountTypes[0],
        initialBalance: 0,
    })

    if (route.params.uuid) {
        const account = accounts.getAccount(route.params.uuid)
        if (account) {
            ruleForm.name = account.name
            ruleForm.type = account.type
            ruleForm.initialBalance = account.initialBalance
        }
    }

    const rules = reactive({
        name: [
            { required: true, message: '請輸入帳戶名稱', trigger: 'blur' },
            { min: 1, max: 20, message: '字數 1 ~ 20 字', trigger: 'blur' },
        ],
        type: [
            {
                required: true,
                message: '請選擇帳戶類型',
                trigger: 'change',
            },
        ],
        initialBalance: [
            { required: true, message: '請填入初始金額' },
            { type: 'number', message: '初始金額必須為數字' },
        ],
    })

    const options = accounts.accountTypes.map((_, idx) => ({
        value: _,
        label: _,
    }))

    const submitForm = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                accounts.updateAccount(ruleForm)
                formEl.resetFields()
                router.replace('/')
                ui.dialogVisible = false
            } else {
                console.log('error submit!', fields)
            }
        })
    }

    const onCancel = () => {
        router.replace('/')
        ruleFormRef.value.resetFields()
        ui.dialogVisible = false
    }
</script>

<template>
    <div class="flex justify-center">
        <el-form class="grow" ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto" status-icon>
            
            <el-form-item label="帳戶名稱" prop="name">
                <el-input v-model="ruleForm.name" tabindex="1"/>
            </el-form-item>
    
            <el-form-item label="帳戶類型" prop="type">
                <el-select-v2 v-model="ruleForm.type" placeholder="帳戶類型" :options="options" />
            </el-form-item>
    
            <el-form-item label="初始金額" prop="initialBalance">
                <el-input v-model.number="ruleForm.initialBalance" type="text" autocomplete="off" />
            </el-form-item>

        </el-form>
    </div>

    <DialogActionBar 
        confirmText="修改" confirmActionName="on-submit" @on-submit="submitForm(ruleFormRef)"
        cancelActionName="on-cancel" @on-cancel="onCancel"
    />
</template>

<style scoped>
</style>