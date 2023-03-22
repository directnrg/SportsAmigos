import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import '../../styles/articles.css';
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';


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
      .get("https://URL")
      .then((res) => setArticles(res.data))
      .catch((err) => console.error(err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    arrows: true,
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    nextArrow: <NextArrow/>,
    prevArrow: <PrevArrow/>
  };

  //sample
  const articlesSample = [
    {
      id: 1,
      title: "The Benefits of Regular Exercise",
      content:
        "Regular exercise has been shown to have numerous benefits for both physical and mental health. It can improve cardiovascular health, boost the immune system, and even help prevent chronic diseases such as diabetes and heart disease. Exercise has also been shown to improve mood, reduce anxiety and depression, and increase overall feelings of well-being.",
    },
    {
      id: 2,
      title: "The Impact of Social Media on Mental Health",
      content:
        "Social media has become an integral part of many people's lives, but it can also have negative effects on mental health. Studies have shown that excessive social media use can lead to increased feelings of loneliness, depression, and anxiety. It can also contribute to poor sleep quality and decreased self-esteem. However, when used in moderation, social media can have positive effects on mental health, such as providing social support and fostering a sense of community.",
    },
    {
      id: 3,
      title: "The Importance of Sleep for Physical and Mental Health",
      content:
        "Sleep is an essential part of a healthy lifestyle, and lack of sleep can have negative effects on both physical and mental health. It can contribute to weight gain, high blood pressure, and an increased risk of chronic diseases. Sleep also plays a crucial role in regulating mood and emotions, and a lack of sleep can lead to irritability, anxiety, and depression. Getting enough high-quality sleep is important for overall health and well-being.",
    },
    {
      id: 4,
      title: "The Benefits of Mindfulness Meditation",
      content:
        "Mindfulness meditation has become increasingly popular in recent years, and for good reason. Studies have shown that mindfulness meditation can reduce stress and anxiety, improve mood, and even improve immune function. It involves focusing on the present moment and becoming more aware of one's thoughts and feelings, which can help to develop greater emotional resilience and a more positive outlook on life. Incorporating mindfulness meditation into a daily routine can have numerous benefits for both physical and mental health.",
    },
  ];

  return (
    <>
   <div className="carousel-container">
   
     <Slider {...settings}>
       {/*TODO Missing to change articles sample to the articles retrieved from database*/}
      {articlesSample.map(article => (
        <div key={article.id}>
          <div className="card">
          <div className="card-body">
              <h5 className="card-title">{article.title}</h5>
              <p className="card-text">{article.content.length > 150 ? `${article.content.substring(0, 150)}...` : article.content}</p>
              {article.content.length > 150 && (
                <Link to={`guides/article/${article.id}`} className="btn btn-primary read-more-btn">Read more</Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </Slider>
    </div>
    </>
  );
}
