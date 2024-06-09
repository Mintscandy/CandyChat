<template>
    <RouterLink :to="{ name: 'chat', query: { id: chatId } }" style="color: rgb(31, 34, 37);">
        <div class="item_border">
            <div>
                <n-ellipsis style="max-width: 10em">
                    <h4 v-if="!isEdit" style="margin: 0px" id="title">{{ title }}</h4>
                    <n-input v-else style="margin: 0px; text-align: left;" class="title_edit" size="tiny"
                        :placeholder="title" v-model:value="newtitle" @keyup.enter="handleTitleChange" />
                </n-ellipsis>
            </div>
            <div style="flex: 1;"></div>
            <n-dropdown trigger="click" :options="customoptions" @select="handleSelectEvent">
                <n-icon size="26">
                    <svg t="1714908494826" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="19075" width="200" height="200">
                        <path d="M288 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#272636" p-id="19076">
                        </path>
                        <path d="M512 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#272636" p-id="19077">
                        </path>
                        <path d="M736 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#272636" p-id="19078">
                        </path>
                    </svg>
                </n-icon>
            </n-dropdown>
        </div>
    </RouterLink>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { NIcon, SelectOption, SelectGroupOption } from 'naive-ui'



export default defineComponent({
    props: {
        title: String,
        chatId: String
    },
    setup(props) {
        const isEdit = ref(false);
        const title = ref(props.title || '');
        const newtitle = ref(props.title || '');
        const route = useRoute();

        const customoptions: Array<SelectOption> = [
            {
                label: '重命名',
                key: 'rename'
            },
            {
                label: '删除该聊天',
                key: 'delete',
                style: "color: red"
            }
        ];

        const handleSelectEvent = (key: string) => {
            if (key === 'rename') {
                isEdit.value = !isEdit.value;
                // 数据同步

            } else if (key === 'delete') {
                // 删除该聊天
                console.log('delete');
                if (props.chatId) {
                    window.localStorage.removeItem(props.chatId);
                    window.location.reload();
                }
            }
        };

        const handleTitleChange = () => {
            title.value = newtitle.value;
            if (props.chatId){
                window.localStorage.setItem(props.chatId, JSON.stringify({ id: props.chatId, title: newtitle.value, messages: [] }));
            }
            isEdit.value = false;
            console.log('change');
        };

        return {
            title,
            customoptions,
            isEdit,
            newtitle,
            handleSelectEvent,
            handleTitleChange
        };
    },
});
</script>

<style lang="scss">
#title {}

.title_edit {}

.item_border {
    padding: 6%;
    display: flex;
    align-items: center;
}

.item_border:hover {
    background-color: #e5e5e5 !important;
    border-radius: 8px;
}
</style>
