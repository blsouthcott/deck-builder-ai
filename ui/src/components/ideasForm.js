import React, { useState } from "react";
import { BACKEND_URL } from "../config";
import ClipLoader from "react-spinners/ClipLoader";


const TopicsForm = () => {

  const [numTopicsToLoad, setNumTopicsToLoad] = useState(1);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateNumTopicsToLoad = (e) => {
    e.target.value >= 1 && e.target.value <= 20 && setNumTopicsToLoad(e.target.value);
  }

  const setTopicKeys = (data) => {
    let numTopics = topics.length;
    const newTopics = [];
    for (let d of data) {
      numTopics += 1;
      newTopics.push({
        name: d,
        key: numTopics,
      })
    };
    return newTopics;
  }

  const loadTopics = async () => {
    setIsLoading(true);
    const resp = await fetch(`${BACKEND_URL}/api/topics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topicCount: numTopicsToLoad,
      })
    });
    if (resp.status === 200) {
      const data = await resp.json();
      console.log("data received: ", data);
      const newTopics = setTopicKeys(data.topics);
      setTopics([...topics, ...newTopics]);
      console.log("topics: ", topics);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      window.alert("Unable to load topics");
    }
  }

  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-half">
                <h1 className="title has-text-white mt-4">Presentation Ideas</h1>
                <div className="box content">
                  {topics.length > 0 &&
                    <ul>
                      {topics.map(topic => <li key={topic.key}>{topic.name}</li>)}
                    </ul>}
                  <label htmlFor="num-topics" className="label">Number of topics</label>
                  <input id="num-topics" className="input" type="number" value={numTopicsToLoad} onChange={e => validateNumTopicsToLoad(e)}/>
                  <button className="button my-4" onClick={loadTopics}>Generate Topics</button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button className="button my-4" onClick={() => setTopics([])}>Clear Topics</button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}

export default TopicsForm;
