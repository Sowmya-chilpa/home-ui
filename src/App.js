import './App.css';
import Packages from './components/Packages';
import TripPlan from './components/TripPlan';
import MainLayout from './Layout/MainLayout';
import Home from './router/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='/trip' element={<TripPlan />} />
            <Route path="packages" element={<Packages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
