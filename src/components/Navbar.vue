<template lang="html">
    <vs-sidebar static-position color="primary" class="sidebarx dark" spacer v-model="active">

      <div class="header-sidebar" slot="header">
        <vs-avatar  size="70px" src="https://randomuser.me/api/portraits/men/85.jpg"/>

        <h4>
          My Name
          <vs-button color="primary" icon="more_horiz" type="flat"/>
        </h4>

      </div>

      <vs-sidebar-group title="Groups">
        <vs-sidebar-item index="1" icon="question_answer">
          Group 1
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group title="Private chats">
        <vs-sidebar-item index="1" icon="question_answer">
          Username 1
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-divider icon="person" position="left">
        User
      </vs-divider>

      <vs-sidebar-item index="3" icon="verified_user">
        Settings
      </vs-sidebar-item>
      <vs-sidebar-item index="4" icon="account_box">
        Profile
      </vs-sidebar-item>
      <vs-sidebar-item index="5" icon="help">
        Help/Give feedback
      </vs-sidebar-item>

      <div class="footer-sidebar" slot="footer">
        <vs-button icon="reply" color="danger" type="flat">log out</vs-button>
        <vs-button icon="settings" color="primary" type="border"></vs-button>
      </div>

    </vs-sidebar>
</template>

<script>
    import firebase from 'firebase'
    import router from "../router";
    import Swal from 'sweetalert2'
    import store from '../store/index'

    import {Push} from 'vue-burger-menu'

    export default {
        name: "Navbar",
        components: {
            Push
        },
        data() {
            return {
                active: true
            }
        },
        computed: {
          user() {
              return store.state.user
          }
        },
        mounted() {
        //     let burgs = document.getElementsByClassName('bm-burger-bars')
        //     for(let i = 0; i < burgs.length; i++) {
        //         burgs.item(i).style.backgroundColor = "#ffffff"
        //     }
        //
        //     let burgMenu = document.getElementsByClassName('bm-burger-button').item(0)
        //     burgMenu.style.marginBottom = "10px"
        //     burgMenu.style.top = "25px"
        //
          let bg = document.getElementsByClassName('vs-sidebar--background').item(0)
          bg.classList.remove("vs-sidebar--background")

          let sidebar = document.getElementsByClassName('vs-sidebar').item(0)
          sidebar.style.width = "45%"
          sidebar.style.height = "100%"
         },
        methods: {
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
                    router.push("/")
                })
            }
        }
    }
</script>

<style lang="stylus">
.parentx-static
  height 20px
  position relative

.vs-sidebar
  width 40%
  float left

.header-sidebar
  display flex
  align-items center
  justify-content center
  flex-direction column
  width 100%
  h4
    display flex
    align-items center
    justify-content center
    width 100%
    > button
      margin-left 10px
.footer-sidebar
  display flex
  align-items center
  justify-content space-between
  width 100%
  > button
      border 0px solid rgba(0,0,0,0) !important
      border-left 1px solid rgba(0,0,0,.07) !important
      border-radius 0px !important
</style>
