import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState([]);
  console.log("ID:", id);


  useEffect(() => {
    //debug
    console.log("Fetching article with id:", id);

    axios
      .get("http://localhost:3100/api/article/" + id)
      .then((res) => {
        setArticle(res.data);
        //debug
        console.log(res.data);
        console.log(id)
      })
      .catch((err) => 
      console.error("Error Fecthing data: ",err));
  }, [id]);

  return (
    <div>
      <div>
        <div>Individual Article</div>
        <div>
          <h2>{article.title}</h2>
          <img href={article.image} alt="article main img"></img>
          <p>{article.author}</p>
          <p>{article.content}</p>
        </div>
      </div>
      <div>
        <p>{article.createdAt}</p>
        <p>{article.updatedAt}</p>
      </div>
    </div>
  )
}
