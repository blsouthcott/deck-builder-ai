import "./css/App.css";
import "./css/custom.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SlideDeckForm from "./components/presentationForm";
import IdeasForm from "./components/ideasForm";
import Navbar from "./components/navbar";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<SlideDeckForm />} />
          <Route path="/generate-presentation-ideas" element={<IdeasForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
