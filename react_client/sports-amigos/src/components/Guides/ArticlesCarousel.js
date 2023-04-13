import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "../../styles/articles.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";


export default function ArticlesCarousel() {
  const [articles, setArticles] = useState([]);

  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <FontAwesomeIcon
        icon={faChevronRight}
        className={className}
        style={{ ...style, color: "#8e97a9", fontSize: "50px" }}
        onClick={onClick}
      />
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <FontAwesomeIcon
        icon={faChevronLeft}
        className={className}
        style={{ ...style, color: "#8e97a9", fontSize: "30px" }}
        onClick={onClick}
      />
    );
  }

  useEffect(() => {
    axios
      .get("http://localhost:3100/api/articles")
      .then((res) => {
        setArticles(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    arrows: true,
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {/*TODO Missing to change articles sample to the articles retrieved from database*/}
        {articles.map((article) => (
          <div key={article._id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">
                  {article.shortdesc.length > 150
                    ? `${article.shortdesc.substring(0, 150)}...`
                    : article.shortdesc}
                </p>
                <Link to={"/guides/article/" + article._id}>
                  {console.log("article to id send: ", article._id)}
                      <Button className="btn btn-primary read-more-btn">Read more</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
