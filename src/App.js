import logo from './logo.svg';
import './App.css';
import Accordion from './components/Accordion';
import AEMCarousel from './components/AEMCarousel';
import HeroBanner from './components/HeroBanner';

function App() {
  return (
    <div className="App">
      <AEMCarousel />
      <HeroBanner />
      <Accordion />
    </div>
  );
}

export default App;
