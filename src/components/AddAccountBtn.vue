<script setup>
    import { useUIStore } from '../stores/ui'
    import { useRouter } from 'vue-router'
    const router = useRouter()
    const ui = useUIStore()
</script>

<template>
    <el-button type="primary" @click="ui.dialogTitle = '新增帳戶'; ui.dialogVisible = true; router.push('/add-account');">
        <i class="fa-solid fa-circle-plus mr-3"></i>
        <span>新增帳戶</span>
    </el-button>
</template>