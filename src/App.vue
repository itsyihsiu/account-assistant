<script setup>
  import { ref, reactive, computed } from 'vue'
  import { useAccountsStore } from './stores/accounts'
  const accounts = useAccountsStore()

  function toggleDisplayNetBalance(event) {
    if (event) {
      event.currentTarget.classList.toggle('fa-eye-slash')
      event.currentTarget.classList.toggle('fa-eye')
    }
    accounts.displayNetBalance = !accounts.displayNetBalance
  }

  function toggleDisplayBalance(event) {
    if (event) {
      event.currentTarget.classList.toggle('fa-eye-slash')
      event.currentTarget.classList.toggle('fa-eye')
      let index = event.currentTarget.getAttribute('index')
      console.log(index)
      accounts.accounts[index].displayBalance = !accounts.accounts[index].displayBalance
    }
  }

  const dialogVisible = ref(false)
  const dialogTitle = ref('')
</script>

<template>
  <div class="container mx-auto py-5 px-5 sm:px-0">

    <div class="my-5 flex items-center justify-start gap-5">
      <i class="fa-solid fa-eye text-gray-300 text-2xl cursor-pointer hover:text-gray-400"
        @click="toggleDisplayNetBalance"
      ></i>
      <h1 class="text-6xl font-bold text-right" :class="accounts.netBalance >= 0 ? '' : 'text-red-500'">
        {{ accounts.displayNetBalance === true ? (accounts.netBalance).toLocaleString('en-US') : '********' }}
      </h1>
    </div>


    <div class="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

      <el-card shadow="hover" 
        v-for="(account, index) in accounts.balancedAccounts" :key="index" :index="index" 
      >
        <div class="flex items-center justify-between">
          <p class="text-md font-medium">{{ account.name }}</p>
          <i class="fa-solid fa-gear text-gray-300 cursor-pointer hover:text-gray-400"></i>
        </div>
        <div class="pt-2 pb-3 flex items-center justify-between">
          <i class="fa-solid fa-eye text-gray-300 cursor-pointer hover:text-gray-400" :index="index" @click="toggleDisplayBalance"></i>
          <div class="text-right text-3xl font-medium">
            {{ account.displayBalance === true ? (account.balance).toLocaleString('en-US') : '********' }}
          </div>
        </div>
        <div class="flex items-center justify-stretch">
          <el-button round class="grow" @click="dialogVisible = false">
            紀錄
          </el-button>
          <el-button type="primary" round class="grow" @click="dialogVisible = false">
            修改
          </el-button>
        </div>
      </el-card>

      <div class="flex justify-center items-center">
        <el-button type="primary" @click="dialogTitle = '新增帳戶'; dialogVisible = true;">
          <i class="fa-solid fa-circle-plus mr-3"></i>
          <span>新增帳戶</span>
        </el-button>
      </div>
    </div>

  </div>

  <div>
    <el-dialog center
      v-model="dialogVisible"
      :title="dialogTitle"
      width="90%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div>
        <el-form :model="form">
          <el-form-item label="Promotion name" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Zones" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="Please select a zone">
              <el-option label="Zone No.1" value="shanghai" />
              <el-option label="Zone No.2" value="beijing" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            新增
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>