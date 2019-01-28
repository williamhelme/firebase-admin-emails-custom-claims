var express = require("express");
var admin = require("firebase-admin");
var bodyParser = require("body-parser");
var config = require("./config.json");
var appConfig = require("./app-config.json");

var app = express();

app.use(function(req, res, next) {
  //setup express server to run custom claims locally
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (appConfig) {
  admin.initializeApp({
    credential: admin.credential.cert(appConfig),
    databaseURL: config.databaseURL
  });
} else {
  console.log("No firebase application configuration provided");
}

const validUsers = config.validUsers || [];

app.post("/setCustomClaims", (req, res) => {
  // Get the ID token passed.
  const idToken = req.body.idToken;
  // Verify the ID token and decode its payload.
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(claims => {
      // Verify user is eligible for additional privileges.
      if (
        typeof claims.email !== "undefined" &&
        typeof claims.email_verified !== "undefined" &&
        claims.email_verified &&
        validUsers.includes(claims.email)
      ) {
        // Add custom claims for additional privileges.
        admin
          .auth()
          .setCustomUserClaims(claims.sub, {
            admin: true
          })
          .then(() => {
            // Tell client to refresh token on user.
            res.end(
              JSON.stringify({
                status: "success"
              })
            );
          });
      } else {
        // Return nothing.
        res.end(JSON.stringify({ status: "ineligible" }));
      }
    });
});

app.listen(port, () =>
  console.log(`Example app listening on port ${config.port}!`)
);
