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
