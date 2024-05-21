<script setup>
    import { useUIStore } from '../stores/ui'
    const ui = useUIStore()
    const props = defineProps(['cancelText', 'confirmText', 'cancelAction', 'confirmActionName', 'displayCancel'])

    const cancelText = props.cancelText || '取消'
    const confirmText = props.confirmText || '確認'
    const cancelAction = props.cancelAction || (() => { ui.dialogVisible = false })
    const displayCancel = props.displayCancel ?? true
</script>

<template>
    <div class="dialog-footer flex justify-center">
        <el-button v-if="displayCancel" @click="cancelAction">{{ cancelText }}</el-button>
        <el-button type="primary" @click="$emit(confirmActionName)">
            {{ confirmText }}
        </el-button>
    </div>
</template>