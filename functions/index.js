const functions = require("firebase-functions");
const admin = require("firebase-admin");


admin.initializeApp();

exports.setCustomUserClaims = functions.https.onCall(async (data, context) => {
  const {uid, department} = data;

  try {
    if (!context.auth) {
      // If the request is not authenticated, throw an error
      throw new functions.https.HttpsError(
          "unauthenticated",
          "The function must be called while authenticated.",
      );
    }

    // Set custom user claims for the department (role)
    await admin.auth().setCustomUserClaims(uid, {role: department});

    return {message: `Success! Custom claims set for user ${uid}`};
  } catch (error) {
    // Return a detailed error message to the client
    throw new functions.https.HttpsError(
        "internal",
        `Error setting custom claims: ${error.message}`,
    );
  }
});


exports.sendNotificationOnPatientAdded = functions.firestore
    .document("{specialty}/{patientId}")
    .onCreate(async (snap, context) => {
      const specialty = context.params.specialty;
      const message = `A new patient was added to the ${specialty} list`;

      try {
        // Fetch tokens where selectedSpecialty
        // matches the specialty in the context
        const tokensSnapshot = await admin.firestore()
            .collection("notificationTokens")
            .where("selectedSpecialty", "==", specialty)
            .get();

        const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

        if (tokens.length > 0) {
          const payload = {
            notification: {
              title: "New Patient Added",
              body: message,
            },
            android: {
              notification: {
                sound: "default",
              },
            },
            apns: {
              payload: {
                aps: {
                  sound: "default",
                },
              },
            },
            tokens: tokens,
          };

          // Sending the notification to all
          // tokens using sendEachForMulticast
          const response = await admin.messaging()
              .sendEachForMulticast(payload);

          // Handle invalid tokens
          const failedTokens = response.responses
              .filter((result) => !result.success)
              .map((result, index) => ({
                token: tokens[index],
                error: result.error,
              }));

          if (failedTokens.length > 0) {
            console.log("Invalid or unregistered tokens:", failedTokens);
            // Optionally remove invalid tokens from Firestore
          }

          console.log(`${response.successCount}
            notifications were sent successfully`);
          console.log(`${response.failureCount}
            notifications failed to send`);
        } else {
          console.log(`No users have enabled notifications for ${specialty}`);
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });


exports.logActivities = functions.firestore
    .document("/{collection}/{id}")
    .onCreate((snap, context)=> {
      console.log(snap.data());

      const collection = context.params.collection;


      const activities = admin.firestore().collection("activities");

      if (collection === "Cardiology") {
        return activities.add({text: "test seccusful cardiology"});
      }

      if (collection === "Orthopedic Surgery") {
        return activities
            .add({text: "test seccusful orthopedics"});
      }

      return null;
    });


const message = {
  token: "eVy39xc7e8qoIe5mTTE8Q:APA91bFj3MnMOgTc62g9VP2al8y2TaJUp1ughYx5IAAh" +
  "v9N8TivvUMPDYxW6tXC_4kCEd0AwVN" +
  "SLNLgmsefFOCmMx2wlpfQVejMSwL1nIqI4mpQcLRarK7Hb50FnuI_Ep_PHsbKcnQoA",
  notification: {
    title: "Test Notification",
    body: "This is a test message",
  },
};

admin.messaging().send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });

