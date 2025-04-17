import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import LogoutButton from "./components/LogoutButton";

import Home from "./components/Home";
import FieldBuilder from "./components/FormBuilder/FormBuilder";
import FormFiller from "./components/FormFiller/FormFiller";
import ConfirmSubmission from "./components/ConfirmSubmission";

// Käytetään Bootstrapin tyylejä
function App() {
  return ( 
    <Router>
      <div>
        {/* navigointipalkki */}
        <nav className="navbar navbar-light bg-light fixed-top">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            {/* Hiava logo */}
            <Link className="navbar-brand" to="/">
              <img
                src="src\assets\images\logo_black.png"
                alt="Hiava Logo"
                height="30"
                style={{ objectFit: "contain" }}
              />
            </Link>
            {/* Linkit oikealla puolella ja samalla rivillä */}
            <ul className="navbar-nav flex-row gap-3 m-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/build-form">Rakenna Lomake</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/fill-form">Täytä Lomake</Link>
              </li>
              <li className="nav-item">
                <LogoutButton />
              </li>
            </ul>
          </div>
        </nav>

        {/* Sisältöä näkyy alle navigointipalkin */}
        <div className="container mt-5">
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/build-form" element={<FieldBuilder />} />
            <Route path="/fill-form" element={<FormFiller />} />
            <Route path="/confirm" element={<ConfirmSubmission />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}


export default App;
