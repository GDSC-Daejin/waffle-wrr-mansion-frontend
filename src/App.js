import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Home from './components/Home';
import Monthly from './components/Monthly';
import Daily from './components/Daily';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monthly" element={<Monthly />} />
          <Route path="/daily/:date" element={<Daily />} /> {/* Daily 페이지 경로 추가 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
