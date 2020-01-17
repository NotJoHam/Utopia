<template>
	<div>
   		<div class="container">
			<validation-observer v-slot="{handleSubmit}">
				<form class="signUp" @submit.prevent="handleSubmit(onSignUp)">
					<h3>Create Your Account</h3>
					<p>Just enter your email address<br>and your password to join.</p>
					<validation-provider name="Email" rules="required|email" v-slot="{errors}">
						<input type="email" placeholder="Insert email" v-model="email" autocomplete='off' />
						<span class="error">{{errors[0]}}</span>
					</validation-provider>
					<validation-provider name="Password" rules="required|passwordLen|password:@confirm" v-slot="{errors}">
						<input type="password" placeholder="Insert Password" v-model="password"/>
						<span class="error">{{ errors[0] }}</span>
					</validation-provider>
					<validation-provider name="confirm" rules="required" v-slot="{errors}">
						<input type="password" placeholder="Verify Password" v-model="confirmation" />
					</validation-provider>
					<b-button class="btn-form sox log-in" type="button" @click="switchToLogin">Back</b-button>
					<b-button class="btn-form dox sign-up-btn" type="submit" v-bind:disabled="btnClicked">
						<b-spinner medium v-if="btnClicked"/>
						<span v-if="!btnClicked">Sign up</span>
					</b-button>
				</form>
			</validation-observer>
			<validation-observer v-slot="{handleSubmit}">
				<form class="sign-in" @submit.prevent="handleSubmit(onLogin)">
					<h3>Welcome<br>Back !</h3>
					<button class="tw" type="button" @click="openTwitter" @click.prevent="preventDefault">Log In With Twitter</button>
					<p>- or -</p>
					<validation-provider name="Email" rules="required|email" v-slot="{errors}">
						<input type="email" placeholder="Insert email" v-model="email" autocomplete='off' />
						<span class="error">{{errors[0]}}</span>
					</validation-provider>
					<validation-provider name="Password" rules="required" v-slot="{errors}">
						<input type="password" placeholder="Insert Password" v-model="password"/>
						<span class="error">{{ errors[0] }}</span>
					</validation-provider>
					<br/>
					<b-link class="forgot" to="/sendPasswordReset">Forgot password?</b-link>
					<b-button class="btn-form sox back" type="button" @click="switchToSignUp">Sign Up</b-button>
					<b-button class="btn-form dox log-in-btn" type="submit" v-bind:disabled="btnClicked">
						<b-spinner medium v-if="btnClicked"/>
						<span v-if="!btnClicked">Log in</span>
					</b-button>
				</form>
			</validation-observer>
   		</div>
	</div>
</template>

<script>
	import firebase from 'firebase'
	import router from '../router/index'
	import store from '../store/index'
	import Swal from 'sweetalert2'

	let loginElement = document.getElementsByClassName("sign-in");
    let signUp = document.getElementsByClassName("signUp");
    //let provider = new firebase.auth.TwitterAuthProvider();
	let db = firebase.firestore()

    export default {
        name: "Login",
        data() {
            return {
                email: '',
                password: '',
				btnClicked: false,
				confirmation: '',
				ip: null
            }
        },

		mounted() {
        	let context = this
        	fetch('https://api.ipify.org/?format=json')
					.then((resp) => resp.json())
					.then(function(data) {
						context.ip = data.ip
					})
		},
        methods: {
        	//This method is called when the form is submitted. Typical HTML form submission methodology
        	onSignUp() {
        		this.btnClicked = true

				//We need this to access "this" from inside of the firebase call
				let context = this;

                firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
                    function () {
                    	let context = this
                    	//Get a proper Firebase timestamp
                    	let ts = firebase.firestore.FieldValue.serverTimestamp()
						//Get the user's IP address to store in the database
						//TODO: Check to make sure this IP address is not malicious nor comes from a VPN
						db.collection("Users").doc(firebase.auth().currentUser.uid).set({
							Email: context.email,
							TimeCreated: ts,
							IP: context.ip,
							Username: '',
							FirstLogin: true,
							LastLogin: ts,
							BubbleColor: '#00aabb'
						});

                        const Toast = Swal.mixin({
                        showConfirmButton: false,
                        timer: 2000
                    	});
						Toast.fire({
							type: 'success',
							title: 'Successfully logged in!'
						});
						store.commit('login', firebase.auth().currentUser)
                        router.push("/");
                    },
                    function (err) {
                    	context.btnClicked = false
                        const Toast = Swal.mixin({
                        	showConfirmButton: false,
                        	timer: 2000
                    	});

						Toast.fire({
							type: 'error',
							title: 'Couldn\'t sign up',
							text: err.message
						})
                    }
                );
			},

			onLogin: function() {
				this.btnClicked = true
        		let context = this
				firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
					return firebase.auth().signInWithEmailAndPassword(context.email, context.password).then(
						function (result) {
							db.collection('Users').doc(firebase.auth().currentUser.uid).update({
								LastLogin: firebase.firestore.FieldValue.serverTimestamp(),
								IP: context.ip
							})
							store.commit('login', firebase.auth().currentUser)
							router.push("/");
						},
						function (err) {
							context.btnClicked = false

							const Toast = Swal.mixin({
								showConfirmButton: false,
								timer: 2000
							});

							Toast.fire({
								type: 'error',
								title: 'Error logging in: ',
								text: err.message
							})
						}
					);
				})
			},

			//Switch to the Sign up form
        	switchToSignUp: function() {
                loginElement[0].classList.add("inactive-dox");
                loginElement[0].classList.remove("active-dox");
                signUp[0].classList.add("active-sox");
                signUp[0].classList.remove("inactive-sox");
            },

			//Switch to the login form
            switchToLogin: function() {
                loginElement[0].classList.add("active-dox");
                loginElement[0].classList.remove("inactive-dox");
                signUp[0].classList.add("inactive-sox");
                signUp[0].classList.remove("active-sox");
            },

			openTwitter: function() {

			}
        }
    }
</script>

<style scoped>

    @import 'https://fonts.googleapis.com/css?family=Dosis|Roboto:300,400';

	.error {
		color: red;
	}

	.forgot {
		margin-top: 20px;
	}

	* {
		margin: 0;
		padding: 0;
	}

	body {
		background: #ffc185;
	}

	.container{
		position:absolute;
		width: auto;
		height: auto;
		top: calc(50% - 240px);
		left: calc(50% - 160px);
	}

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

	p {
		font-family: 'Roboto', sans-serif;
		font-weight: 400;
		text-transform: uppercase;
		font-size: 12px;
		color: #353a40;
		margin-bottom: 20px;
	}

	p > span {
		padding-top: 3px;
		display: block;
		font-weight: 400;
		font-size: 9px;
	}

	h3 {
		font-family: 'Dosis';
		font-size: 35px;
		text-transform: uppercase;
		color: #353a40;
		margin-bottom: 30px;
	}

	input,
	button{
		outline: none !important;
	}

	button.tw {
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
		width: 50%;
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

	input {
		border: none;
		border-bottom: 1px solid #7a95e6;
		width: 100%;
		font-family: 'Roboto';
		color: #547fff;
		text-align: center;
		font-size: 21px;
		font-weight:100;
		margin-bottom:10px;
		margin-top: 20px;
	}

	::-webkit-input-placeholder {
	   color: #7a95e6;
		font-family: 'Roboto';
		font-weight:100;
	}

	:-moz-placeholder {
	   color: #7a95e6;
		font-family: 'Roboto';
		font-weight:100;
	}

	::-moz-placeholder {
	   color: #7a95e6;
		font-family: 'Roboto';
		font-weight:100;
	}

	:-ms-input-placeholder {
	   color: #7a95e6;
		font-family: 'Roboto';
		font-weight:100;
	}

	.signUp input,
	.sign-in .w100 {
		width: 100%;
	}

	.signUp{
			z-index: 1;
			transform: perspective(100px) translate3d(100px, 0px, -30px);
			opacity: 0.5;
	}

	.sign-in {
		z-index: 2;
	}

	.active-dox{
		animation-name: foregrounding-dox;
		animation-duration: 0.9s;
		animation-fill-mode: forwards;
	}

	.active-sox{
		animation-name: foregrounding-sox;
		animation-duration: 0.9s;
		animation-fill-mode: forwards;
	}

	.inactive-dox{
		animation-name: overshadowing-dox;
		animation-duration: 0.9s;
		animation-fill-mode: forwards;
	}

	.inactive-sox{
		animation-name: overshadowing-sox;
		animation-duration: 0.9s;
		animation-fill-mode: forwards;
	}

	@keyframes overshadowing-dox {
		0%{
			z-index:2;
			transform: perspective(100px) translate3d(0px, 0px, 0px);
			opacity: 1;
			box-shadow: 0 10px 50px 0 rgba(0, 0, 0, 0.25);
		}
		100%{
			z-index: 1;
			transform: perspective(100px) translate3d(100px, 0px, -30px);
			opacity: 0.5;
			box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.25);
		}
	}


	@keyframes overshadowing-sox {
		0%{
			z-index:2;
			transform: perspective(100px) translate3d(0px, 0px, 0px);
			opacity: 1;
			box-shadow: 0 10px 50px 0 rgba(0, 0, 0, 0.25);
		}
		100%{
			z-index: 1;
			transform: perspective(100px) translate3d(-100px, 0px, -30px);
			opacity: 0.5;
			box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.25);
		}
	}

	@keyframes foregrounding-dox {
		0%{
			z-index:1;
			transform: perspective(100px) translate3d(100px, 0px, -30px);
			opacity: 0.5;
		}
		50%{
			z-index:2;
			transform: perspective(100px) translate3d(400px, 0px, -30px);
		}
		100%{
			z-index:2;
			transform: perspective(100px) translate3d(0px, 0px, 0px);
			opacity: 1;
		}
	}

	@keyframes foregrounding-sox {
		0%{
			z-index:1;
			transform: perspective(100px) translate3d(-100px, 0px, -30px);
			opacity: 0.5;
		}
		50%{
			z-index:2;
			transform: perspective(100px) translate3d(-400px, 0px, -30px);
		}
		100%{
			z-index:2;
			transform: perspective(100px) translate3d(0px, 0px, 0px);
			opacity: 1;
		}
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
