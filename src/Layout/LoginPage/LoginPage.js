import React, { Component } from "react";
import { Container, Button } from "reactstrap";
import { connect } from "react-redux";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../../Config/firebase";
import { Link } from "react-router-dom";

const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.signInAnonymously,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />

        <Button
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
          block
          onClick={() => {
            firebase.auth().signInAnonymously();
          }}
        >
          Anon
        </Button>
      </Container>
    );
  }
}

const enhance = connect(({ firebase: { auth, profile } }) => ({
  auth,
  profile,
}));

export default enhance(LoginPage);
