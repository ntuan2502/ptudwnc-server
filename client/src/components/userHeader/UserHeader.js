import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../../actions';

function UserHeader(props) {
  useEffect(() => {
    props.fetchUser(props.userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!props.user) {
    return (    
      <>Loading...</>
    )
  }
  return (
    <>
     {props.user.fullName} 
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: Object.values(state.users).find(user => user._id === ownProps.userId)
  }
}

export default connect(mapStateToProps, { fetchUser })(UserHeader);
