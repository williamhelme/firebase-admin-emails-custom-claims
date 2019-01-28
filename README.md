# Firebase Admin Emails via Custom Claims

This Node.js Express server will provide you with an endpoint to create an admin attribute on a authorized user when using Google Firebase.

## Getting Started

- Clone this repo `git clone https://github.com/williamhelme/firebase-admin-emails-custom-claims.git`
- Update the _app-config.json_ file to include the config provided by Firebase (Settings -> Service Accounts -> Firebase Admin SDK -> Gemerate new private key). It should look something like this:
  ```json
  {
    "type": "",
    "project_id": "",
    "private_key_id": "",
    "private_key": "",
    "client_email": "",
    "client_id": "",
    "auth_uri": "",
    "token_uri": "",
    "auth_provider_x509_cert_url": "",
    "client_x509_cert_url": ""
  }
  ```
- Also update the _config.json_ to change the **databaseURL** and the **validUsers** properties to work with your application. You can also edit the port the Express server is running on.
  ```json
  {
    "databaseURL": "https://<your-app-name>.firebaseio.com",
    "validUsers": ["test@example.com", "example@test.com"],
    "port": "8000"
  }
  ```

### Installing

Once the config is setup, all that is required is to run `npm start` from the console and now your firebase app can set an admin property to a user.

Below is a javascript example of how you would access this endpoint in the firebase auth process. After the token refresh the admin property should appear.

```javascript
auth.signInWithPopup(AuthProvider)
  .then(result => {
    return result.user.getIdToken();
  })
  .then((idToken) => {
    $.post(
      "http://localhost:8000/setCustomClaims",
      {
        idToken: idToken
      },
      (data, status) => {
        if (status == "success" && data) {
          const json = JSON.parse(data);
          if (json && json.status == "success") {
            // Force token refresh.
            fb.auth().currentUser.getIdToken(true);
          }
        }
      }
    );
  })
  .catch(error => {
    console.log(error);
  });
}
```

### Prerequisites

- Node.js
- Git
- npm

## Running the tests

Currently there are no test available.

## Deployment

Run this project on a Node.js server using `npm start`.

## Contributing

Please submit a pull request if you have any improvements.

## License

This project is licensed under the ISC License
