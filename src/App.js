import logo from './logo.svg';
import './App.css';
import Accordion from './components/Accordion';
import AEMCarousel from './components/AEMCarousel';
import HeroBanner from './components/HeroBanner';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <AEMCarousel />
      <HeroBanner />
      <Accordion />
      <Footer />
    </div>
  );
}

export default App;
