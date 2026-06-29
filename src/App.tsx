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
      <div className="access-denied bg-dark text-white d-flex flex-column justify-content-center align-items-center vh-100 text-center" dir="rtl">
        <h1 className="fw-light display-4 mb-4">שאלה מיוחדת...</h1>
        <p className="lead text-muted px-4">אנא ודאו שיש לכם את הקישור הנכון.</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="start-screen bg-dark text-white d-flex flex-column justify-content-center align-items-center vh-100 text-center" dir="rtl">
        <h1 className="fw-light display-3 mb-5 px-4 animate-fade-in">מוכנים?</h1>
        <button 
          className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 animate-fade-in-delayed"
          onClick={() => setStarted(true)}
        >
          לחצו להתחלה
        </button>
        {/* Preload images */}
        <div style={{ display: 'none' }}>
          {photos.map((url, i) => (
            <img key={i} src={url} referrerPolicy="no-referrer" alt="preload" />
          ))}
        </div>
      </div>
    );
  }

  const isFinished = currentSlide >= photos.length;

  return (
    <div className="gallery-container bg-dark vh-100 vw-100 overflow-hidden position-relative">
      
      {/* Local MP3 Audio for background music */}
      <audio 
        src="/song.mp3" 
        autoPlay 
        loop 
        className="d-none"
      ></audio>

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
        <div className="final-screen d-flex flex-column justify-content-center align-items-center w-100 h-100 text-white text-center" dir="rtl">
          <h1 className="display-1 fw-light mb-4 animate-fade-in">מה הלאה?</h1>
          <p className="lead px-4 animate-fade-in-delayed">תסתכלי עליי...</p>
        </div>
      )}
    </div>
  );
}

export default App;
