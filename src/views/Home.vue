<template>
    <div>
        <div>
            <div class="homeContainer" :style="{ 'height': `calc(96 * ${innerHeight}px - ${navbarHeight}px`}">
                <div id="msgContainer" class="msgContainer" :style="{ 'max-height': `calc(100% - ${offsetHeight}px`}">
                    <message :messages="messages" :user="user" :sources="sources"/>
                </div>
                <div style="display: flex; margin: 10px 0 10px 0;">
                    <v-btn icon @click="launchFilePicker" style="height: 62px;"> <v-icon>mdi-camera</v-icon></v-btn>
                    <input class="file-picker" type="file" ref="imagePicker" accept="image/*" style="display: none" @change="onFileChange($event.target.name, $event.target.files)"/>
                    <b-form-textarea type="text" class="msgInput" v-model="userMsg" placeholder="Enter your message" rows="0" max-rows="6"
                                     no-resize v-on:keyup.enter="sendMessage"/>
                    <v-btn icon @click="sendMessage" style="height: 62px;"> <v-icon> mdi-send </v-icon> </v-btn>
                </div>
            </div>
            <b-modal ref="firstLoginModal" title="Just a little more information from you!" no-close-on-backdrop hide-header-close
                     no-close-on-esc ok-only centered @ok="handleOk">
                <form ref="usernameForm" @submit.stop.prevent="handleSubmit">
                    <b-form-group :state="usernameState" label="Username" label-for="username-input" invalid-feedback="Username is required">
                        <b-form-input id="username-input" v-model="username" :state="usernameState"/>
                    </b-form-group>
                </form>
            </b-modal>
            <b-modal ref="imageModal" title="Are you sure you want to use this picture?" @ok="sendMessage" @cancel="cancelImage" centered>
                <b-img class="modal-image" fluid :src="imagePreview"/>
            </b-modal>
        </div>
        <b-button @click="playMusic">Play</b-button>
        <b-button @click="pauseMusic">Pause</b-button>
        <div> Artist: {{artist}}</div>

        <div>Song: {{songName}}</div>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import store from '../store'
    import Message from '../components/Message'
    import Swal from 'sweetalert2'
    import EXIF from 'exif-js'
    import uuid from 'uuid/v1'
    import getOrientedImage from 'exif-orientation-image'
    import SpotifyApi from 'spotify-web-api-node'

    let db = firebase.firestore()
    let functions = firebase.functions()

    export default {
        name: "Home",
        data() {
            return {
                user: null,
                validState: false,
                active: false,
                justify: 'end',
                messages: [],
                userMsg: '',
                username: '',
                offsetHeight: 0,
                navbarHeight: 0,
                innerHeight: 0,
                scrollTop: 0,
                scrollHeight: 0,
                clientHeight: 0,
                groupId: 'D2LPkAyE8ZEVLl7AYqPg',
                color: store.state.user.BubbleColor,
                value: null,
                image: null,
                sources: [],
                imagePreview: '',
                spotifyToken: null,
                spotify: null,
                device_id: null,
                songSrc: null,
                artist: '',
                songName: '',
                player: null

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

        beforeCreate() {
            store.commit('login', firebase.auth().currentUser)
        },

        created() {
            let context = this
            this.user = firebase.auth().currentUser

            db.collection('Users').doc(this.user.uid).get().then(function (doc) {
                if (doc.exists) {
                    context.firstLogin = doc.get('FirstLogin')
                    context.username = doc.get('Username')
                    context.color = doc.get('BubbleColor')
                    store.commit('setColor', context.color)
                }
            })
            if (context.$route.params.FirstLogin || context.firstLogin) {
                context.$nextTick(() => {
                    context.$refs['firstLoginModal'].show()
                })
            }

            db.collection("Groups").doc('D2LPkAyE8ZEVLl7AYqPg').collection("Messages").orderBy('Time').onSnapshot(function (querySnapshot) {
                querySnapshot.docChanges().forEach(function (change) {
                    if (change.type === "added") {
                        context.messages.push(change.doc.data())
                    } else if (change.type === "removed") {
                        context.messages.shift()
                    }
                })

            })
        },

        beforeMount() {
            let context = this

            this.spotify = new SpotifyApi({
                clientId: 'bd665f98c8c748b9ae7ecff411ab8515',
                redirectUri: 'http://localhost:8080'
            })
            let recaptchaScript = document.createElement('script')
            recaptchaScript.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js')
            document.head.appendChild(recaptchaScript)

            if (this.$route.query.code) {
                let code = this.$route.query.code
                window.onSpotifyWebPlaybackSDKReady = () => {
                    let getAccessToken = firebase.functions().httpsCallable('getSpotifyAccessToken')
                    let token
                    getAccessToken({code: code}).then(function (result) {
                        console.log('Got token')
                        token = result.data.access_token

                        context.spotify.setAccessToken(token)


                        context.player = new Spotify.Player({
                            name: 'Web Playback SDK Quick Start Player',
                            getOAuthToken: cb => {
                                cb(token);
                            }
                        });

                        // Error handling
                        player.addListener('initialization_error', ({message}) => {
                            console.error(message);
                        });
                        player.addListener('authentication_error', ({message}) => {
                            console.error(message);
                        });
                        player.addListener('account_error', ({message}) => {
                            console.error(message);
                        });
                        player.addListener('playback_error', ({message}) => {
                            console.error(message);
                        });

                        // Playback status updates
                        player.addListener('player_state_changed', state => {
                            // console.log(state);
                        });

                        // Ready
                        player.addListener('ready', ({device_id}) => {
                            context.device_id = device_id
                            console.log('Ready with Device ID', device_id);
                        });

                        // Not Ready
                        player.addListener('not_ready', ({device_id}) => {
                            console.log('Device ID has gone offline', device_id);
                        });

                        // Connect to the player!
                        player.connect();
                    })

                };
            }
        },

        mounted() {
            let context = this

            this.$nextTick(() => {
                const nav = document.getElementsByClassName('navbar')[0]
                context.navbarHeight = nav ? nav.offsetHeight : 0
                const txtarea = document.getElementsByClassName('msgInput')[0]
                context.offsetHeight = txtarea ? txtarea.offsetHeight : 0
                this.innerHeight = window.innerHeight * 0.01
            })


            if (this.$route.query.code) {
                let code = this.$route.query.code

                let getAccessToken = firebase.functions().httpsCallable('getSpotifyAccessToken')
                getAccessToken({code: code}).then(function (result) {
                    let accessToken = result.data.access_token

                    context.spotify.setAccessToken(accessToken)

                    context.spotify.searchTracks('track:X artist:Poppy').then(function (data) {
                        console.log(data.body.tracks.items[0])
                        context.songName = data.body.tracks.items[0].name
                        context.artist = data.body.tracks.items[0].artists[0].name
                        context.songSrc = data.body.tracks.items[0].uri
                    })
                })
                console.log(this.spotify)


            }

            // spotify.clientCredentialsGrant().then(function(data) {
            //     console.log(data.body['access_token'])
            //     spotify.setAccessToken(data.body['access_token'])
            // })


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
                context.offsetHeight = txtarea ? txtarea.offsetHeight : 0
                let ldiv = document.getElementsByClassName('msgContainer')[0]

                if (context.scrollHeight - context.clientHeight <= context.scrollTop + 1) {
                    ldiv.scrollTop = ldiv.scrollHeight - ldiv.clientHeight
                }
            })
        },

        methods: {

            pauseMusic() {
                this.spotify.pause()
            },

            playMusic() {

                this.spotify.play({uris: [this.songSrc], device_id: this.device_id})
            },

            launchFilePicker() {
                this.$refs.imagePicker.click()
            },

            onFileChange(fieldName, file) {
                let context = this
                if (file.length > 0) {
                    let imageFile = file[0]
                    this.image = imageFile
                    // EXIF.getData(imageFile, function() {
                    //     console.log(EXIF.getAllTags(this))
                    // })
                    let img = document.getElementsByClassName('file-picker')[0]
                    new Promise((resolve, reject) => {
                        getOrientedImage(imageFile, function (err, canvas) {
                            if (!err) {
                                canvas.toBlob(function (blob) {
                                    resolve(blob)
                                }, imageFile.type, 1)
                            }
                        })
                    }).then((orientedImageBlob) => {
                        this.$refs['imageModal'].show()
                        context.image = orientedImageBlob
                        context.imagePreview = window.URL.createObjectURL(orientedImageBlob)
                    })

                }

            },

            cancelImage() {
                this.$refs['imageModal'].hide()
                this.image = null
                this.imagePreview = ''
            },

            sendMessage() {
                if (this.userMsg.trim() != '' | this.image !== null) {
                    let msg = this.userMsg
                    this.userMsg = ''
                    let context = this
                    let isImage = this.image ? true : false

                    if (isImage) {
                        firebase.storage().ref().child('Images/' + uuid()).put(context.image).then(function (snap) {
                            firebase.storage().ref(snap.ref.fullPath).getDownloadURL().then(function (url) {
                                db.collection('Groups').doc(context.groupId).collection('Messages').add({
                                    Message: '',
                                    Uid: context.user.uid,
                                    Time: Date.now(),
                                    Username: context.username,
                                    Color: store.state.color,
                                    isImage: true,
                                    url: url,
                                    imagePath: snap.ref.fullPath
                                }).then(function () {
                                    let incr = firebase.firestore.FieldValue.increment(1)
                                    db.collection('Groups').doc(context.groupId).update({msgCount: incr})

                                })
                            })

                            const Toast = Swal.mixin({
                                showConfirmButton: false,
                                timer: 1500
                            });
                            Toast.fire({
                                type: 'success',
                                title: 'Successfully uploaded image!'
                            });
                        })
                        context.image = null
                    } else {
                        db.collection('Groups').doc(this.groupId).collection('Messages').add({
                            Message: isImage ? '' : msg,
                            Uid: context.user.uid,
                            Time: Date.now(),
                            Username: context.username,
                            Color: store.state.color,
                            isImage: false,
                            url: '',
                            imagePath: ''
                        }).then(function () {
                            let incr = firebase.firestore.FieldValue.increment(1)
                            db.collection('Groups').doc(context.groupId).update({msgCount: incr})
                        })
                    }

                } else {
                    this.userMsg = ''
                }
            },

            checkFormValidity() {
                this.validState = this.username === ''
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
                if (this.checkFormValidity()) {
                    return
                }

                db.collection('Users').doc(store.state.user.uid).update({
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
        height: 100%;
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
        background: linear-gradient(0deg, rgba(33,33,33,1) 0%, rgba(89,89,89,1) 35%, rgba(191,191,191,1) 100%);
        border-radius: 10px;
    }

    .msgInput {
        width: 90%;
        margin-bottom: 5px;
    }

    .img90 {
        -webkit-transform:rotate(90deg);
        -moz-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        transform: rotate(90deg);
    }

</style>
