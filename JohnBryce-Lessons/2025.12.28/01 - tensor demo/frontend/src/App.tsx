import { useState, useRef, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types & Interfaces
import type { TabMode, PredictionResponse, TrainSuccessState } from "./models";

// Constants
import { containerVariants, tabContentVariants } from "./constants";

// Services
import { predictImage, trainModel, handleApiError } from "./services";

// Components
import {
  AnimatedBackground,
  Header,
  TabSwitcher,
  UploadZone,
  FileInfo,
  ActionButton,
  ErrorMessage,
  PredictionResult,
  TrainSuccessResult,
  LabelInput,
  InfoBox,
  Footer,
} from "./components";

function App() {
  // ═══════════════════════════════════════════════════════════════
  // 🎯 State Management
  // ═══════════════════════════════════════════════════════════════
  
  // Tab & Navigation
  const [activeTab, setActiveTab] = useState<TabMode>("identify");
  const [tabDirection, setTabDirection] = useState(0);

  // Shared States (Image Upload)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Identify Mode States
  const [result, setResult] = useState<PredictionResponse | null>(null);

  // Teach Mode States
  const [label, setLabel] = useState("");
  const [trainSuccess, setTrainSuccess] = useState<TrainSuccessState | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ═══════════════════════════════════════════════════════════════
  // 📁 File Upload Handlers
  // ═══════════════════════════════════════════════════════════════
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      setSelectedFile(file);
      setError(null);
      setResult(null);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);
  
  const handleSelectClick = () => fileInputRef.current?.click();

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setLabel("");
    setTrainSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🔀 Tab Navigation
  // ═══════════════════════════════════════════════════════════════
  
  const switchTab = (newTab: TabMode) => {
    if (newTab === activeTab) return;
    setTabDirection(newTab === "teach" ? 1 : -1);
    setActiveTab(newTab);
    setResult(null);
    setTrainSuccess(null);
    setError(null);
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎯 API Handlers
  // ═══════════════════════════════════════════════════════════════
  
  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictImage(selectedFile);
      setResult(response);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrain = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }
    if (!label.trim()) {
      setError("Please enter a label for this image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTrainSuccess(null);

    try {
      const response = await trainModel(selectedFile, label);
      
      if (response.status === "success") {
        setTrainSuccess({
          message: `Learned '${label.trim()}'!`,
          classCount: response.classes?.length || 0,
        });
        // Clear form after success
        setSelectedFile(null);
        setPreview(null);
        setLabel("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(response.message || "Training failed.");
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎨 Render
  // ═══════════════════════════════════════════════════════════════
  
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-950">
      <AnimatedBackground />

      <main className="relative z-10 min-h-screen flex items-center justify-content-center p-4 sm:p-6 lg:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg mx-auto"
        >
          {/* Glass Card */}
          <motion.div
            className="glass-card rounded-3xl overflow-hidden"
            whileHover={{ boxShadow: "0 0 60px rgba(139, 92, 246, 0.15)" }}
            transition={{ duration: 0.3 }}
          >
            <Header />
            
            <TabSwitcher activeTab={activeTab} onTabChange={switchTab} />

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Hidden Input (Shared) */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <AnimatePresence mode="wait" custom={tabDirection}>
                {/* ═══ IDENTIFY MODE ═══ */}
                {activeTab === "identify" && (
                  <motion.div
                    key="identify"
                    custom={tabDirection}
                    variants={tabContentVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-5"
                  >
                    <UploadZone
                      preview={preview}
                      isDragging={isDragging}
                      isLoading={isLoading}
                      variant="violet"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onSelectClick={handleSelectClick}
                      onClear={handleClear}
                    />

                    <FileInfo file={selectedFile} />

                    <ActionButton
                      onClick={handlePredict}
                      disabled={!selectedFile || isLoading}
                      isLoading={isLoading}
                      variant="identify"
                    />

                    <ErrorMessage error={error} />
                    <PredictionResult result={result} />
                  </motion.div>
                )}

                {/* ═══ TEACH MODE ═══ */}
                {activeTab === "teach" && (
                  <motion.div
                    key="teach"
                    custom={tabDirection}
                    variants={tabContentVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-5"
                  >
                    <UploadZone
                      preview={preview}
                      isDragging={isDragging}
                      isLoading={isLoading}
                      variant="cyan"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onSelectClick={handleSelectClick}
                      onClear={handleClear}
                    />

                    <FileInfo file={selectedFile} />

                    <LabelInput value={label} onChange={setLabel} />

                    <ActionButton
                      onClick={handleTrain}
                      disabled={!selectedFile || !label.trim() || isLoading}
                      isLoading={isLoading}
                      variant="train"
                    />

                    <ErrorMessage error={error} />
                    <TrainSuccessResult success={trainSuccess} />

                    <InfoBox>
                      Upload an image and provide a label to teach the AI a new class.
                      Training may take a moment as the model retrains on all data.
                    </InfoBox>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Footer />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
