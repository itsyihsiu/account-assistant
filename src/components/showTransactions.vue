<script setup>
    import { useUIStore } from '../stores/ui'
    import DialogActionBar from './DialogActionBar.vue'

    const ui = useUIStore()
</script>
<template>
    <DialogActionBar :displayCancel="false" :confirmAction="ui.dialogVisible = false"/>
</template>