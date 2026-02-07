import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Checkin from './pages/checkin/Checkin';
import Match from './pages/match/Match';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Checkin />} />
        <Route path='/matches' element={<Match />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
