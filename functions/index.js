const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue

exports.deleteOldestMessage = functions.firestore.document('Groups/{groupId}/Messages/{msgId}').onCreate((snap, context) => {

        return db.collection('Groups').doc(context.params.groupId).get().then(function (doc) {
            if (doc.data().is50) { //Delete the oldest message
                db.collection('Groups').doc(context.params.groupId).collection('Messages').orderBy('Time').limit(1).get().then(function (snapshot) {
                    snapshot.forEach(function (document) {
                        let doc = document.data()
                        db.collection('Groups').doc(context.params.groupId).collection('Messages').doc(document.id).delete().then(function() {
                            if (doc.isImage) {
                                admin.storage().bucket('gs://utopia-3ef96.appspot.com/').file(doc.imagePath).delete().then(function () {
                                    console.log('Deleted from Storage')
                                })
                            }
                        })
                    })
                })
            } else {
                //Count how many messages we have in a group
                let count = 0

                    db.collection('Counters').doc(context.params.groupId).collection('Shards').get().then(function (snapshot) {
                        snapshot.forEach(function (document) {
                            count += document.get('count')
                        })
                        console.log(count)

                        if (count === 49) {
                            db.collection('Groups').doc(context.params.groupId).update({
                                is50: true
                            }).then(function () {
                                console.log('Reached 50 messages')
                            })
                        }

                        const shardId = Math.floor(Math.random() * 7);
                        const shardRef = db.collection('Counters').doc(context.params.groupId).collection('Shards').doc(shardId.toString())
                        shardRef.update({count: FieldValue.increment(1)})
                    }).catch((err) => {
                        return Promise.reject(err);
                    })

            }
        }).catch((err) => {
            console.log("There was an error");
            return Promise.reject(err);
        })

})
