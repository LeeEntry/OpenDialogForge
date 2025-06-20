<template>
  <el-container style="height:100vh">
    <el-header style="background:#222;color:#fff;">
      <h2>OpenDialogForge</h2>
    </el-header>
    <el-main>
      <el-card style="max-width:600px;margin:0 auto;">
        <div v-for="msg in messages" :key="msg.id" class="message-block">
          <el-alert
              :title="msg.role === 'user' ? '你' : '助理'"
              :type="msg.role === 'user' ? 'info' : 'success'"
              show-icon
              :description="msg.text"
              style="margin-bottom:10px"
          />
        </div>
        <el-form @submit.prevent="sendMessage">
          <el-form-item>
            <el-input
                v-model="input"
                type="textarea"
                :rows="2"
                placeholder="请输入你的问题…"
                @keyup.enter.native="sendMessage"
                ref="inputBox"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sendMessage" :loading="loading">发送</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import axios from 'axios'

const messages = ref([])
const input = ref('')
const loading = ref(false)
const inputBox = ref(null)

const fetchHistory = async () => {
  // 假设后端有获取历史消息的API
  const res = await axios.get('/api/messages')
  messages.value = res.data
}

const sendMessage = async () => {
  if (!input.value.trim()) return
  loading.value = true
  const userMsg = {
    id: Date.now(),
    role: 'user',
    text: input.value
  }
  messages.value.push(userMsg)
  try {
    const res = await axios.post('/api/chat', {question: input.value})
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: res.data.response
    })
    input.value = ''
    inputBox.value && inputBox.value.focus()
  } catch (e) {
    messages.value.push({
      id: Date.now() + 2,
      role: 'assistant',
      text: '请求失败，请重试'
    })
  }
  loading.value = false
}

onMounted(fetchHistory)
</script>

<style scoped>
.message-block {
  margin-bottom: 8px;
}
</style>