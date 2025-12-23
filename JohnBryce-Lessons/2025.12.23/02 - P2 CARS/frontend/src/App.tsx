import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// ========== TypeScript Interfaces ==========
interface PredictionResponse {
  price: number;
  success: boolean;
  error?: string;
}

interface LearnResponse {
  message: string;
  success: boolean;
  error?: string;
}

interface OptionsResponse {
  brands: Record<string, string>;
  fuel_types: Record<string, string>;
  transmissions: Record<string, string>;
  body_types: Record<string, string>;
  colors: Record<string, string>;
  car_models: string[];
  success: boolean;
}

// ========== Constants ==========
const BRANDS: Record<string, string> = {
  '0': 'Toyota', '1': 'Honda', '2': 'Ford', '3': 'Chevrolet', '4': 'BMW',
  '5': 'Mercedes', '6': 'Audi', '7': 'Volkswagen', '8': 'Hyundai', '9': 'Kia',
  '10': 'Nissan', '11': 'Mazda', '12': 'Subaru', '13': 'Tesla', '14': 'Lexus',
  '15': 'Volvo'
};

const FUEL_TYPES: Record<string, string> = {
  '0': 'Petrol', '1': 'Diesel', '2': 'Hybrid', '3': 'Electric'
};

const TRANSMISSIONS: Record<string, string> = {
  '0': 'Manual', '1': 'Automatic'
};

const BODY_TYPES: Record<string, string> = {
  '0': 'Hatchback', '1': 'Sedan', '2': 'SUV', '3': 'Crossover', '4': 'Coupe', '5': 'Truck', '6': 'Wagon'
};

const COLORS: Record<string, string> = {
  '0': 'White', '1': 'Black', '2': 'Silver', '3': 'Gray', '4': 'Blue', '5': 'Red', '6': 'Green', '7': 'Brown', '8': 'Orange'
};

// ========== Main App Component ==========
const App: React.FC = () => {
  // Predict Form State
  const [brand, setBrand] = useState<string>('');
  const [carModel, setCarModel] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [hand, setHand] = useState<string>('');
  const [mileage, setMileage] = useState<string>('');
  const [engineSize, setEngineSize] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('');
  const [transmission, setTransmission] = useState<string>('');
  const [bodyType, setBodyType] = useState<string>('');
  const [color, setColor] = useState<string>('');
  
  // Learn Form State
  const [showLearnModal, setShowLearnModal] = useState<boolean>(false);
  const [learnBrand, setLearnBrand] = useState<string>('');
  const [learnCarModel, setLearnCarModel] = useState<string>('');
  const [learnYear, setLearnYear] = useState<string>('');
  const [learnHand, setLearnHand] = useState<string>('');
  const [learnMileage, setLearnMileage] = useState<string>('');
  const [learnEngineSize, setLearnEngineSize] = useState<string>('');
  const [learnFuelType, setLearnFuelType] = useState<string>('');
  const [learnTransmission, setLearnTransmission] = useState<string>('');
  const [learnBodyType, setLearnBodyType] = useState<string>('');
  const [learnColor, setLearnColor] = useState<string>('');
  const [learnPrice, setLearnPrice] = useState<string>('');
  
  // Options from backend
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  
  // UI State
  const [loading, setLoading] = useState<boolean>(false);
  const [learnLoading, setLearnLoading] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [learnSuccess, setLearnSuccess] = useState<string | null>(null);
  const [learnError, setLearnError] = useState<string | null>(null);

  // Fetch available car models on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get<OptionsResponse>('http://127.0.0.1:5000/options');
        if (response.data.success) {
          setAvailableModels(response.data.car_models);
        }
      } catch (err) {
        console.log('Could not fetch options from server');
      }
    };
    fetchOptions();
  }, []);

  // Form validation
  const isFormValid = (): boolean => {
    return (
      brand !== '' &&
      carModel !== '' &&
      year !== '' && parseInt(year) >= 2010 && parseInt(year) <= 2025 &&
      hand !== '' &&
      mileage !== '' && parseInt(mileage) >= 0 &&
      engineSize !== '' &&
      fuelType !== '' &&
      transmission !== '' &&
      bodyType !== '' &&
      color !== ''
    );
  };

  // Learn form validation
  const isLearnFormValid = (): boolean => {
    return (
      learnBrand !== '' &&
      learnCarModel !== '' &&
      learnYear !== '' && parseInt(learnYear) >= 2010 && parseInt(learnYear) <= 2025 &&
      learnHand !== '' &&
      learnMileage !== '' && parseInt(learnMileage) >= 0 &&
      learnEngineSize !== '' &&
      learnFuelType !== '' &&
      learnTransmission !== '' &&
      learnBodyType !== '' &&
      learnColor !== '' &&
      learnPrice !== '' && parseInt(learnPrice) > 0
    );
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
          brand: parseInt(brand),
          model: carModel,
          year: parseInt(year),
          hand: parseInt(hand),
          mileage: parseInt(mileage),
          engine_size: parseFloat(engineSize),
          fuel_type: parseInt(fuelType),
          transmission: parseInt(transmission),
          body_type: parseInt(bodyType),
          color: parseInt(color)
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      if (response.data.success) {
        setResult(response.data.price);
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
          brand: parseInt(learnBrand),
          model: learnCarModel,
          year: parseInt(learnYear),
          hand: parseInt(learnHand),
          mileage: parseInt(learnMileage),
          engine_size: parseFloat(learnEngineSize),
          fuel_type: parseInt(learnFuelType),
          transmission: parseInt(learnTransmission),
          body_type: parseInt(learnBodyType),
          color: parseInt(learnColor),
          price: parseInt(learnPrice)
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        }
      );

      if (response.data.success) {
        setLearnSuccess(response.data.message || 'Data saved successfully!');
        // Reset learn form
        resetLearnForm();
        // Refresh available models
        const optionsResponse = await axios.get<OptionsResponse>('http://127.0.0.1:5000/options');
        if (optionsResponse.data.success) {
          setAvailableModels(optionsResponse.data.car_models);
        }
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

  // Reset forms
  const handleReset = () => {
    setBrand('');
    setCarModel('');
    setYear('');
    setHand('');
    setMileage('');
    setEngineSize('');
    setFuelType('');
    setTransmission('');
    setBodyType('');
    setColor('');
    setResult(null);
    setError(null);
  };

  const resetLearnForm = () => {
    setLearnBrand('');
    setLearnCarModel('');
    setLearnYear('');
    setLearnHand('');
    setLearnMileage('');
    setLearnEngineSize('');
    setLearnFuelType('');
    setLearnTransmission('');
    setLearnBodyType('');
    setLearnColor('');
    setLearnPrice('');
  };

  // Modal controls
  const openLearnModal = () => {
    setShowLearnModal(true);
    setLearnSuccess(null);
    setLearnError(null);
  };

  const closeLearnModal = () => {
    setShowLearnModal(false);
    resetLearnForm();
    setLearnSuccess(null);
    setLearnError(null);
  };

  // Format price with commas (USD format)
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon-wrapper">
            <span className="logo-icon">🚗</span>
          </div>
          <div className="logo-text">
            <h1>AutoValue<span className="logo-accent">AI</span></h1>
            <p className="tagline">Intelligent Car Price Estimation</p>
          </div>
        </div>
      </header>

      {/* Main Card */}
      <main className="card">
        <div className="card-header">
          <h2>Get Your Car's Value</h2>
          <p>Enter your vehicle details for an instant AI-powered price estimate</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          {/* Section: Basic Info */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">📋</span>
              <span>Basic Information</span>
            </div>
            
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="brand" className="label">Make</label>
                <div className="select-wrapper">
                  <select id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="select" disabled={loading}>
                    <option value="">Select Make</option>
                    {Object.entries(BRANDS).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                  <span className="select-arrow">›</span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="carModel" className="label">Model</label>
                <div className="select-wrapper">
                  <select id="carModel" value={carModel} onChange={(e) => setCarModel(e.target.value)} className="select" disabled={loading}>
                    <option value="">Select Model</option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  <span className="select-arrow">›</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="year" className="label">Year</label>
                <input type="number" id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2022" min="2010" max="2025" className="input" disabled={loading} />
              </div>

              <div className="input-group">
                <label htmlFor="hand" className="label">Previous Owners</label>
                <div className="select-wrapper">
                  <select id="hand" value={hand} onChange={(e) => setHand(e.target.value)} className="select" disabled={loading}>
                    <option value="">Select Owners</option>
                    <option value="1">1 (First Owner)</option>
                    <option value="2">2 (Second Owner)</option>
                    <option value="3">3 (Third Owner)</option>
                    <option value="4">4+ (Fourth+)</option>
                  </select>
                  <span className="select-arrow">›</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Specifications */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">⚙️</span>
              <span>Specifications</span>
            </div>
            
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="mileage" className="label">Mileage (miles)</label>
                <input type="number" id="mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="e.g. 45000" min="0" className="input" disabled={loading} />
              </div>

              <div className="input-group">
                <label htmlFor="engineSize" className="label">Engine Size (L)</label>
                <input type="number" id="engineSize" value={engineSize} onChange={(e) => setEngineSize(e.target.value)} placeholder="e.g. 2.0" min="0" max="8" step="0.1" className="input" disabled={loading} />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="fuelType" className="label">Fuel Type</label>
                <div className="select-wrapper">
                  <select id="fuelType" value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="select" disabled={loading}>
                    <option value="">Select Fuel</option>
                    <option value="0">⛽ Petrol</option>
                    <option value="1">🛢️ Diesel</option>
                    <option value="2">🔋 Hybrid</option>
                    <option value="3">⚡ Electric</option>
                  </select>
                  <span className="select-arrow">›</span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="transmission" className="label">Transmission</label>
                <div className="select-wrapper">
                  <select id="transmission" value={transmission} onChange={(e) => setTransmission(e.target.value)} className="select" disabled={loading}>
                    <option value="">Select Type</option>
                    <option value="0">Manual</option>
                    <option value="1">Automatic</option>
                  </select>
                  <span className="select-arrow">›</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Appearance */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">🎨</span>
              <span>Appearance</span>
            </div>
            
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="bodyType" className="label">Body Type</label>
                <div className="select-wrapper">
                  <select id="bodyType" value={bodyType} onChange={(e) => setBodyType(e.target.value)} className="select" disabled={loading}>
                    <option value="">Select Body</option>
                    <option value="0">Hatchback</option>
                    <option value="1">Sedan</option>
                    <option value="2">SUV</option>
                    <option value="3">Crossover</option>
                    <option value="4">Coupe</option>
                    <option value="5">Truck</option>
                    <option value="6">Wagon</option>
                  </select>
                  <span className="select-arrow">›</span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="color" className="label">Exterior Color</label>
                <div className="select-wrapper">
                  <select id="color" value={color} onChange={(e) => setColor(e.target.value)} className="select" disabled={loading}>
                    <option value="">Select Color</option>
                    <option value="0">⚪ White</option>
                    <option value="1">⚫ Black</option>
                    <option value="2">🔘 Silver</option>
                    <option value="3">◽ Gray</option>
                    <option value="4">🔵 Blue</option>
                    <option value="5">🔴 Red</option>
                    <option value="6">🟢 Green</option>
                    <option value="7">🟤 Brown</option>
                    <option value="8">🟠 Orange</option>
                  </select>
                  <span className="select-arrow">›</span>
                </div>
              </div>
            </div>
          </div>

          {/* Button Group */}
          <div className="button-group">
            <button type="submit" disabled={!isFormValid() || loading} className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}>
              {loading ? (<><span className="spinner"></span>Calculating...</>) : (<><span className="btn-icon">💎</span>Get Estimate</>)}
            </button>
            <button type="button" onClick={openLearnModal} className="btn btn-learn">
              <span className="btn-icon">🧠</span>
              Train AI
            </button>
          </div>
        </form>

        {/* Result Card */}
        {result && (
          <div className="result-card success">
            <div className="result-header">
              <span className="result-icon">✨</span>
              <span>Your Estimate is Ready!</span>
            </div>
            <div className="result-price">
              <span className="price-label">Estimated Market Value</span>
              <span className="price-value">${formatPrice(result)}</span>
              <span className="price-note">Based on current market data and AI analysis</span>
            </div>
            <button onClick={handleReset} className="btn btn-secondary">Estimate Another Vehicle</button>
          </div>
        )}

        {/* Error Card */}
        {error && (
          <div className="result-card error">
            <div className="result-header">
              <span className="result-icon">⚠️</span>
              <span>Something Went Wrong</span>
            </div>
            <p className="error-message">{error}</p>
            <button onClick={handleReset} className="btn btn-secondary">Try Again</button>
          </div>
        )}
      </main>

      {/* Learn Modal */}
      {showLearnModal && (
        <div className="modal-overlay" onClick={closeLearnModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><span className="modal-icon">🧠</span>Train the AI</h2>
              <button className="modal-close" onClick={closeLearnModal}>×</button>
            </div>
            
            <p className="modal-subtitle">Help improve accuracy by adding real vehicle sale data</p>

            <form onSubmit={handleLearnSubmit} className="form">
              {/* Make & Model */}
              <div className="form-row">
                <div className="input-group">
                  <label className="label">Make</label>
                  <div className="select-wrapper">
                    <select value={learnBrand} onChange={(e) => setLearnBrand(e.target.value)} className="select" disabled={learnLoading}>
                      <option value="">Select Make</option>
                      {Object.entries(BRANDS).map(([key, name]) => (<option key={key} value={key}>{name}</option>))}
                    </select>
                    <span className="select-arrow">›</span>
                  </div>
                </div>
                <div className="input-group">
                  <label className="label">Model</label>
                  <input type="text" value={learnCarModel} onChange={(e) => setLearnCarModel(e.target.value)} placeholder="e.g. Camry" className="input" disabled={learnLoading} />
                </div>
              </div>

              {/* Year & Owners */}
              <div className="form-row">
                <div className="input-group">
                  <label className="label">Year</label>
                  <input type="number" value={learnYear} onChange={(e) => setLearnYear(e.target.value)} placeholder="e.g. 2022" min="2010" max="2025" className="input" disabled={learnLoading} />
                </div>
                <div className="input-group">
                  <label className="label">Previous Owners</label>
                  <div className="select-wrapper">
                    <select value={learnHand} onChange={(e) => setLearnHand(e.target.value)} className="select" disabled={learnLoading}>
                      <option value="">Select</option>
                      <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option>
                    </select>
                    <span className="select-arrow">›</span>
                  </div>
                </div>
              </div>

              {/* Mileage & Engine */}
              <div className="form-row">
                <div className="input-group">
                  <label className="label">Mileage</label>
                  <input type="number" value={learnMileage} onChange={(e) => setLearnMileage(e.target.value)} placeholder="e.g. 45000" min="0" className="input" disabled={learnLoading} />
                </div>
                <div className="input-group">
                  <label className="label">Engine (L)</label>
                  <input type="number" value={learnEngineSize} onChange={(e) => setLearnEngineSize(e.target.value)} placeholder="e.g. 2.0" step="0.1" className="input" disabled={learnLoading} />
                </div>
              </div>

              {/* Fuel & Transmission */}
              <div className="form-row">
                <div className="input-group">
                  <label className="label">Fuel Type</label>
                  <div className="select-wrapper">
                    <select value={learnFuelType} onChange={(e) => setLearnFuelType(e.target.value)} className="select" disabled={learnLoading}>
                      <option value="">Select</option>
                      <option value="0">Petrol</option><option value="1">Diesel</option><option value="2">Hybrid</option><option value="3">Electric</option>
                    </select>
                    <span className="select-arrow">›</span>
                  </div>
                </div>
                <div className="input-group">
                  <label className="label">Transmission</label>
                  <div className="select-wrapper">
                    <select value={learnTransmission} onChange={(e) => setLearnTransmission(e.target.value)} className="select" disabled={learnLoading}>
                      <option value="">Select</option>
                      <option value="0">Manual</option><option value="1">Automatic</option>
                    </select>
                    <span className="select-arrow">›</span>
                  </div>
                </div>
              </div>

              {/* Body & Color */}
              <div className="form-row">
                <div className="input-group">
                  <label className="label">Body Type</label>
                  <div className="select-wrapper">
                    <select value={learnBodyType} onChange={(e) => setLearnBodyType(e.target.value)} className="select" disabled={learnLoading}>
                      <option value="">Select</option>
                      <option value="0">Hatchback</option><option value="1">Sedan</option><option value="2">SUV</option><option value="3">Crossover</option><option value="4">Coupe</option><option value="5">Truck</option><option value="6">Wagon</option>
                    </select>
                    <span className="select-arrow">›</span>
                  </div>
                </div>
                <div className="input-group">
                  <label className="label">Color</label>
                  <div className="select-wrapper">
                    <select value={learnColor} onChange={(e) => setLearnColor(e.target.value)} className="select" disabled={learnLoading}>
                      <option value="">Select</option>
                      <option value="0">White</option><option value="1">Black</option><option value="2">Silver</option><option value="3">Gray</option><option value="4">Blue</option><option value="5">Red</option><option value="6">Green</option><option value="7">Brown</option><option value="8">Orange</option>
                    </select>
                    <span className="select-arrow">›</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="input-group">
                <label className="label">Actual Sale Price ($)</label>
                <input type="number" value={learnPrice} onChange={(e) => setLearnPrice(e.target.value)} placeholder="e.g. 25000" min="1000" className="input" disabled={learnLoading} />
              </div>

              <button type="submit" disabled={!isLearnFormValid() || learnLoading} className={`btn btn-primary ${learnLoading ? 'btn-loading' : ''}`}>
                {learnLoading ? (<><span className="spinner"></span>Training...</>) : (<><span className="btn-icon">💾</span>Submit &amp; Train</>)}
              </button>
            </form>

            {learnSuccess && <div className="modal-message success"><span>✅</span> {learnSuccess}</div>}
            {learnError && <div className="modal-message error"><span>⚠️</span> {learnError}</div>}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>Powered by Machine Learning 🤖 • Built with React &amp; Python</p>
      </footer>
    </div>
  );
};

export default App;
