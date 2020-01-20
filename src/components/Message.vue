<template>
    <div>
        <div v-for="msg in messages">
            <div v-if="msg.Uid == user.uid">
                <div class="msg-username"> {{msg.Username}}</div>
                <div v-if="msg.isImage">
                    <div class="chat-container" ref="chatContainer">
                        <div class="speech-bubble" v-bind:style="{background: msg.Color}"> <b-img  fluid class="img" :src="msg.url"/></div>
                    </div>
                </div>
                <div v-else>
                    <div class="chat-container" ref="chatContainer" >
                      <div class="speech-bubble" v-bind:style="{ background: msg.Color }"> {{msg.Message}}</div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="msg-username-1"> {{msg.Username}}</div>
                <div v-if="msg.isImage">
                    <div class="chat-container-1" ref="chatContainer">
                        <div class="speech-bubble-1" v-bind:style="{background: msg.Color}"> <b-img  fluid class="img" :src="msg.url"/></div>
                    </div>
                </div>
                <div v-else>
                    <div class="chat-container-1" ref="chatContainer">
                        <div class="speech-bubble-1" v-bind:style="{background: msg.Color}"> {{msg.Message}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import store from '../store'


    export default {
        name: "Message",
        data() {
            return {
                stuff: null
            }
        },
        props: [
            'messages',
            'user',
            'sources'
        ],

        methods: {
        }
    }
</script>

<style scoped>

    .msg-username {
        display: flex;
        justify-content: flex-end;
        margin: 3px 10px 0 0;
    }

    .msg-username-1 {
        display: flex;
        justify-content: flex-start;
        margin: 3px 10px 0 0;
    }

    .chat-container {
        display: flex;
        justify-content: flex-end;
    }

    .chat-container-1 {
        display: flex;
        justify-content: flex-start;
    }

    .speech-bubble {
        padding: 10px;
        border-radius: .4em;
        background: #00aabb;
        max-width: 400px;
        color: white;
        margin: 0 10px 10px 10px;
        overflow-wrap: break-word;
        text-align: left;
        max-height: 600px;
    }

    .speech-bubble-1 {
        padding: 10px;
        background: coral;
        border-radius: .4em;
        max-width: 400px;
        color: white;
        margin: 0 10px 10px 10px;
        overflow-wrap: break-word;
        text-align: left;
    }

    .img {
        max-height: 600px
    }

    @media screen and  (max-width: 600px) {
		.speech-bubble {
			padding: 10px;
            background: #00aabb;
            border-radius: .4em;
            max-width: 200px;
            color: white;
            margin: 0 10px 5px 0;
            overflow-wrap: break-word;
            text-align: left;
		}

        .speech-bubble-1 {
            padding: 10px;
            background: coral;
            border-radius: .4em;
            max-width: 200px;
            color: white;
            margin: 0 5px 5px 0;
            overflow-wrap: break-word;
            text-align: left;
        }
        .msg-username {
            display: flex;
            justify-content: flex-end;
            margin: 3px 10px 0 0;
        }

        .msg-username-1 {
            display: flex;
            justify-content: flex-start;
            margin: 3px 10px 0 0;
        }

	}

</style>
