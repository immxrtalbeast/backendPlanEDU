import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './compnents/Theme';
import Home from './pages/Home';
import Faculties from './pages/Faculties';
import Roadmap from './pages/Roadmap';
import Chat from './pages/Chat';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/roadmap/:facultyId" element={<Roadmap />} />
          <Route path="/chat/:facultyId/:nodeId" element={<Chat />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
