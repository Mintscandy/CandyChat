<template>
  <n-layout style="height: 100vh">
    <n-layout-header style="height: 64px;display: flex;align-items: center;justify-content: center;" bordered>
      <n-h3 style="margin: 0px;">CandyChat</n-h3>
    </n-layout-header>
    <n-layout position="absolute" style="top: 64px" has-sider>
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
        <n-input size="large" placeholder="请输入内容" style="width: 40%;text-align: left;" v-model:value="input_data"
          @keyup.enter="handleRequest()">
          <template #suffix>
            <n-icon size="20">
              <svg t="1714905595925" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="12163" width="200" height="200">
                <path
                  d="M485.734 76.86c-235.218 0-425.578 165.593-425.578 369.859 0 125.328 72.735 236.765 182.61 304.828v114.531c0 15.469 10.828 24.75 23.218 24.75 4.641 0 9.297-1.531 12.375-3.094l116.063-77.375c29.422 6.188 58.812 7.75 89.765 7.75 235.22 0 425.563-165.593 425.563-369.859 1.566-205.797-188.778-371.39-424.016-371.39z m0 679.346c-26.312 0-52.625-3.094-78.921-7.75l-12.391-3.094c-7.735-1.53-15.469 0-23.219 4.657l-10.812 7.718-55.72 37.157V734.55c0-10.844-6.187-21.688-15.468-26.313l-15.484-9.28C177.766 641.674 120.516 547.3 120.516 448.252c0-170.219 162.5-307.937 363.671-307.937 201.188 0 363.657 137.718 363.657 307.937 1.565 168.672-162.466 307.953-362.11 307.953zM244.313 457.531c0 28.219 22.859 51.078 51.078 51.078 28.203 0 51.062-22.859 51.062-51.078 0-28.172-22.86-51.047-51.062-51.047-28.22 0-51.079 22.875-51.079 51.047z m193.453 0c0 28.219 22.859 51.078 51.062 51.078s51.078-22.859 51.078-51.078c0-28.172-22.875-51.047-51.078-51.047s-51.062 22.875-51.062 51.047z m187.234 0c0 28.219 22.875 51.078 51.063 51.078 28.218 0 51.093-22.859 51.093-51.078 0-28.172-22.875-51.047-51.093-51.047-28.188 0-51.063 22.875-51.063 51.047z m293.128 79.957c-0.912-1.152-1.872-2.256-2.816-3.408-6.656 25.28-16.16 49.632-28.128 72.752 0.496 1.12 1.12 2.192 1.6 3.312 8.096 18.624 12.496 38.752 12.496 59.744 0 55.664-32.16 108.688-86.064 140.848l-8.688 5.216c-5.216 2.592-8.72 8.688-8.72 14.784V864.64l-31.28-20.88-6.096-4.336c-4.336-2.592-8.688-3.472-13.024-2.592l-6.944 1.712c-14.816 2.656-29.6 4.336-44.336 4.336-35.44 0-68.816-7.84-97.936-21.504-28.912 6.752-58.912 11.008-89.808 12.464 48.4 41.712 115.008 67.504 188.592 67.504 19.504 0 38-0.976 56.496-4.848l73.056 48.688c1.936 0.976 4.848 1.936 7.744 1.936 7.808 0 14.624-5.84 14.624-15.568v-72.096c69.152-42.848 114.944-112.976 114.944-191.84 0-48.192-16.848-92.976-45.712-130.128z"
                  fill="#727272" p-id="12164"></path>
              </svg>
            </n-icon>
          </template>
        </n-input>
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue';
import ChatListItem from '@/components/ChatListItem.vue';
import { RouterView } from 'vue-router';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
var axios = require('axios');

import NewChatItemButton from '@/components/NewChatItemButton.vue';

const route = useRoute();

const custom_footer = ref(null);

const input_data = ref('');

// 渲染localStorage中的聊天列表
const chatList = ref([]);
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
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

const getChatData = async () => {
  var send_data = JSON.stringify({
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": `${input_data.value}`
      }
    ],
    "temperature": 0.7
  });
  // 发送聊天数据
  var config = {
    method: 'post',
    url: 'https://api.chatanywhere.com.cn/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-CEkFLRMFkCjUr9Lq9wY6jnYshNpqrkMnvsHowQCRNzYsOIGB'
    },
    data: send_data
  };
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  // console.log(input_data.value);
};

const handleRequest = () => {
  // 处理页面请求
  console.log(input_data.value);
  let message = getChatData();
  console.log(message);
  let pre_data = JSON.parse(window.localStorage.getItem(route.query.id));
  pre_data['messages'].push({
    role: 'user',
    content: input_data.value
  });
  // pre_data['messages'].push({
  //   role: 'chatbot',
  //   content: message['choices'][0]['message']['content']
  // });
  window.localStorage.setItem(route.query.id, JSON.stringify(pre_data));
};

onMounted(() => {
  // Code to run after component is mounted
  custom_footer.value.$el.style.left = '240px';
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
