import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import States from "./pages/States";
import StateDetails from "./pages/StateDetails";
import Destinations from "./pages/Destinations";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import BookNow from "./components/BookNow";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/states" element={<States />} />
          <Route path="/states/:id" element={<StateDetails />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/book-now" element={<BookNow />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
