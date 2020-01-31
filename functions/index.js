const functions = require('firebase-functions');
const Spotify = require('spotify-web-api-node')

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// exports.getSpotifyAccessToken = functions.https.onCall((data, context) => {
//     const code = data.code
//
//     var credentials = {
//       clientId: 'bd665f98c8c748b9ae7ecff411ab8515',
//       clientSecret: '041ad1337be34e0b91eb72af11f12ee2'
//     };
//
//     var spotify = new Spotify(credentials);
//     var access_token
//     var expires_in
//
//     return spotify.clientCredentialsGrant().then(
//       function(data) {
//           console.log('The token expires in ' + data.body['expires_in']);
//           console.log('The access token is ' + data.body['access_token']);
//
//           // Set the access token on the API object to use it in later calls
//
//           access_token = data.body['access_token'];
//           expires_in = data.body['expires_in'];
//
//           return {
//               access_token: access_token
//           };
//       }
//     );
// })
//
// exports.refreshSpotifyToken = functions.https.onCall((data, context) => {
//     const code = data.code
//
//     var credentials = {
//       clientId: 'bd665f98c8c748b9ae7ecff411ab8515',
//       clientSecret: '041ad1337be34e0b91eb72af11f12ee2',
//       redirectUri: 'http://localhost:8080'
//     };
//
//     var spotify = new Spotify(credentials);
//     var access_token
//     var refresh_token
//     var expires_in
//
//     return spotify.refreshAccessToken(code).then(
//       function(data) {
//           console.log('The token expires in ' + data.body['expires_in']);
//           console.log('The access token is ' + data.body['access_token']);
//           console.log('The refresh token is ' + data.body['refresh_token']);
//
//           // Set the access token on the API object to use it in later calls
//
//           access_token = data.body['access_token'];
//           refresh_token = data.body['refresh_token'];
//           expires_in = data.body['expires_in'];
//
//           return {
//               access_token: access_token,
//               refresh_token: refresh_token
//           };
//       }
//     );
// })

exports.deleteOldestMessage = functions.firestore.document('Groups/{groupId}/Messages/{msgId}').onCreate((snap, context) => {
    db.collection('Groups').doc(context.params.groupId).get().then(function(doc) {
        let count = doc.data().msgCount
        if (count > 50) {
            db.collection('Groups').doc(context.params.groupId).collection('Messages').orderBy('Time').limit(count - 40).get().then(function(snapshot) {

                snapshot.forEach(function(document) {
                    let doc = document.data()
                    if (doc.isImage) {
                        admin.storage().bucket('gs://utopia-3ef96.appspot.com/').file(doc.imagePath).delete().then(function() {
                            console.log('Deleted from Storage')
                        })
                    }
                    db.collection('Groups').doc(context.params.groupId).collection('Messages').doc(document.id).delete()
                })

                db.collection('Groups').doc(context.params.groupId).update({
                    msgCount: 40
                })
            })
        }
    })

})
