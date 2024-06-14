<template>
    <n-layout id="chatview" content-style="padding: 6%; padding-left: 15%; padding-right: 15%" :native-scrollbar="false"
        @click="contentRef?.scrollTo({ top: 200, behavior: 'smooth' })" ref="contentRef" style="bottom: 64px;">
        <div v-for="item in MessageList" style="margin-bottom: 10px;">
            <n-card :title="item.role" width hoverable size="small">
                <n-card-content>
                    <div v-html="markdown.render(item.content) "></div>
                    <!-- <vue-markdown :source="item.content"></vue-markdown> -->
                    <!-- <p></p> -->
                </n-card-content>
            </n-card>
        </div>
    </n-layout>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import { watch } from 'vue';
import MarkdownIt from 'markdown-it';
const markdown = new MarkdownIt()

const contentRef = ref(null);


const route = useRoute();
const id = ref();
const MessageList = ref([]);


onMounted(() => {
    updateData();
    // 滚动到底部
    // console.dir(contentRef.value.$el.clientHeight);

    // 渲染当前id的聊天记录
    window.addEventListener('updateChatView', updateData);
});

watch(() => route.query.id, () => {
    MessageList.value = [];
    console.log('watch');
    updateData()
});

function updateData() {
    // console.log('updateData');
    // console.log(route.query.id);
    let id = route.query.id;
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        // 得到当前id的JSON数据
        let item = JSON.parse(localStorage.getItem(key));
        console.log(item);
        if (item.id === id) {
            MessageList.value = item.messages;
        }
    }
    // MessageList = reactive(currentChat);
}
</script>
<style lang="scss">
body {
    font-family: Quotes, sans-serif;
}

.n-card-header {
    // 不居中
    text-align: left;
}

.n-card__content {
    // 不居中
    text-align: left;
}
</style>
