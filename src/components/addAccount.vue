<script setup>
    import { ref, reactive } from 'vue'
    import { useAccountsStore } from '../stores/accounts'
    import { useUIStore } from '../stores/ui'
    import DialogActionBar from './DialogActionBar.vue'

    const accounts = useAccountsStore()
    const ui = useUIStore()

    const ruleFormRef = ref()

    const ruleForm = reactive({
        name: '',
        type: accounts.accountTypes[0],
        initialBalance: 0,
    })

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

    const submitForm = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                accounts.addAccount(ruleForm)
                formEl.resetFields()
                ui.dialogVisible = false
            } else {
                console.log('error submit!', fields)
            }
        })
    }

    const resetForm = (formEl) => {
        if (!formEl) return
        formEl.resetFields()
    }

    const options = accounts.accountTypes.map((_, idx) => ({
        value: _,
        label: _,
    }))

    const onSubmit = async (formEl) => {
        await submitForm(formEl)
    }
    
</script>

<template>
    <div class="flex justify-center">
        <el-form class="grow" ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto" status-icon>
            

            <el-form-item label="帳戶名稱" prop="name">
                <el-input v-model="ruleForm.name" />
            </el-form-item>
    
            <el-form-item label="帳戶類型" prop="type">
                <el-select-v2 v-model="ruleForm.type" placeholder="帳戶類型" :options="options" />
            </el-form-item>
    
            <el-form-item label="初始金額" prop="initialBalance">
                <el-input v-model.number="ruleForm.initialBalance" type="text" autocomplete="off" />
            </el-form-item>

            <div class="flex justify-end">
                <el-form-item>
                    <el-button @click="resetForm(ruleFormRef)">清除重填</el-button>
                    <el-button class="hidden" type="primary" @click="submitForm(ruleFormRef)"></el-button>
                </el-form-item>
            </div>

        </el-form>
    </div>

    <DialogActionBar confirmText="新增" confirmActionName="on-submit" @on-submit="onSubmit(ruleFormRef)"/>
</template>

<style scoped>
</style>