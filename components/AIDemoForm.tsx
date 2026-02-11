
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIDemoFormProps {
  onAnalyze: (file: File | null, isRecording: boolean) => void;
  isAnalyzing: boolean;
}

const AIDemoForm: React.FC<AIDemoFormProps> = ({ onAnalyze, isAnalyzing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingProgress(0);
      
      const duration = 3000; // 3 seconds
      const interval = 50;
      let elapsed = 0;
      
      recordingIntervalRef.current = window.setInterval(() => {
        elapsed += interval;
        const progress = Math.min((elapsed / duration) * 100, 100);
        setRecordingProgress(progress);
        
        if (elapsed >= duration) {
          if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
          setIsRecording(false);
          onAnalyze(null, true);
        }
      }, interval);
    } else {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      setIsRecording(false);
      onAnalyze(null, true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const duration = 1500;
      const interval = 50;
      let elapsed = 0;
      
      const uploadInterval = window.setInterval(() => {
        elapsed += interval;
        const progress = Math.min((elapsed / duration) * 100, 100);
        setUploadProgress(progress);
        
        if (elapsed >= duration) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          onAnalyze(selectedFile, false);
        }
      }, interval);
    }
  };

  const isBusy = isAnalyzing || isRecording || isUploading;

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl transition-colors duration-300">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Upload or Record</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Submit a clear cough sound for neural analysis</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Record Section */}
        <div className="relative group">
          <button
            onClick={toggleRecording}
            disabled={isBusy}
            className={`w-full py-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all relative overflow-hidden ${
              isRecording 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600' 
                : 'border-indigo-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 text-indigo-400'
            } ${isBusy && !isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? (
              <>
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center animate-pulse mb-4 z-10">
                  <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
                </div>
                <span className="font-bold text-sm tracking-widest uppercase z-10">Recording... {Math.round(recordingProgress)}%</span>
                {/* Progress Overlay */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${recordingProgress}%` }}
                  className="absolute bottom-0 left-0 w-full bg-red-500/5 pointer-events-none"
                />
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-microphone text-2xl"></i>
                </div>
                <span className="font-bold text-sm uppercase tracking-widest">Start Voice Scan</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-px bg-gray-100 dark:bg-slate-800 flex-grow"></div>
          <span className="text-[10px] font-black text-gray-300 dark:text-slate-700 uppercase tracking-[0.2em]">OR</span>
          <div className="h-px bg-gray-100 dark:bg-slate-800 flex-grow"></div>
        </div>

        {/* Upload Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div 
            onClick={() => !isBusy && fileInputRef.current?.click()}
            className={`w-full py-10 border-2 border-gray-50 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 rounded-3xl flex flex-col items-center justify-center transition-colors group relative overflow-hidden ${isBusy ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept="audio/*"
              disabled={isBusy}
            />
            
            <AnimatePresence>
              {isUploading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center z-10"
                >
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-3 animate-bounce">
                    <i className="fa-solid fa-arrow-up text-indigo-600"></i>
                  </div>
                  <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Uploading Waveform... {Math.round(uploadProgress)}%</span>
                  <div className="w-48 h-1 bg-gray-200 dark:bg-slate-700 rounded-full mt-4 overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </motion.div>
              ) : selectedFile ? (
                <div className="flex flex-col items-center z-10">
                  <i className="fa-solid fa-file-audio text-3xl text-indigo-600 mb-2"></i>
                  <div className="text-indigo-600 font-bold text-sm truncate max-w-[200px]">
                    {selectedFile.name}
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    className="mt-2 text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
                    <i className="fa-solid fa-cloud-arrow-up text-indigo-400"></i>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">Import Waveform</span>
                  <span className="text-gray-300 dark:text-slate-600 text-[10px] mt-1 uppercase">MP3, WAV up to 10MB</span>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={!selectedFile || isBusy}
            className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-xl transition-all ${
              !selectedFile || isBusy
                ? 'bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-700 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none active:scale-95'
            }`}
          >
            {isBusy ? (
              <span className="flex items-center justify-center">
                <i className="fa-solid fa-circle-notch fa-spin mr-3"></i>
                {isRecording ? 'Capturing...' : isUploading ? 'Uploading...' : 'Processing...'}
              </span>
            ) : (
              'Initiate Analysis'
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-2xl flex items-start">
        <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 mr-4 shadow-sm">
          <i className="fa-solid fa-lock text-xs"></i>
        </div>
        <div>
          <p className="text-[11px] text-indigo-900 dark:text-indigo-300 font-bold uppercase tracking-wider mb-1">
            Privacy Vault
          </p>
          <p className="text-[10px] text-indigo-700/60 dark:text-indigo-400/60 leading-relaxed font-medium">
            Biometric audio data is encrypted in-transit and purged immediately after neural pattern matching.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIDemoForm;
