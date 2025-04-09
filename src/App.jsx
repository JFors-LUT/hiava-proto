import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import FieldBuilder from "./components/FieldBuilder";
import FormFiller from "./components/FormFiller";

function App() {
  return (
    <Router>
      <Routes>
        {/* Kotisivun reitti */}
        <Route path="/" element={<Home />} />

        {/* Kenttien rakentamisen reitti */}
        <Route path="/build-form" element={<FieldBuilder />} />

        <Route path="/fill-form" element={<FormFiller />} />
      </Routes>
    </Router>
  );
}

export default App;
