<template>
    <div>
        <b-button @click="connectToSpotify">Connect to Spotify</b-button>
    </div>
</template>

<script>
    import Spotify from 'spotify-web-api-node'
    export default {
        name: "Profile",
        data() {
            return {
                spotify: null
            }
        },
        mounted() {
             this.spotify = new Spotify({
                clientId: 'bd665f98c8c748b9ae7ecff411ab8515',
                 redirectUri: 'http://localhost:8080'
            })
        },
        methods: {
            connectToSpotify() {
                let scopes = ["streaming", "user-read-email", "user-read-private"],
                state = 'Test'

                let url = this.spotify.createAuthorizeURL(scopes, state)
                window.location.href = url
            }
        }
    }
</script>

<style scoped>

</style>
