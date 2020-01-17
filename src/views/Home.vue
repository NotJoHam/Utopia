<template>
    <div>
        <div class="homeContainer" :style="{ 'height': `calc(96 * ${innerHeight}px - ${navbarHeight}px`}">
            <div id="msgContainer" class="msgContainer" :style="{ 'max-height': `calc(100% - ${offsetHeight}px`}">
                <message :messages="messages" :user="user"/>
            </div>
            <div style="display: flex; margin: 10px 0 10px 0;">
                <b-form-textarea type="text" class="msgInput" v-model="userMsg" placeholder="Enter your message" rows="0" max-rows="6" no-resize v-on:keyup.enter="sendMessage"/>
                <v-btn icon @click="sendMessage" style="height: 62px;"> <v-icon> send </v-icon> </v-btn>
            </div>
        </div>
        <b-modal ref="firstLoginModal" title="Just a little more information from you!" no-close-on-backdrop no-close-on-esc cancel-disabled centered @ok="handleOk">
            <form ref="usernameForm" @submit.stop.prevent="handleSubmit">
                <b-form-group :state="usernameState" label="Username" label-for="username-input" invalid-feedback="Username is required">
                    <b-form-input id="username-input" v-model="username" :state="usernameState"/>
                </b-form-group>
            </form>
        </b-modal>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import store from '../store'
    import Message from '../components/Message'

    let db = firebase.firestore()

    export default {
        name: "Home",
        data() {
            return {
                firstLogin: null,
                username: '',
                validState: false,
                active: false,
                justify: 'end',
                messages: [],
                user: firebase.auth().currentUser,
                userMsg: null,
                offsetHeight: 0,
                navbarHeight: 0,
                innerHeight: 0,
                scrollTop: 0,
                scrollHeight: 0,
                clientHeight: 0,
                groupId: 'D2LPkAyE8ZEVLl7AYqPg',
                color: '#00aabb'
            }
        },
        computed: {
            usernameState() {
                return this.username ? true : false
            },
        },

        components: {
            'message': Message,
        },

        created() {
            let context = this
            db.collection('Users').doc(this.user.uid).get().then(function(doc) {
                if (doc.exists) {
                    context.firstLogin = doc.get('FirstLogin')
                    context.username = doc.get('Username')
                    context.color = doc.get('BubbleColor')
                    store.commit('setColor', context.color)
                }
                if (context.firstLogin) {
                    context.$nextTick(() => {
                      context.$refs['firstLoginModal'].show()
                    })
                }
            })

            db.collection("Groups").doc('D2LPkAyE8ZEVLl7AYqPg').collection("Messages").onSnapshot(function(querySnapshot) {
                let msgs = []
                querySnapshot.forEach(function(doc) {
                    msgs.push(doc.data())
                })
                context.messages = msgs.sort(function(a,b) {
                    return a.Time - b.Time
                })

            })
        },

        mounted() {
            let context = this

            this.$nextTick(() => {
                const nav = document.getElementsByClassName('navbar')[0]
                context.navbarHeight = nav ? nav.offsetHeight : 0
                const txtarea = document.getElementsByClassName('msgInput')[0]
                context.offsetHeight =  txtarea ? txtarea.offsetHeight : 0
                this.innerHeight = window.innerHeight * 0.01
            })

        },

        beforeUpdate() {
            let ldiv = document.getElementsByClassName('msgContainer')[0]
            this.scrollTop = ldiv.scrollTop
            this.clientHeight = ldiv.clientHeight
            this.scrollHeight = ldiv.scrollHeight
        },

        updated() {
          let context = this
            this.$nextTick(() => {
                const txtarea = document.getElementsByClassName('msgInput')[0]
                context.offsetHeight =  txtarea ? txtarea.offsetHeight : 0
                let ldiv = document.getElementsByClassName('msgContainer')[0]

                if (context.scrollTop + context.clientHeight == context.scrollHeight) {
                    ldiv.scrollTop = ldiv.scrollHeight
                }
            })
        },

        methods: {

            sendMessage() {
                if (this.userMsg.trim() != '') {
                    let msg = this.userMsg
                    this.userMsg = ''
                    let context = this
                    db.collection('Groups').doc(this.groupId).collection('Messages').add({
                        Message: msg,
                        Uid: context.user.uid,
                        Time: Date.now(),
                        Username: context.username,
                        Color: store.state.color
                    }).then(function () {
                        let incr = firebase.firestore.FieldValue.increment(1)
                        db.collection('Groups').doc(context.groupId).update({msgCount: incr})
                    })

                } else {
                    this.userMsg = ''
                }
            },

            checkFormValidity() {
                this.validState = this.$refs.usernameForm.checkValidity()
                return this.validState
            },
            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                this.handleSubmit()
            },
            handleSubmit() {
                let context = this
                // Exit when the form isn't valid
                if (!this.checkFormValidity()) {
                    return
                }

                db.collection('Users').doc(this.user.uid).update({
                    FirstLogin: false,
                    Username: context.username
                })

                // Hide the modal manually
                this.$nextTick(() => {
                    this.$refs.firstLoginModal.hide()
                })
            }
        }
    }
</script>

<style scoped>

    .homeContainer {
        width: 90%;
        margin: auto;
    }

    .msgContainer {
        height: 90%;
        overflow-y: scroll;
    }

    .msgContainer::-webkit-scrollbar {
        width: 10px;
    }

    .msgContainer::-webkit-scrollbar-track {
        background: #eaeaea;
        border-radius: 10px;
    }

    .msgContainer::-webkit-scrollbar-thumb {
        background: linear-gradient(deepskyblue, #00aabb);
        border-radius: 10px;
    }

    .msgInput {
        width: 90%;
        margin-bottom: 5px;
    }

</style>
