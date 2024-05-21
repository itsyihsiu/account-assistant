import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
    state: () => ({
        dialogVisible: false,
        dialogTitle: '',
    }),
})