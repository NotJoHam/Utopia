const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.deleteOldestMessage = functions.firestore.document('Groups/{groupId}/Messages/{msgId}').onCreate((snap, context) => {
    db.collection('Groups').doc(context.params.groupId).get().then(function(doc) {
        let count = doc.data().msgCount
        if (count > 50) {
            db.collection('Groups').doc(context.params.groupId).collection('Messages').orderBy('Time').limit(count - 45).get().then(function(snapshot) {

                snapshot.forEach(function(document) {
                    if (document.isImage) {
                        admin.storage().bucket('gs://utopia-3ef96.appspot.com/').file(document.imagePath).delete()
                    }
                    db.collection('Groups').doc(context.params.groupId).collection('Messages').doc(document.id).delete()
                })

                db.collection('Groups').doc(context.params.groupId).update({
                    msgCount: 45
                })
            })
        }
    })

})
