<template>
    <div>
        <div v-for="msg in messages">
            <div v-if="msg.Uid == user.uid">
                <div class="msg-username"> {{msg.Username}}</div>
                <div v-if="msg.isImage">
                    <div class="chat-container" ref="chatContainer">
                        <div class="chatImage">
                            <v-img height="200" :src="msg.url" @load="loaded" @click="launchImg(msg)"/>
<!--                            <v-progress-circular class="cloakSpinner" indeterminate color="primary"/>-->
                        </div>
                        <avatar class="avatarCircle" :username="msg.Username"/>
                    </div>
                </div>
                <div v-else>
                    <div class="chat-container" ref="chatContainer" >
                        <div class="speech-bubble" v-bind:style="{ background: msg.Color }"> {{msg.Message}}</div>
                        <avatar :username="msg.Username"/>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="msg-username-1"> {{msg.Username}}</div>
                <div v-if="msg.isImage">
                    <div class="chat-container-1" ref="chatContainer">
                        <avatar class="avatarCircle" :username="msg.Username"/>
                        <div class="chatImage-1">
                            <v-img height="200" :src="msg.url" @load="loaded" @click="launchImg(msg)"/>
<!--                            <v-progress-circular class="cloakSpinner" indeterminate color="primary"/>-->
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="chat-container-1" ref="chatContainer">
                        <avatar :username="msg.Username"/>
                        <div class="speech-bubble-1" v-bind:style="{background: msg.Color}"> {{msg.Message}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Avatar from 'vue-avatar'

    export default {
        name: "Message",
        data() {
            return {
                stuff: null,
                isLoaded: false
            }
        },
        props: [
            'messages',
            'user'
        ],
        components: {
            Avatar
        },

        mounted() {

        },

        methods: {
            loaded(evt) {
                let ldiv = document.getElementsByClassName('msgContainer')[0]
                if (ldiv.scrollHeight - ldiv.clientHeight <= ldiv.scrollTop + 50) {
                    ldiv.scrollTop = ldiv.scrollHeight
                }
                let elems = document.getElementsByClassName('chatImage')

                for (let i = 0; i < elems.length; i++) {
                    elems.item(i).style.height = 'auto'
                    // elems.item(i).style.width = 'auto'
                }

            },
            launchImg(msg) {
                this.$emit('expandImage',msg)
            }
        }
    }
</script>

<style scoped>

    .cloakSpinner {
        margin: 0 auto;
    }

    .avatarCircle {

    }

    .chatImage {
        cursor: pointer;
        max-width: 200px;
        padding-right: 10px;
    }

    .chatImage-1 {
        cursor: pointer;
        max-width: 200px;
        padding-left: 10px;
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

    .chat-container {
        position: relative;
        padding-right: 5px;
        display: flex;
        justify-content: flex-end;
    }

    .chat-container-1 {
        padding-left: 5px;
        display: flex;
        justify-content: flex-start;
    }

    .speech-bubble {
        padding: 10px;
        border-radius: .4em;
        background: #00aabb;
        max-width: 400px;
        color: white;
        margin: 4px 10px 10px 10px;
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
        margin: 4px 10px 10px 10px;
        overflow-wrap: break-word;
        text-align: left;
    }

    @media screen and  (max-width: 600px) {

        .chatImage {
            max-width: 200px;
            padding-right: 10px;
        }

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
