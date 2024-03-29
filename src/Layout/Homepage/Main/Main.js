import React, { Component } from "react";
import { Container, Button } from "reactstrap";
import ArticleCard from "../../../Component/ArticleCard/ArticleCard";
import firebase from "../../../Config/firebase";
import classes from "./Main.module.css";
import InfiniteScroll from "react-infinite-scroll-component";

// prieinam prie duomenu bazes firestorei
const db = firebase.firestore();

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      articles: [],
      limit: 3,
      lastArticle: null,
      orderBy: "createDate",
      buttonDisabled: false,
    };
  }

  nextArticle = () => {
    //get last state we added from getUsers()
    let last = this.state.lastArticle;
    this.setState({ buttonDisabled: true });
    // setTimeout(this.setState({ buttonDisabled: false }), 2000);

    db.collection("Articles")
      .orderBy(this.state.orderBy, "desc")
      .startAfter(last.createDate)
      .limit(1)
      .get()
      .then((docs) => {
        if (!docs.empty) {
          var last = this.state.articles[this.state.articles.length - 1];
          let allArticles = [];
          docs.forEach(function (doc) {
            const article = {
              id: doc.id,
              ...doc.data(),
            };
            allArticles.push(article);
          });
          //set state with updated array of data
          //also save last fetched data in state
          let updated_articles = this.state.articles.concat(allArticles);
          this.setState(
            {
              articles: updated_articles,
            },
            () => {
              this.setState({
                buttonDisabled: false,
                isLoaded: true,
                lastArticle: this.state.articles[
                  this.state.articles.length - 1
                ],
              });
            }
          );
        }
        window.scrollTo(0, document.body.scrollHeight);
      });
  };

  componentDidMount() {
    this.getMyArticles();
  }
  // imam colletiona pavadinimu "Articles", sukuriu array allArticles, tada imu kiekviena elementa is Articles, ir idedu i articles[] array,
  //  kuris yra konstruktoriuje, naudodamas setState, kartu ir pakeiciu isLoaded i true

  getMyArticles = () => {
    db.collection("Articles")
      .orderBy(this.state.orderBy, "desc")
      .limit(this.state.limit)
      .onSnapshot((docs) => {
        if (!docs.empty) {
          let allArticles = [];
          docs.forEach(function (doc) {
            const article = {
              id: doc.id,
              ...doc.data(),
            };
            allArticles.push(article);
          });
          this.setState(
            {
              articles: allArticles,
            },
            () => {
              this.setState({
                isLoaded: true,
                lastArticle: this.state.articles[
                  this.state.articles.length - 1
                ],
              });
            }
          );
        }
      });
  };

  render() {
    // jei isLoaded yra true, tada einu per kiekviena article ir renderinu kievkiena article, jei isLoaded yra flase, nedarau nieko
    return (
      <Container className={classes.Main}>
        {this.state.isLoaded
          ? this.state.articles.map((article, index) => {
              return <ArticleCard key={index} data={article} />;
            })
          : ""}
        <div className={classes.MoreButton}>
          {" "}
          {this.state.buttonDisabled ? (
            <Button
              size="sm"
              outline
              color="dark"
              style={{ borderRadius: 0 }}
              disabled
            >
              Show 1 more article...
            </Button>
          ) : (
            <Button
              size="sm"
              outline
              color="dark"
              style={{ borderRadius: 0 }}
              onClick={() => this.nextArticle()}
            >
              Show 1 more article...
            </Button>
          )}
        </div>
      </Container>
    );
  }
}

export default Main;
