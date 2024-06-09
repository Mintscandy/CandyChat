<template>
    <n-layout content-style="padding: 6%; padding-left: 15%; padding-right: 15%" :native-scrollbar="false"
        style="bottom: 64px;">
        <div v-for="item in MessageList">
            <n-card :title="item.role" width hoverable size="small">
                <n-card-content>
                    <p>{{ item.content }}</p>
                </n-card-content>
            </n-card>
        </div>
    </n-layout>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import { watch } from 'vue';

const route = useRoute();
const id = ref();
const MessageList = reactive([]);

onMounted(() => {
    // updateData()
});

watch(() => route.query.id, () => {
    updateData()
});

function updateData() {
    // console.log('updateData');
    // console.log(route.query.id);
    id.value = route.query.id;
    MessageList.push({
        role: 'user',
        content: 'Hello 怎么办'
    });
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
