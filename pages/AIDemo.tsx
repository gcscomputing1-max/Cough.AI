
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIDemoForm from '../components/AIDemoForm';
import ResultCard from '../components/ResultCard';
import WaveformVisualizer from '../components/WaveformVisualizer';
import { CoughAnalysisResult } from '../types';
import { simulateCoughAnalysis, findNearbyMedicalHelp } from '../services/geminiService';
import { trackAnalysis } from '../lib/supabaseClient';

const AIDemo: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CoughAnalysisResult | null>(null);
  const [isSearchingHospitals, setIsSearchingHospitals] = useState(false);
  const [hospitalData, setHospitalData] = useState<{ text: string, links: { title: string, uri: string }[] } | null>(null);

  const handleAnalyze = async (file: File | null, isRecording: boolean) => {
    setIsAnalyzing(true);
    setResult(null);
    setHospitalData(null);
    try {
      const data = await simulateCoughAnalysis();
      setResult({
        ...data,
        severity: data.confidence > 0.8 && data.type.includes('Cough') ? 'High' : 'Low'
      } as CoughAnalysisResult);
      trackAnalysis(); // Track analysis for admin stats
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const findHospitals = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsSearchingHospitals(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await findNearbyMedicalHelp(latitude, longitude);
        
        const links = response.groundingChunks
          .map(chunk => {
            if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
            if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
            return null;
          })
          .filter((link): link is { title: string, uri: string } => link !== null);

        setHospitalData({ text: response.text, links });
      } catch (error) {
        console.error("Failed to find hospitals:", error);
        alert("Could not locate nearby medical facilities.");
      } finally {
        setIsSearchingHospitals(false);
      }
    }, (error) => {
      alert("Unable to retrieve your location. Please check your permissions.");
      setIsSearchingHospitals(false);
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-20 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <i className="fa-solid fa-shield-virus"></i>
              Medical Grade Analysis
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight"
            >
              Neural <span className="gradient-text">Respiratory</span> Lab
            </motion.h1>
          </div>
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex items-center gap-4 bg-gray-50 dark:bg-slate-900 px-6 py-4 rounded-3xl border border-gray-100 dark:border-white/5"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <i className="fa-solid fa-server animate-pulse"></i>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Acoustic Engine</p>
              <p className="text-sm font-black text-gray-900 dark:text-white">OPERATIONAL</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-5 space-y-8">
            <AIDemoForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            
            <AnimatePresence>
              {result && result.severity === 'High' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-red-500/20"
                >
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-4 flex items-center gap-4">
                      <i className="fa-solid fa-truck-medical text-4xl"></i>
                      Urgent Care
                    </h3>
                    <p className="text-red-50 mb-8 leading-relaxed opacity-90 text-sm">
                      Clinical indicators suggest high severity patterns. We recommend immediate evaluation at a verified medical facility.
                    </p>
                    <button 
                      onClick={findHospitals}
                      disabled={isSearchingHospitals}
                      className="w-full bg-white text-red-600 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-red-900/20"
                    >
                      {isSearchingHospitals ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-location-arrow"></i>
                      )}
                      Find Nearest ER
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hospitalData && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl">
                    <h4 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <i className="fa-solid fa-map-pin text-red-500"></i>
                      Verified Grounding results
                    </h4>
                    <div className="prose prose-indigo prose-sm dark:prose-invert mb-8 text-gray-600 dark:text-gray-400 line-clamp-3">
                      {hospitalData.text}
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {hospitalData.links.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 hover:border-indigo-500 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">0{idx + 1}</span>
                            <span className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-[200px]">
                              {link.title || "Hospital Center"}
                            </span>
                          </div>
                          <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all"></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-7 flex flex-col h-full min-h-[600px]">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result" 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full"
                >
                  <ResultCard result={result} />
                </motion.div>
              ) : (
                <motion.div 
                  key="viz" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex-grow flex flex-col h-full"
                >
                  <div className="flex-grow min-h-[400px]">
                    <WaveformVisualizer isAnalyzing={isAnalyzing} />
                  </div>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-slate-900/50 rounded-[2rem] p-8 border border-gray-100 dark:border-white/5">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Acoustic Status</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">
                        "The visualization engine uses Fast Fourier Transform (FFT) to isolate respiratory signatures from ambient noise."
                      </p>
                    </div>
                    <div className="bg-indigo-50/50 dark:bg-indigo-500/5 rounded-[2rem] p-8 border border-indigo-100 dark:border-indigo-500/10">
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Diagnostic Tip</h4>
                      <p className="text-sm text-indigo-900/70 dark:text-indigo-400/70 leading-relaxed font-medium">
                        Zoom into the 2s-4s range to inspect the secondary cough echo for patterns common in Croup or Whooping cough.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDemo;
