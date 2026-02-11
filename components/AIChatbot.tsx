
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { trackDemoUnlock } from '../lib/supabaseClient';

// Audio Utility Functions
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const LiveVisualizer: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <div className="flex items-center justify-center gap-1.5 h-16 w-full px-8">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={isActive ? {
            height: [10, 40, 20, 50, 15, 30][i % 6],
            opacity: [0.4, 1, 0.6, 1, 0.5, 0.8][i % 6],
          } : { height: 4, opacity: 0.2 }}
          transition={{
            repeat: Infinity,
            duration: 0.6 + (i * 0.1),
            ease: "easeInOut",
          }}
          className="w-1.5 bg-indigo-500 rounded-full"
        />
      ))}
    </div>
  );
};

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'text' | 'live'>('text');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Welcome to Cough.ai Medical Consultation. I'm your advanced health agent. Ask about respiratory symptoms or start a Live Audio Session." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [consultantState, setConsultantState] = useState<'idle' | 'listening' | 'speaking'>('idle');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const liveSessionRef = useRef<any>(null);
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, liveTranscript, mode]);

  const stopLiveSession = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.close();
      liveSessionRef.current = null;
    }
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current.clear();
    if (audioContextsRef.current) {
      audioContextsRef.current.input.close();
      audioContextsRef.current.output.close();
    }
    setIsLiveActive(false);
    setMode('text');
    setConsultantState('idle');
  };

  const startLiveSession = async () => {
    try {
      setMode('live');
      setIsLiveActive(true);
      setLiveTranscript('Initializing secure medical channel...');
      setConsultantState('idle');

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setLiveTranscript('Connection established. State your symptoms.');
            setConsultantState('listening');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setLiveTranscript(message.serverContent.outputTranscription.text);
              setConsultantState('speaking');
            }

            if (message.serverContent?.inputTranscription) {
              setLiveTranscript(message.serverContent.inputTranscription.text);
              setConsultantState('listening');
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setConsultantState('speaking');
              const outCtx = audioContextsRef.current?.output;
              if (outCtx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
                const source = outCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outCtx.destination);
                source.addEventListener('ended', () => {
                  activeSourcesRef.current.delete(source);
                  if (activeSourcesRef.current.size === 0) setConsultantState('listening');
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                activeSourcesRef.current.add(source);
              }
            }

            if (message.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setConsultantState('listening');
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setLiveTranscript('Communication error occurred.');
          },
          onclose: () => {
            setIsLiveActive(false);
            setConsultantState('idle');
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: "You are Dr. Sync, a virtual respiratory medical consultant for Cough.ai. Keep your vocal responses concise, direct, and clinical. Reassuring but brief. Ask about: cough duration, phlegm, and triggers. ALWAYS state you are an AI assistant and emphasize contacting emergency services for serious breathing difficulty.",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });

      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start Live session:', err);
      setLiveTranscript('Failed to access microphone or establish link.');
      setIsLiveActive(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mode === 'live') return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    // SECRET COMMAND CHECK: Demo123
    if (userMsg === 'Demo123') {
      localStorage.setItem('coughai_demo_unlocked', 'true');
      trackDemoUnlock(); // Track in admin stats
      window.dispatchEvent(new Event('demo-unlocked'));
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: "Access Unlocked. The 'Use Demo Credentials' button is now active on the Login page." }]);
        setIsTyping(false);
      }, 800);
      return;
    }

    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: "You are the Cough.ai Pro Medical Assistant. Provide extremely concise, clinical information on respiratory health. Use short bullet points or brief sentences. Avoid fluff. ALWAYS include a disclaimer that you are an AI and not a substitute for professional medical advice."
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Neural sync error. Please restate." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Connectivity issue. Check network." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[320px] md:w-[380px] h-[580px] glass rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-indigo-100/50 dark:border-white/10"
          >
            {/* Header */}
            <div className="p-5 bg-slate-950 text-white flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isLiveActive ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-indigo-600'
                }`}>
                  <i className={`fa-solid ${isLiveActive ? 'fa-microphone-lines animate-pulse' : 'fa-brain'} text-[10px]`}></i>
                </div>
                <div className="flex flex-col">
                  <span className="font-black tracking-tight text-xs uppercase">Dr. Sync</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] opacity-70 font-bold uppercase tracking-[0.15em]">
                      {isLiveActive ? 'Live' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { stopLiveSession(); setIsOpen(false); }} 
                className="w-8 h-8 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
              >
                <i className="fa-solid fa-chevron-down text-[10px]"></i>
              </button>
            </div>

            {/* Content Area */}
            <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-3 no-scrollbar bg-slate-50/30 dark:bg-slate-900/40">
              {mode === 'text' ? (
                messages.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none font-medium' 
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-slate-700/50'
                    }`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="relative mb-8">
                    <motion.div 
                      animate={{ 
                        scale: consultantState === 'speaking' ? [1, 1.15, 1] : 1,
                        opacity: consultantState === 'speaking' ? [0.2, 0.35, 0.2] : 0.1
                      }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl"
                    />
                    <div className={`w-24 h-24 rounded-[2rem] bg-slate-950 border border-white/10 flex items-center justify-center relative z-10 transition-all ${
                      consultantState === 'speaking' ? 'shadow-2xl shadow-indigo-500/20 scale-105' : ''
                    }`}>
                      <i className={`fa-solid ${consultantState === 'speaking' ? 'fa-waveform-lines' : 'fa-microphone'} text-2xl text-indigo-500`}></i>
                    </div>
                  </div>
                  
                  <div className="space-y-4 w-full">
                    <div className="bg-indigo-50/50 dark:bg-indigo-500/5 rounded-full py-1.5 px-3 inline-block mx-auto border border-indigo-100/30">
                       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                         {consultantState === 'listening' ? 'Listening...' : consultantState === 'speaking' ? 'Speaking' : 'Connecting'}
                       </span>
                    </div>
                    
                    <LiveVisualizer isActive={consultantState !== 'idle'} />

                    <div className="min-h-[40px] flex items-center justify-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed animate-fadeIn line-clamp-3">
                        "{liveTranscript}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-2 w-full">
                    <button 
                      onClick={stopLiveSession}
                      className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors shadow-xl shadow-red-500/20"
                    >
                      Disconnect
                    </button>
                    <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">
                      Secure Medical Pipeline
                    </p>
                  </div>
                </div>
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-slate-700/50">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Controls */}
            {mode === 'text' && (
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-white/5 space-y-3">
                <form onSubmit={handleSend} className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Dr. Sync..."
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pl-4 pr-12 py-3.5 text-xs focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400 dark:text-white"
                  />
                  <button className="absolute right-1.5 top-1.5 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors">
                    <i className="fa-solid fa-paper-plane text-[8px]"></i>
                  </button>
                </form>
                <button 
                  onClick={startLiveSession}
                  className="w-full py-3.5 bg-slate-950 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-slate-900 transition-all border border-white/5"
                >
                  <i className="fa-solid fa-microphone-lines text-indigo-500"></i>
                  Start Voice session
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[1.75rem] shadow-2xl flex items-center justify-center text-2xl relative overflow-hidden group border-4 ${
          isOpen ? 'bg-slate-950 border-white/10' : 'bg-indigo-600 border-white dark:border-slate-950'
        } transition-all duration-500`}
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        <AnimatePresence mode="wait">
          <motion.i 
            key={isOpen ? 'close' : 'chat'}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-medical'} relative z-10 text-white`}
          ></motion.i>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AIChatbot;
