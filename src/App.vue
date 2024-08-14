<template>
  <n-message-provider>
    <n-layout style="height: 100vh">
      <n-layout-header style="height: 64px;display: flex;align-items: center;justify-content: center;" bordered
        v-if="HeaderisCollapsed">
        <n-h3 style="margin: 0px;">CandyChat</n-h3>
      </n-layout-header>
      <n-layout position="absolute" :style="HeaderisCollapsed ? 'top: 64px;' : 'top: 0px;'" has-sider>
        <n-layout-sider :on-after-enter="handleAfterEnter" :on-after-leave="handleAfterLeave" collapse-mode="width"
          :collapsed-width="20" :width="240" :show-collapsed-content="false" show-trigger="arrow-circle"
          content-style="padding: 18px;" bordered>
          <NewChatItemButton />
          <div v-for="item in chatList">
            <ChatListItem :title="item.title" :chatId="item.id" />
          </div>
        </n-layout-sider>
        <RouterView />
        <n-layout-footer id="custom_footer" ref="custom_footer" position="absolute"
          style="left:240px;height: 64px;display: flex;align-items: center;justify-content: center;" bordered>
          <n-input :disabled="!isInputDisabled" size="large" placeholder="请输入内容" style="width: 40%;text-align: left;"
            v-model:value="input_data" :status="isRequestError ? 'error' : 'success'" @keyup.enter="handleRequest()">
            <template #suffix>
              <n-popselect v-model:value="currentModel" :options="ModelOptions" trigger="click"
                @update:value="changeCurrentModel">
                <n-icon size="20">
                  <svg t="1718522734896" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="9155" width="200" height="200">
                    <path
                      d="M569.005837 140.456674l99.024593 200.638691a63.586736 63.586736 0 0 0 47.953798 34.782488l221.322762 32.192984c52.157748 7.5767 72.969696 71.674943 35.166119 108.455506l-160.133716 156.137566a63.586736 63.586736 0 0 0-18.286382 56.281775l37.819562 220.58747c8.903422 51.933963-45.604062 91.5438-92.263107 67.023426l-198.033201-104.171634a63.586736 63.586736 0 0 0-59.143018 0l-198.06517 104.107695c-46.643061 24.520375-101.166529-15.089462-92.263108-67.023425l37.819562-220.587471a63.586736 63.586736 0 0 0-18.286381-56.281774l-160.21364-156.169536c-37.739639-36.764578-16.911706-100.878806 35.166119-108.455506l221.402685-32.176999a63.586736 63.586736 0 0 0 47.953798-34.782488l99.024593-200.638691c23.32153-47.202522 90.712601-47.202522 114.034132 0.079923z"
                      fill="#FFE000" p-id="9156"></path>
                    <path
                      d="M552.269961 323.911921l50.831026 102.908851a44.916724 44.916724 0 0 0 33.823413 24.568329l113.490655 16.496106c36.764578 5.354841 51.550333 50.623226 24.888021 76.614185l-82.176825 80.098827a44.916724 44.916724 0 0 0-12.915556 39.753699l19.405303 113.09104c6.297932 36.764578-32.224952 64.673689-65.169211 47.346383l-101.566145-53.404546a44.916724 44.916724 0 0 0-41.799727 0l-101.566144 53.404546c-32.960244 17.327306-71.467144-10.661728-65.169211-47.346383l19.405303-113.09104a44.916724 44.916724 0 0 0-12.915556-39.753699l-82.176825-80.098827c-26.662312-25.990959-11.95648-71.259344 24.888021-76.614185l113.490655-16.496106a44.916724 44.916724 0 0 0 33.839397-24.568329l50.783072-102.892866c16.528076-33.391828 64.130213-33.391828 80.610334-0.015985z"
                      fill="#FFFF00" p-id="9157"></path>
                    <path
                      d="M512.452325 96.115396m-96.115396 0a96.115396 96.115396 0 1 0 192.230791 0 96.115396 96.115396 0 1 0-192.230791 0Z"
                      fill="#E8E8E8" p-id="9158"></path>
                    <path
                      d="M450.000495 89.082172a82.816209 74.456264 90 1 0 148.912527 0 82.816209 74.456264 90 1 0-148.912527 0Z"
                      fill="#F7F7F7" p-id="9159"></path>
                  </svg>
                </n-icon>
              </n-popselect>
            </template>
          </n-input>

        </n-layout-footer>
      </n-layout>
    </n-layout>
  </n-message-provider>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue';
import ChatListItem from '@/components/ChatListItem.vue';
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidv4v } from 'uuid';

var axios = require('axios');
import NewChatItemButton from '@/components/NewChatItemButton.vue';
const route = useRoute();
const custom_footer = ref(null);
const input_data = ref('');
const isInputDisabled = ref(true);
const isRequestError = ref(false);
const HeaderisCollapsed = ref(true);
const currentModel = ref('gpt-3.5-turbo-1106');
const ModelOptions = ref([
{
  label: 'gpt-3.5-turbo',
  value: 'gpt-3.5-turbo'
},
{
  label: 'gpt-4o',
  value: 'gpt-4o'
}
]);

// 渲染localStorage中的聊天列表
const chatList = ref([]);
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  if (uuidv4v(key) === false) {
    continue;
  }
  chatList.value.push(JSON.parse(localStorage.getItem(key)));
}

const handleAfterEnter = () => {
  // 当侧边栏展开后，将底部栏向右移动
  custom_footer.value.$el.style.left = '240px';
};
const handleAfterLeave = () => {
  // 当侧边栏收起后，将底部栏向左移动
  custom_footer.value.$el.style.left = '20px';
};

const isMobile = () => {
  let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
  return flag;
}

const changeCurrentModel = (value, option) => {
  currentModel.value = value;
  console.log(currentModel.value);

}

// 获取接口回复
const getChatData = async () => {
  var send_data = JSON.stringify({
    "model": `${currentModel.value}`,
    "messages": [
      {
        "role": "user",
        "content": `${input_data.value}`
      }
    ],
    "temperature": 0.7
  });

  // 配置请求
  var config = {
    method: 'post',
    url: 'https://api.chatanywhere.com.cn/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-CEkFLRMFkCjUr9Lq9wY6jnYshNpqrkMnvsHowQCRNzYsOIGB'
    },
    data: send_data
  };

  try {
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.log(error);
    return null; // 返回null表示出错
  }
};

const handleRequest = async () => {
  // 处理页面请求
  console.log(input_data.value);

  // 禁用输入框，防止重复发送
  isInputDisabled.value = false
  // 等待getChatData函数执行完毕并获取返回值
  let message = await getChatData();

  if (message) {
    let pre_data = JSON.parse(window.localStorage.getItem(route.query.id));

    // 添加用户消息
    pre_data['messages'].push({
      role: '你 🤔',
      content: input_data.value
    });

    // 添加chatbot消息
    pre_data['messages'].push({
      role: 'GPT 🫣',
      content: message['choices'][0]['message']['content']
    });

    // 更新localStorage
    window.localStorage.setItem(route.query.id, JSON.stringify(pre_data));

    // 发送事件
    const event = new CustomEvent('updateChatView', { detail: pre_data });
    window.dispatchEvent(event);
    input_data.value = ""
    isInputDisabled.value = true
  } else {
    console.log('Failed to get chat data');
    // 提示用户 请求失败
    isRequestError.value = true
    // 3秒后恢复
    setTimeout(() => {
      isRequestError.value = false
      input_data.value = ""
    }, 3000);
    isInputDisabled.value = true
  }
};


onMounted(() => {
  // Code to run after component is mounted
  custom_footer.value.$el.style.left = '240px';
  if (isMobile()) {
    HeaderisCollapsed.value = false;
  }
});
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.n-h3 {
  // 字体加粗
  font-weight: bold;
  font-family: PingFangSC-Semibold, sans-serif;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
