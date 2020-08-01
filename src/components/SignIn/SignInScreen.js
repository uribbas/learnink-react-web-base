// Import FirebaseAuth and firebase.
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase, {auth} from '../../provider/database';

// Configure Firebase.
// const config = {
//   apiKey: 'AIzaSyAeue-AsYu76MMQlTOM-KlbYBlusW9c1FM',
//   authDomain: 'myproject-1234.firebaseapp.com',
//   // ...
// };
// firebase.initializeApp(config);

// Configure FirebaseUI.
const uiConfig = {
  credentialHelper: 'none', //firebaseui.auth.CredentialHelper.NONE,
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: 'select_account'
      }
    },
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      defaultCountry: 'IN',
    },
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        // document.getElementById('loader').style.display = 'none';
        console.log("UI Shown")
      }
    },
};

class SignInScreen extends React.Component {
  render() {
    return (
      <div>
        {/* <h1>My App</h1>
        <p>Please sign-in:</p> */}
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
      </div>
    );
  }
}

export default SignInScreen;
