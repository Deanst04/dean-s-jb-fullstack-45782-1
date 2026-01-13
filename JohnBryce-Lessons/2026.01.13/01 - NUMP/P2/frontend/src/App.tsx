import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppState, PredictionResponse } from './types';
import UploadCard from './components/UploadCard';
import ResultCard from './components/ResultCard';

const API_URL = '/predict';

const initialState: AppState = {
  status: 'idle',
  imageFile: null,
  imagePreview: null,
  result: null,
  error: null,
};

function App() {
  const [state, setState] = useState<AppState>(initialState);

  const handleImageSelect = useCallback((file: File) => {
    const preview = URL.createObjectURL(file);
    setState({
      ...initialState,
      status: 'uploading',
      imageFile: file,
      imagePreview: preview,
    });
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!state.imageFile) return;

    setState((prev) => ({ ...prev, status: 'analyzing' }));

    try {
      const formData = new FormData();
      formData.append('image', state.imageFile);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const result: PredictionResponse = await response.json();

      setState((prev) => ({
        ...prev,
        status: 'complete',
        result,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));
    }
  }, [state.imageFile]);

  const handleReset = useCallback(() => {
    if (state.imagePreview) {
      URL.revokeObjectURL(state.imagePreview);
    }
    setState(initialState);
  }, [state.imagePreview]);

  return (
    <div className="min-h-screen bg-solarpunk relative overflow-hidden">
      {/* Animated background elements */}
      <div className="leaf-pattern" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-forest-800 mb-2">
            Lily Classifier
          </h1>
          <p className="text-forest-600 text-lg">
            AI-powered flower identification
          </p>
        </motion.div>

        {/* Main card container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-xl"
        >
          <AnimatePresence mode="wait">
            {state.status === 'complete' && state.result ? (
              <ResultCard
                key="result"
                result={state.result}
                imagePreview={state.imagePreview}
                onReset={handleReset}
              />
            ) : (
              <UploadCard
                key="upload"
                status={state.status}
                imagePreview={state.imagePreview}
                error={state.error}
                onImageSelect={handleImageSelect}
                onAnalyze={handleAnalyze}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-forest-500 text-sm"
        >
          Powered by PyTorch CNN
        </motion.p>
      </div>
    </div>
  );
}

export default App;
