import { useState, useEffect } from 'react';
import { CONFIG } from './Config';
import photos from './data.json';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Check IMEI in URL
    const params = new URLSearchParams(window.location.search);
    const imei = params.get('imei');
    if (imei && CONFIG.ALLOWED_IMEIS.includes(imei)) {
      setAccessGranted(true);
    }
  }, []);

  useEffect(() => {
    let timer: number;
    if (started && currentSlide < photos.length) {
      // 5 seconds per slide
      timer = window.setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [started, currentSlide]);

  if (!accessGranted) {
    return (
      <div className="access-denied bg-dark text-white d-flex flex-column justify-content-center align-items-center vh-100 text-center">
        <h1 className="fw-light display-4 mb-4">A Special Question...</h1>
        <p className="lead text-muted px-4">Please make sure you have the correct link.</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="start-screen bg-dark text-white d-flex flex-column justify-content-center align-items-center vh-100 text-center">
        <h1 className="fw-light display-3 mb-5 px-4 animate-fade-in">Ready?</h1>
        <button 
          className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 animate-fade-in-delayed"
          onClick={() => setStarted(true)}
        >
          Tap to Start
        </button>
      </div>
    );
  }

  const isFinished = currentSlide >= photos.length;

  return (
    <div className="gallery-container bg-dark vh-100 vw-100 overflow-hidden position-relative">
      
      {/* Hidden YouTube Iframe for background music */}
      <iframe 
        width="0" 
        height="0" 
        src={`https://www.youtube.com/embed/${CONFIG.YOUTUBE_VIDEO_ID}?autoplay=1&controls=0&loop=1&playlist=${CONFIG.YOUTUBE_VIDEO_ID}`} 
        title="YouTube video player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
        className="d-none"
      ></iframe>

      {!isFinished ? (
        photos.map((photoUrl, index) => (
          <div 
            key={index}
            className={`slide position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center ${index === currentSlide ? 'active' : ''} ${index < currentSlide ? 'prev' : ''}`}
          >
            <img 
              className="slide-bg" 
              src={photoUrl} 
              alt="" 
              referrerPolicy="no-referrer"
            />
            <img src={photoUrl} alt="Memory" className="slide-img shadow-lg rounded" referrerPolicy="no-referrer" />
          </div>
        ))
      ) : (
        <div className="final-screen d-flex flex-column justify-content-center align-items-center w-100 h-100 text-white text-center">
          <h1 className="display-1 fw-light mb-4 animate-fade-in">What's Next?</h1>
          <p className="lead px-4 animate-fade-in-delayed">Look at me...</p>
        </div>
      )}
    </div>
  );
}

export default App;
