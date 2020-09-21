import React from "react";
import {
  Card,
  CardImg,
  CardTitle,
  CardSubtitle,
  CardBody,
  Badge,
  Col,
  Row,
  Container,
} from "reactstrap";
import { connect } from "react-redux";
import classes from "./ArticleCard.module.css";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import firebase from "../../Config/firebase";

// data yyyy/mm/dd formatu

export function timeStampToString(ts) {
  const date = new Date(ts * 1000);
  return (
    date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
  );
}

const ArticleCard = (props) => {
  const articleScore =
    (props.data.positiveRatings /
      (props.data.negativeRatings + props.data.positiveRatings)) *
    100;
  return (
    <Card style={{ borderRadius: 0 }} className={classes.ArticleCard}>
      {" "}
      <Container>
        <Row>
          <Col xs="2 px-0">
            {" "}
            {props.auth.isEmpty ? (
              <CardImg
                top
                width="100%"
                src={props.data.featureImage}
                alt="Card Image"
                className={classes.CardImage}
              />
            ) : (
              <Link
                className={classes.CardLink}
                to={{
                  pathname: "article/" + props.data.id,
                  state: { article: props.data },
                }}
              >
                {" "}
                <CardImg
                  top
                  width="100%"
                  src={props.data.featureImage}
                  alt="Card Image"
                  className={classes.CardImage}
                />
              </Link>
            )}
          </Col>
          <Col xs="10 px-0">
            {" "}
            <CardBody className={classes.CardBody}>
              <CardTitle className={classes.CardTitle}>
                {props.data.title}
              </CardTitle>
              <CardSubtitle className={classes.CardSubtitle}>
                {props.data.content}
                <Badge className={classes.ArticleLabel}>
                  {props.data.categoryLabel}
                </Badge>
                <Badge className={classes.createDate}>
                  {timeStampToString(props.data.createDate.seconds)}
                </Badge>
                <div>
                  <Badge>
                    Created by: {props.data.createUserID.slice(0, 10)}
                  </Badge>
                </div>
                <div>
                  <Badge>Ratings Score : {Math.round(articleScore)}%</Badge>
                </div>
                <div>
                  <Badge>Comments: {props.data.commentCount}</Badge>
                </div>
              </CardSubtitle>
            </CardBody>
          </Col>
        </Row>
      </Container>
    </Card>
  );
};
const enhance = connect(({ firebase: { auth, profile } }) => ({
  auth,
  profile,
}));

export default enhance(ArticleCard);
