const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue

exports.deleteOldestMessage = functions.firestore.document('Groups/{groupId}/Messages/{msgId}').onWrite((change, context) => {

    if(!change.before.exists) { //Document is added

        db.collection('Groups').doc(context.params.groupId).get().then(function (doc) {
            if (doc.data().is50) { //Delete the oldest message
                db.collection('Groups').doc(context.params.groupId).collection('Messages').orderBy('Time').limit(1).get().then(function (snapshot) {
                    snapshot.forEach(function (document) {
                        let doc = document.data()
                        if (doc.isImage) {
                            admin.storage().bucket('gs://utopia-3ef96.appspot.com/').file(doc.imagePath).delete().then(function () {
                                console.log('Deleted from Storage')
                                return db.collection('Groups').doc(context.params.groupId).collection('Messages').doc(document.id).delete()
                            })
                        } else {
                            return db.collection('Groups').doc(context.params.groupId).collection('Messages').doc(document.id).delete()
                        }
                    })
                })
            } else {
                //Count how many messages we have in a group
                let count = 0
                try {
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
                        return shardRef.update({count: FieldValue.increment(1)})
                    })
                } catch(e) {
                    return e
                }

            }
        })

    }
    // } else if (!change.after.exists) { //Document is deleted
    //     db.collection('Groups').doc(context.params.groupId).update({msgCount: FieldValue.increment(-1)})
    // }

})
