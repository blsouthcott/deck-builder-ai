import "./css/App.css";
import "./css/custom.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SlideDeckForm from "./components/presentationForm";
import TopicsForm from "./components/topicsForm";
import Navbar from "./components/navbar";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<SlideDeckForm />} />
          <Route path="/generate-presentation-ideas" element={<TopicsForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
