import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Redirect,
} from "react-router-dom";
import LoginPage from "../LoginPage/LoginPage";
import ViewArticle from "../ViewArticle/ViewArticle";
import NewArticle from "../NewArticle/NewArticle";
import NewComment from "../../NewComment/NewComment";
import ArticleRate from "../ArticleRate/ArticleRate";
import Main from "../Homepage/Main/Main";
import Heading from "../Homepage/Heading/Heading";
import Comments from "../Comments/Comments";
import { connect } from "react-redux";
import * as firebase from "firebase";

const AdminOnly = (ComposedComponent, auth) => {
  class AdminOnly extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isPass: false,
      };
    }
    componentDidMount() {
      if (!auth.isEmpty) {
        firebase
          .auth()
          .currentUser.getIdTokenResult()
          .then((getIdTokenResult) => {
            // if (getIdTokenResult.claims.type === "administrator") {
            if (!auth.isEmpty) {
              this.setState({
                isPass: true,
              });
            } else {
              this.props.history.push("/");
            }
          });
      } else {
        this.props.history.push("/");
      }
    }
    render() {
      if (this.state.isPass) {
        return (
          <div>
            <ComposedComponent
              location={this.props.location}
              history={this.props.history}
              auth={auth}
            />
          </div>
        );
      } else {
        return <div>checking...</div>;
      }
    }
  }
  return AdminOnly;
};

class RouterManager extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Heading />
        {this.props.auth.isLoaded ? (
          <Switch>
            <Route exact path="/">
              <Main />
            </Route>
            <Route path="/article/:id">
              <Route
                path="/article/:id"
                component={AdminOnly(ViewArticle, this.props.auth)}
              />

              <Route
                path="/article/:id"
                component={AdminOnly(ArticleRate, this.props.auth)}
              />

              <Route
                path="/article/:id"
                component={AdminOnly(Comments, this.props.auth)}
              />
              <Route
                path="/article/:id"
                component={AdminOnly(NewComment, this.props.auth)}
              />
            </Route>
            {/* <Route
              path="/new-article"
              component={AdminOnly(NewArticle, this.props.auth)}
            /> */}
            <Route render={() => <Redirect to={{ pathname: "/" }} />} />
          </Switch>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const enhance = connect(({ firebase: { auth, profile } }) => ({
  auth,
  profile,
}));

export default enhance(withRouter(RouterManager));
