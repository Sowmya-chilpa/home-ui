import './App.css';
import Auth from './components/Auth';
import Packages from './components/Packages';
import Profile from './components/Profile';
import ScrollToTop from './components/ScrollToTop';
import TripPlan from './components/TripPlan';
import MainLayout from './Layout/MainLayout';
import Home from './router/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="login" element={<Auth />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='/trip' element={<TripPlan />} />
            <Route path='profile' element={<Profile />} />
            <Route path="packages" element={<Packages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
