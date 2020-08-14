<template>
    <div>
        <b-navbar class="navbar" type="dark" variant="dark">
            <b-navbar-brand to="/" v-if="!this.user">
                <img class="nav-logo" src="../assets/logo-nb-white.png"/>
            </b-navbar-brand>
            <b-navbar-brand v-else>
                <img class="nav-logo" src="../assets/logo-nb-white.png"/>
            </b-navbar-brand>
            <b-navbar-nav class="ml-auto" v-if="!this.user">
                <b-nav-item to="/login" right>Login</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto" v-if="this.user">
                <b-nav-item right>
                    <b-dropdown text="My profile" variant="dark" type="dark" right>
                        <b-dropdown-item>View profile</b-dropdown-item>
                        <b-dropdown-item @click="showmodal">Settings</b-dropdown-item>
                        <b-dropdown-item>Help & feedback</b-dropdown-item>
                        <b-dropdown-item @click="logout">Logout</b-dropdown-item>
                    </b-dropdown>
                </b-nav-item>
            </b-navbar-nav>
        </b-navbar>
        <b-modal ref="colorModal" title="Edit Profile" centered @ok="submitColor">
            <div>{{this.username}}</div>
            <avatar inline="true" class="avatarIcon" :username="this.username"/>
            <img class="changeProfilePicture" src="../assets/add.png" ></img>
            <hr>
            <h5>Choose a new bubble color</h5>
            <v-row justify="space-around" align="center">
                <chrome-picker v-model="color" />
            </v-row>
        </b-modal>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import router from "../router";
    import Swal from 'sweetalert2'
    import store from '../store/index'

    import {Push} from 'vue-burger-menu'
    import Avatar from 'vue-avatar'
    import {Chrome} from 'vue-color'

    export default {
        name: "Navbar",
        components: {
            Push,
            Avatar,
            'chrome-picker': Chrome
        },
        data() {
            return {
                menu: [
                    {
                        header: true,
                        title: 'Main Navigation',
                        hiddenOnCollapse: true
                    },
                    {
                        to: '/',
                        title: 'Group chats'
                    }
                ],
                color: store.state.color
            }
        },
        computed: {
            user() {
                return store.state.user
            },
            username() {
                return store.state.username
            }

        },
        // mounted() {
        //     let burgs = document.getElementsByClassName('bm-burger-bars')
        //     for(let i = 0; i < burgs.length; i++) {
        //         burgs.item(i).style.backgroundColor = "#ffffff"
        //     }
        //
        //     let burgMenu = document.getElementsByClassName('bm-burger-button').item(0)
        //     burgMenu.style.marginBottom = "10px"
        //     burgMenu.style.top = "25px"
        //
        // },
        methods: {
            showmodal: function() {
              this.$refs['colorModal'].show()
            },

            submitColor: function() {
                let context = this
                store.commit('setColor', String(this.color.hex))
                firebase.firestore().collection('Users').doc(store.state.user.uid).update({
                    BubbleColor: context.color.hex
                })
            },

            logout: function() {
                let context = this
                firebase.auth().signOut().then(function() {
                    const Toast = Swal.mixin({
                        showConfirmButton: false,
                        timer: 2000
                    });

                    Toast.fire({
                        type: 'success',
                        title: 'Successfully logged out!'
                    });
                    router.push("/welcome")
                    store.commit('logout')
                })
            }
        }
    }
</script>

<style scoped>

    .nav-logo {
        max-height: 60px;
    }

    .bm-burger-bars {
        background-color: #ffffff;
    }

    .navbar {
        height: 50%;
    }

    .changeProfilePicture {
        cursor: pointer;
        position: absolute;
        top: 33px;
        left: 55px;
        z-index: 7;
    }
    .avatarIcon {
        cursor: pointer;
        z-index: 2;
    }

</style>
