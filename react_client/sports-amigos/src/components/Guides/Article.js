import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3100/api/article/" + id)
      .then((res) => {
        setArticle(res.data);
        //debug
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div>
      <div>Individual Article</div>
      <div>
        <h2>{article.title}</h2>
        <img href={article.image} alt="article main img"></img>
        <p>{article.content}</p>
      </div>
    </div>
  );
}
