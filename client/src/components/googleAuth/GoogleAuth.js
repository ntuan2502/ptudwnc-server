import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { signInWithSocial , signOut } from '../../actions'

function GoogleAuth(props) {
  let [auth, setAuth] = useState(null);
  useEffect(() => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: '548137828209-gl2rhrf3tl61omtrufn1uh6hjtqkinjm.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/userinfo.profile'
      }).then(() => {
        setAuth(window.gapi.auth2.getAuthInstance());
       });
    });
  }, []);

  async function onSignInClick() {
    console.log("Click")
    await auth.signIn();
    console.log(auth.currentUser.get().getAuthResponse());
    props.signInWithSocial(auth.currentUser.get().getAuthResponse().access_token, '/users/google/token');
  }

  function renderSignInStatus() {
    if(props.isSignedIn === null) {
      return null;
    } else {
      return (
        <button type="button" onClick={onSignInClick} className="social-icon">
          <i className="fab fa-google" />
        </button>
      );
    }
  }

  return (
    <div>
      {renderSignInStatus()}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn
  }
}

export default connect(mapStateToProps, {signInWithSocial, signOut})(GoogleAuth);
