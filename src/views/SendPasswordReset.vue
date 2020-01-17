<template>
    <div class="container">
        <form>
            <img src="../assets/logo-nb.png"/>
            <h4>Enter your email address</h4>
            <input type="email" placeholder="Insert email" v-model="email" required />
            <b-button class="btn-form dox log-in-btn" @click="resetPassword" >Send password reset</b-button>
        </form>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import Swal from 'sweetalert2'
    import router from "../router";

    export default {
        name: "SendPasswordReset",
        data() {
            return {
                email: ''
            }
        },
        methods: {
            resetPassword: function() {
                firebase.auth().sendPasswordResetEmail(this.email).then(function() {
                    const Toast = Swal.mixin({
                        showConfirmButton: false,
                        timer: 2000
                    });

                    Toast.fire({
                        type: 'success',
                        title: 'Sent a link to reset your password to the email you provided'
                    });
                    router.push("/");
                })
            }
        }
    }
</script>

<style scoped>

    form {
        position: absolute;
        text-align: center;
        background: #fff;
        width: 400px;
        height: 600px;
        border-radius: 5px;
        padding: 30px 20px 0 20px;
        box-shadow: 0 10px 50px 0 rgba(0, 0, 0, 0.25);
        box-sizing: border-box;
    }

    .container{
        position:absolute;
        width: auto;
        height:auto;
        top: calc(50% - 240px);
        left: calc(50% - 160px);
    }

    input {
        border: none;
        border-bottom: 1px solid #7a95e6;
        width: 85%;
        font-family: 'Roboto';
        color: #547fff;
        text-align: center;
        font-size: 21px;
        font-weight:100;
        margin-bottom:25px;
    }

    img {
        width: 100%;
        height: auto;
    }

    button{
        outline: none !important;
    }

    button.tw {
        border: none;
        background: #3b5998;
        width: 160px;
        height: 25px;
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
        color: #fff;
        text-transform: uppercase;
        border-radius: 4px;
        border: 1px solid #29487d;
        cursor: pointer;
        margin-bottom: 20px;
        transition:all 0.3s linear;
    }
    button.tw:hover {
        background: #fff;
        color: #3b5998;
    }

    button.btn-form {
        position: absolute;
        width: 100%;
        height: 60px;
        bottom: 0;
        border: 0;
        font-family: 'Dosis';
        font-size: 24px;

    }

    button.btn-form.sox {
        left: 0;
        border-radius: 0 0 0 5px;
        background-color: rgba(84, 127, 255, 0.35);
        color: #fff;
        transition:all 0.3s linear;
    }

    button.btn-form.sox:hover {
        background-color:rgba(84, 127, 255, 0.65);
        color: #fff;
    }

    button.btn-form.sox.log-in {
        background-color: rgba(0, 0, 0, 0.15);
        transition:all 0.3s linear;
    }

    button.btn-form.sox.log-in:hover {
        background-color: rgba(0, 0, 0, 0.35);
    }

    button.btn-form.dox {
        right: 0;
        border-radius: 0 0 5px 0;
        background-color: #547fff;
        color: #fff;
    }

    @media screen and  (max-width: 600px) {
		form {
			position: absolute;
			text-align: center;
			background: #fff;
			width: 300px;
			height: 500px;
			border-radius: 5px;
			padding: 30px 20px 0 20px;
			box-shadow: 0 10px 50px 0 rgba(0, 0, 0, 0.25);
			box-sizing: border-box;
		}
	}

</style>
