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
      let { byteString } = data;
      byteString = atob(byteString)
      const byteArr = new Uint8Array(byteString.length);
      for (let i=0; i<byteString.length; i++) {
        byteArr[i] = byteString.charCodeAt(i);
      };
      const blob = new Blob([byteArr], {type: "application/octet-stream"});
      setDownloadUrl(URL.createObjectURL(blob));
      window.alert(`Your '${topic}' presentation was generated successfully! Please use the download link to access the file.`);
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

            {isLoading ? 
            <>
              <p className="has-text-white my-4 is-size-5">Please wait while we generate your presentation. For 10 slides or less, this should take no longer than 1 minute...</p>
              <ClipLoader size={50} color="white" cssOverride={{display: "block", margin: "0 auto",}}/>
            </> 
            :
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
                    id="blackAndWhiteTheme"
                    type="radio"
                    value="blackAndWhiteTheme"
                    checked={selectedTheme === "blackAndWhiteTheme"}
                    onChange={e => setSelectedTheme(e.target.value)}/>
                  <label htmlFor="blackAndWhiteTheme"> Black And White</label>
                  
                  <br />
                  <input
                    className="radio"
                    id="greyScaleTheme1"
                    type="radio"
                    value="greyScaleTheme1"
                    checked={selectedTheme === "greyScaleTheme1"}
                    onChange={e => setSelectedTheme(e.target.value)}
                  />
                  <label htmlFor="greyScaleTheme1"> Greyscale 1</label>
                  
                  <br />
                  <input
                    className="radio"
                    id="greyScaleTheme2"
                    type="radio"
                    value="greyScaleTheme2"
                    checked={selectedTheme === "greyScaleTheme2"}
                    onChange={e => setSelectedTheme(e.target.value)}
                  />
                  <label htmlFor="greyScaleTheme2"> Greyscale 2</label>

                  <br />
                  <input
                    className="radio"
                    id="forestTheme"
                    type="radio"
                    value="forestTheme"
                    checked={selectedTheme === "forestTheme"}
                    onChange={e => setSelectedTheme(e.target.value)}
                  />
                  <label htmlFor="forestTheme"> Forest</label>

                  <br />
                  <button className="button my-3" onClick={genSlideDeckFile}>Generate Presentation</button>
                  {presentationGenerated && <><br /><a className="has-text-link mt-4" href={downloadUrl} download="slides.pptx">Click here to download the slides for your '{topic}' presentation!</a></>}
              </div>
            </div>
          </div>}


        </div>
      </div>
    </section>
  );
};

export default SlideDeckForm;
