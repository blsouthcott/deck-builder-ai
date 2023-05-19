import React, { useState } from 'react';


const SlideDeckForm = () => {
  const [topic, setTopic] = useState('');
  const [numSlides, setNumSlides] = useState(5);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [presentationGenerated, setPresentationGenerated] = useState(false);

  const validateNumSlides = (e) => {
    e.target.value >= 1 && setNumSlides(e.target.value);
  }

  const genSlideDeckTopicIdeas = () => {
    // TODO: handle making request to backend to generate presentation ideas
  };

  const genSlideDeckFile = () => {
    // TODO: handle making request to backend to generate powerpoint file

    setPresentationGenerated(true);
  };

  return (
    <div>
      <h1>Presentation Generator</h1>
      <label htmlFor="topic">Presentation Topic</label>
      <input
        placeholder="Enter topic name"
        id="topic" 
        type="text" 
        value={topic} 
        onChange={e => setTopic(e.target.value)}/>
      
      {/* TODO: Give user the option to generate a list of random presentation topic ideas */}

      <h2>Number of Slides:</h2>
      <label htmlFor="num-slides">Number of Slides</label>
      <input
        id="num-slides"
        type="number"
        value={numSlides}
        onChange={e => validateNumSlides(e)}/>

      <h2>Theme Options:</h2>
      <label htmlFor="theme1">Theme 1</label>
      <input
        id="theme1"
        type="radio"
        value="theme1"
        checked={selectedTheme === "theme1"}
        onChange={e => setSelectedTheme(e.target.value)}/>
      
      <label htmlFor="theme2">Theme 2</label>
      <input
        id="theme2"
        type="radio"
        value="theme2"
        checked={selectedTheme === "theme2"}
        onChange={e => setSelectedTheme(e.target.value)}
      />

      <label htmlFor="theme3">Theme 3</label>
      <input
        id="theme3"
        type="radio"
        value="theme3"
        checked={selectedTheme === "theme3"}
        onChange={e => setSelectedTheme(e.target.value)}
      />

      <button onClick={genSlideDeckFile}>Generate Presentation</button>
      <button onClick={genSlideDeckTopicIdeas}>Generate Presentation Ideas</button>

      {presentationGenerated && <p>Presentation generated successfully!</p>}
    </div>
  );
};

export default SlideDeckForm;
