import React from 'react';
import { connect } from 'react-redux';
import { signInWithSocial } from '../../actions';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

function FacebookAuth(props) {
  const responseFacebook = (response) => {
    console.log(response);
    if(response.accessToken) {
      props.signInWithSocial(response.accessToken, '/users/facebook/token');
    }
  }

  const componentClicked = () => {
    console.log('clicked');
  }

  return <FacebookLogin 
    appId='581488189570496'
    //autoLoad={true}
    fields="name,email,picture"
    onClick={componentClicked}
    callback={responseFacebook}
    render={renderProps => (
      <button type='button' onClick={renderProps.onClick} className="social-icon">
        <i className='fab fa-facebook-f'></i>
      </button>
    )}/>
}

export default connect(null, { signInWithSocial })(FacebookAuth);
