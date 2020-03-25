import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import { firstRow, secondRow } from "../data/features";

function FirstRow({ title, description, linkUrl, imageUrl }) {
  // const imgUrl = useBaseUrl(imageUrl);
  return (
    
    <div className="col-md-4">
      <Link to={useBaseUrl(linkUrl)} activeClassName="active">
      <div className="show-card">
        <div className="icon-wrapper">
          <img src={useBaseUrl(imageUrl)} alt={title} className="icon" />
        </div>
        <div className="title">{title}</div>
        <div className="descriptions">{description}</div>
      </div>
      </Link>
    </div>
    
  );
}

function SecondRow({ title, description, linkUrl, imageUrl }) {
  // const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className="col-md-6">
    <Link to={useBaseUrl(linkUrl)}>
      <div className="show-card">
        <div className="icon-wrapper">
          <img src={useBaseUrl(imageUrl)} alt={title} className="icon" />
        </div>
        <div className="title">{title}</div>
        <div className="descriptions">{description}</div>
      </div>
    </Link>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout>
      <div
        className="bootstrap-wrapper"
      >
        <img src={useBaseUrl("img/home/background-mockup.svg")} className="background-img left"/>
        <img src={useBaseUrl("img/home/background-mockup.svg")} className="background-img right"/> 
        <div className="container">
          <div className="row pt-40">
            {firstRow &&
              firstRow.length &&
              firstRow.map((props, idx) => (
                <FirstRow key={idx} {...props} />
              ))}{" "}
          </div>
          <div className="row">
            {secondRow &&
              secondRow.length &&
              secondRow.map((props, idx) => (
                <SecondRow key={idx} {...props} />
              ))}{" "}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
