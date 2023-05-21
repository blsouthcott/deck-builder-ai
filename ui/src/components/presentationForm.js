import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';
import ClipLoader from 'react-spinners/ClipLoader';


const SlideDeckForm = () => {

  const [topic, setTopic] = useState('');
  const [numSlides, setNumSlides] = useState(5);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [presentationGenerated, setPresentationGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateNumSlides = (e) => {
    e.target.value >= 1 && setNumSlides(e.target.value);
  }

  const genSlideDeckFile = async () => {
    setIsLoading(true);
    const resp = await fetch(`${BACKEND_URL}/api/slideDeck`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: topic,
        slide_count: numSlides,
        theme: selectedTheme,
      })
    });
    if (resp.status === 200) {
      const data = await resp.json();
      const { byteString } = data
      const blob = new Blob([byteString], {type: "application/octet-stream"});
      setDownloadUrl(URL.createObjectURL(blob));
    } else {
      setIsLoading(false);
      window.alert("Unable to generate presentation")
    }
    setPresentationGenerated(true);
    setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);
  

  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
          <div className="container">

            {isLoading ? <ClipLoader size={50} color="white" cssOverride={{display: "block", margin: "0 auto",}}/> :
            <div className="columns is-centered">
              <div className="column is-half">
              <h1 className="title has-text-white">Presentation Generator</h1>
                <div className="box">
                  <label htmlFor="topic" className="label">Presentation Topic</label>
                  <input
                    className="input"
                    placeholder="Enter topic name"
                    id="topic" 
                    type="text" 
                    value={topic} 
                    onChange={e => setTopic(e.target.value)}/>

                  <label htmlFor="num-slides" className="label mt-4">Number of Slides</label>
                  <input
                    className="input"
                    id="num-slides"
                    type="number"
                    value={numSlides}
                    onChange={e => validateNumSlides(e)}/>

                  <h3 className="subtitle mt-4 mb-1">Presentation Themes</h3>
                  
                  <input
                    className="radio"
                    id="theme1"
                    type="radio"
                    value="theme1"
                    checked={selectedTheme === "theme1"}
                    onChange={e => setSelectedTheme(e.target.value)}/>
                  <label htmlFor="theme1"> Theme 1</label>
                  
                  <br />
                  <input
                    className="radio"
                    id="theme2"
                    type="radio"
                    value="theme2"
                    checked={selectedTheme === "theme2"}
                    onChange={e => setSelectedTheme(e.target.value)}
                  />
                  <label htmlFor="theme2"> Theme 2</label>
                  
                  <br />
                  <input
                    className="radio"
                    id="theme3"
                    type="radio"
                    value="theme3"
                    checked={selectedTheme === "theme3"}
                    onChange={e => setSelectedTheme(e.target.value)}
                  />
                  <label htmlFor="theme3"> Theme 3</label>
                  <br />
                  <button className="button my-3" onClick={genSlideDeckFile}>Generate Presentation</button>
                  {presentationGenerated && <><br /><a className="has-text-link mt-4" href={downloadUrl} download="slides.pptx">Click here to download the slides!</a></>}
              </div>
            </div>
          </div>}


        </div>
      </div>
    </section>
  );
};

export default SlideDeckForm;
