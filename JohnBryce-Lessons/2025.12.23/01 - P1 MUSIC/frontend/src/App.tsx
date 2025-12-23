import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// ========== TypeScript Interfaces ==========
interface PredictionResponse {
  genre: string;
  success: boolean;
  error?: string;
}

interface LearnResponse {
  message: string;
  success: boolean;
  error?: string;
}

type Gender = 'male' | 'female' | '';
type Genre = 
  | 'HipHop' | 'Jazz' | 'Classical' | 'Dance' | 'Acoustic'
  | 'Rock' | 'Pop' | 'Electronic' | 'R&B' | 'Country'
  | 'Metal' | 'Reggae' | 'Blues' | 'Funk' | 'Soul'
  | 'Indie' | 'Punk' | 'Latin' | 'K-Pop' | 'Lo-Fi'
  | '';

// ========== Main App Component ==========
const App: React.FC = () => {
  // Predict Form State
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender>('');
  
  // Learn Form State
  const [showLearnModal, setShowLearnModal] = useState<boolean>(false);
  const [learnAge, setLearnAge] = useState<string>('');
  const [learnGender, setLearnGender] = useState<Gender>('');
  const [learnGenre, setLearnGenre] = useState<Genre>('');
  
  // UI State
  const [loading, setLoading] = useState<boolean>(false);
  const [learnLoading, setLearnLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [learnSuccess, setLearnSuccess] = useState<string | null>(null);
  const [learnError, setLearnError] = useState<string | null>(null);

  // Gender mapping: Display value → API value
  const genderToNumber = (g: Gender): number => (g === 'male' ? 1 : 0);

  // Form validation
  const isFormValid = (): boolean => {
    const ageNum = parseInt(age);
    return age !== '' && !isNaN(ageNum) && ageNum > 0 && ageNum < 120 && gender !== '';
  };

  // Learn form validation
  const isLearnFormValid = (): boolean => {
    const ageNum = parseInt(learnAge);
    return learnAge !== '' && !isNaN(ageNum) && ageNum > 0 && ageNum < 120 && learnGender !== '' && learnGenre !== '';
  };

  // Handle predict form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post<PredictionResponse>(
        'http://127.0.0.1:5000/predict',
        {
          age: parseInt(age),
          gender: genderToNumber(gender as Gender)
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      if (response.data.success) {
        setResult(response.data.genre);
      } else {
        setError(response.data.error || 'Prediction failed');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else if (err.response) {
          setError(err.response.data?.error || `Server error: ${err.response.status}`);
        } else if (err.request) {
          setError('Cannot connect to server. Is the Flask backend running?');
        } else {
          setError('An unexpected error occurred.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle learn form submission
  const handleLearnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLearnError(null);
    setLearnSuccess(null);
    setLearnLoading(true);

    try {
      const response = await axios.post<LearnResponse>(
        'http://127.0.0.1:5000/learn',
        {
          age: parseInt(learnAge),
          gender: genderToNumber(learnGender as Gender),
          genre: learnGenre
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      if (response.data.success) {
        setLearnSuccess(response.data.message || 'Data saved successfully!');
        // Reset learn form after success
        setLearnAge('');
        setLearnGender('');
        setLearnGenre('');
      } else {
        setLearnError(response.data.error || 'Failed to save data');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setLearnError('Request timed out. Please try again.');
        } else if (err.response) {
          setLearnError(err.response.data?.error || `Server error: ${err.response.status}`);
        } else if (err.request) {
          setLearnError('Cannot connect to server. Is the Flask backend running?');
        } else {
          setLearnError('An unexpected error occurred.');
        }
      } else {
        setLearnError('An unexpected error occurred.');
      }
    } finally {
      setLearnLoading(false);
    }
  };

  // Reset predict form
  const handleReset = () => {
    setAge('');
    setGender('');
    setResult(null);
    setError(null);
  };

  // Open/Close learn modal
  const openLearnModal = () => {
    setShowLearnModal(true);
    setLearnSuccess(null);
    setLearnError(null);
  };

  const closeLearnModal = () => {
    setShowLearnModal(false);
    setLearnAge('');
    setLearnGender('');
    setLearnGenre('');
    setLearnSuccess(null);
    setLearnError(null);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🎵</span>
          <h1>Music Genre Predictor</h1>
        </div>
        <p className="subtitle">Discover your music taste with AI</p>
      </header>

      {/* Main Card */}
      <main className="card">
        <form onSubmit={handleSubmit} className="form">
          {/* Age Input */}
          <div className="input-group">
            <label htmlFor="age" className="label">
              <span className="label-icon">🎂</span>
              Your Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              min="1"
              max="120"
              className="input"
              disabled={loading}
            />
          </div>

          {/* Gender Select */}
          <div className="input-group">
            <label htmlFor="gender" className="label">
              <span className="label-icon">👤</span>
              Gender
            </label>
            <div className="select-wrapper">
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="select"
                disabled={loading}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          {/* Button Group */}
          <div className="button-group">
            {/* Predict Button */}
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="btn-icon">🔮</span>
                  Predict
                </>
              )}
            </button>

            {/* Learn Button */}
            <button
              type="button"
              onClick={openLearnModal}
              className="btn btn-learn"
            >
              <span className="btn-icon">📚</span>
              Learn
            </button>
          </div>
        </form>

        {/* Result Card */}
        {result && (
          <div className="result-card success">
            <div className="result-header">
              <span className="result-icon">✨</span>
              <span>Prediction Complete!</span>
            </div>
            <div className="result-genre">
              <span className="genre-label">Your predicted genre is</span>
              <span className="genre-value">{result}</span>
            </div>
            <button onClick={handleReset} className="btn btn-secondary">
              Try Again
            </button>
          </div>
        )}

        {/* Error Card */}
        {error && (
          <div className="result-card error">
            <div className="result-header">
              <span className="result-icon">⚠️</span>
              <span>Something went wrong</span>
            </div>
            <p className="error-message">{error}</p>
            <button onClick={handleReset} className="btn btn-secondary">
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Learn Modal */}
      {showLearnModal && (
        <div className="modal-overlay" onClick={closeLearnModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <span className="modal-icon">📚</span>
                Teach the AI
              </h2>
              <button className="modal-close" onClick={closeLearnModal}>×</button>
            </div>
            
            <p className="modal-subtitle">Help improve predictions by adding your data</p>

            <form onSubmit={handleLearnSubmit} className="form">
              {/* Age Input */}
              <div className="input-group">
                <label htmlFor="learn-age" className="label">
                  <span className="label-icon">🎂</span>
                  Age
                </label>
                <input
                  type="number"
                  id="learn-age"
                  value={learnAge}
                  onChange={(e) => setLearnAge(e.target.value)}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  className="input"
                  disabled={learnLoading}
                />
              </div>

              {/* Gender Select */}
              <div className="input-group">
                <label htmlFor="learn-gender" className="label">
                  <span className="label-icon">👤</span>
                  Gender
                </label>
                <div className="select-wrapper">
                  <select
                    id="learn-gender"
                    value={learnGender}
                    onChange={(e) => setLearnGender(e.target.value as Gender)}
                    className="select"
                    disabled={learnLoading}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              {/* Genre Select */}
              <div className="input-group">
                <label htmlFor="learn-genre" className="label">
                  <span className="label-icon">🎸</span>
                  Favorite Genre
                </label>
                <div className="select-wrapper">
                  <select
                    id="learn-genre"
                    value={learnGenre}
                    onChange={(e) => setLearnGenre(e.target.value as Genre)}
                    className="select"
                    disabled={learnLoading}
                  >
                    <option value="">Select genre</option>
                    <optgroup label="Original Genres">
                      <option value="HipHop">🎤 HipHop</option>
                      <option value="Jazz">🎷 Jazz</option>
                      <option value="Classical">🎻 Classical</option>
                      <option value="Dance">💃 Dance</option>
                      <option value="Acoustic">🎸 Acoustic</option>
                    </optgroup>
                    <optgroup label="Popular">
                      <option value="Pop">🎵 Pop</option>
                      <option value="Rock">🎸 Rock</option>
                      <option value="R&B">🎙️ R&B</option>
                      <option value="Electronic">🎧 Electronic</option>
                      <option value="Country">🤠 Country</option>
                    </optgroup>
                    <optgroup label="Classic Styles">
                      <option value="Blues">🎺 Blues</option>
                      <option value="Soul">💜 Soul</option>
                      <option value="Funk">🕺 Funk</option>
                      <option value="Reggae">🌴 Reggae</option>
                    </optgroup>
                    <optgroup label="Modern & Alternative">
                      <option value="Indie">🌙 Indie</option>
                      <option value="Metal">🤘 Metal</option>
                      <option value="Punk">⚡ Punk</option>
                      <option value="Lo-Fi">🌊 Lo-Fi</option>
                    </optgroup>
                    <optgroup label="World">
                      <option value="Latin">💃 Latin</option>
                      <option value="K-Pop">🇰🇷 K-Pop</option>
                    </optgroup>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isLearnFormValid() || learnLoading}
                className={`btn btn-primary ${learnLoading ? 'btn-loading' : ''}`}
              >
                {learnLoading ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">💾</span>
                    Save Data
                  </>
                )}
              </button>
            </form>

            {/* Success Message */}
            {learnSuccess && (
              <div className="modal-message success">
                <span>✅</span> {learnSuccess}
              </div>
            )}

            {/* Error Message */}
            {learnError && (
              <div className="modal-message error">
                <span>⚠️</span> {learnError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>Powered by Machine Learning</p>
      </footer>
    </div>
  );
};

export default App;
