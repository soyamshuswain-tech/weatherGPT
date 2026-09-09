import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, CloudRain, Zap, Waves, Tornado, ShieldAlert, Activity, Navigation, ExternalLink, ArrowRight, Radio } from 'lucide-react';
import { sendMessageToGPT } from '../services/weatherGPTService';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from '../contexts/LocationContext';
import { useNavigate } from 'react-router-dom';

export default function WeatherGPT() {
  const { language } = useLanguage();
  const { userLocation } = useLocation();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      isStructured: true,
      content: {
        answer: "System active. I am WeatherGPT, your AI-powered disaster intelligence assistant. I am currently monitoring your location for meteorological and environmental threats. You can type or use your voice to ask any weather question.",
        riskLevel: "Monitoring",
        confidence: "High",
        action: "Click the microphone button to give voice commands or type below.",
        related: "Live Impact Map"
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup speech recognition and text-to-speech on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-To-Speech function
  const speakText = (text, msgId) => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking && activeSpeechId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'or' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeechId(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeechId(null);
    };

    setActiveSpeechId(msgId);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Command (Speech-to-Text) Toggle
  const toggleVoiceRecognition = () => {
    setSpeechError(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Voice command is not supported in this browser. Please use Chrome, Edge, or Safari.");
      setTimeout(() => setSpeechError(null), 5000);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'or' ? 'en-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);

        // If user finished speaking their sentence
        if (event.results[0].isFinal) {
          setIsListening(false);
          // Automatically trigger query sending
          setTimeout(() => {
            handleSend(transcript);
          }, 350);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setSpeechError("Microphone access was denied. Please allow microphone permissions in browser settings.");
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Voice recognition error: ${event.error}`);
        }
        setIsListening(false);
        setTimeout(() => setSpeechError(null), 5000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      setSpeechError("Unable to access microphone. Please check your permissions.");
      setTimeout(() => setSpeechError(null), 5000);
    }
  };

  const handleSend = async (messageOverride) => {
    const textToSend = typeof messageOverride === 'string' ? messageOverride : input;
    if (!textToSend.trim()) return;

    const userMsg = textToSend;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await sendMessageToGPT(userMsg, { 
      language, 
      lat: userLocation?.lat, 
      lng: userLocation?.lng 
    });

    // Mocking a structured response for demonstration based on query content
    const lower = userMsg.toLowerCase();
    const mockStructuredResponse = {
      answer: response.reply,
      riskLevel: (lower.includes('flood') || lower.includes('cyclone')) ? 'HIGH' : (lower.includes('rain') || lower.includes('lightning')) ? 'MODERATE' : 'LOW',
      confidence: "92%",
      action: lower.includes('flood') 
        ? "Move to higher ground immediately." 
        : lower.includes('cyclone')
        ? "Secure windows and remain in reinforced shelter."
        : lower.includes('lightning')
        ? "Stay indoors away from metal objects."
        : "Continue monitoring local weather updates.",
      related: (lower.includes('shelter') || lower.includes('emergency')) ? "Emergency Assistance" : "Live Impact Map"
    };

    const newMsgId = Date.now() + 1;
    setMessages(prev => [...prev, { 
      id: newMsgId, 
      sender: 'bot', 
      isStructured: true, 
      content: mockStructuredResponse 
    }]);
    setIsTyping(false);
  };

  const quickPrompts = [
    { icon: CloudRain, text: "Will it rain today?" },
    { icon: Waves, text: "Is my location at flood risk?" },
    { icon: Navigation, text: "Is it safe to travel?" },
    { icon: ShieldAlert, text: "Are there any active warnings?" },
    { icon: Activity, text: "Find the nearest safe shelter." }
  ];

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 h-[calc(100vh-4rem)] flex flex-col bg-navy-900 overflow-hidden relative animate-in fade-in duration-300">
      
      {/* Ambient background atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Intelligence Header Bar */}
      <div className="shrink-0 px-6 md:px-12 py-4 border-b border-glass-border bg-navy-900/80 backdrop-blur-md flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/15 text-accent-blue flex items-center justify-center border border-accent-blue/30 shadow-[0_0_15px_rgba(0,180,216,0.3)]">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">WeatherGPT Assistant</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent-blue/20 text-accent-blue border border-accent-blue/30 tracking-wider uppercase">
                Live Fullscreen
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Natural voice & text intelligence for hyper-local disaster mitigation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-navy-800/80 px-3 py-1.5 rounded-full border border-glass-border">
            <Activity size={13} className="text-green-400 animate-pulse" />
            <span>AI Online</span>
          </div>
          {messages.length > 1 && (
            <button
              onClick={() => setMessages([messages[0]])}
              className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-glass-border hover:bg-navy-800 transition-colors cursor-pointer"
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Chat Stream */}
      <div className="flex-1 overflow-y-auto px-4 md:px-12 lg:px-20 py-8 space-y-6 custom-scrollbar z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex gap-4 w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender !== 'user' && (
                <div className="w-9 h-9 rounded-xl shrink-0 bg-navy-800 text-accent-blue border border-accent-blue/30 flex items-center justify-center shadow-md">
                  <Bot size={18} />
                </div>
              )}

              {msg.sender === 'user' ? (
                <div className="max-w-2xl px-5 py-3.5 rounded-2xl bg-gradient-to-r from-accent-blue/20 via-blue-600/25 to-accent-blue/30 border border-accent-blue/40 text-white shadow-lg backdrop-blur-sm">
                  <p className="leading-relaxed text-sm md:text-base">{msg.text}</p>
                </div>
              ) : (
                <div className="flex-1 max-w-3xl">
                  {msg.isStructured ? (
                    <div className="bg-navy-800/80 border border-glass-border rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 backdrop-blur-md transition-all hover:border-accent-blue/30">
                      
                      {/* Top Action Row */}
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-accent-blue tracking-wide">
                          <Bot size={17} /> Meteorological Assessment
                        </div>
                        <button
                          onClick={() => speakText(msg.content.answer, msg.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                            activeSpeechId === msg.id && isSpeaking
                              ? 'bg-accent-blue/25 text-accent-blue border border-accent-blue/50 shadow-[0_0_12px_rgba(0,180,216,0.4)] animate-pulse'
                              : 'text-gray-300 hover:text-white bg-navy-900/80 hover:bg-navy-700/80 border border-white/10'
                          }`}
                          title={activeSpeechId === msg.id && isSpeaking ? "Stop audio voice" : "Read answer aloud"}
                        >
                          {activeSpeechId === msg.id && isSpeaking ? <VolumeX size={15} className="text-red-400" /> : <Volume2 size={15} />}
                          <span>{activeSpeechId === msg.id && isSpeaking ? "Stop Voice" : "Listen to Audio"}</span>
                        </button>
                      </div>

                      {/* Main Answer Narrative */}
                      <p className="text-gray-100 leading-relaxed text-base md:text-lg mb-6 font-normal">
                        {msg.content.answer}
                      </p>
                      
                      {/* Telemetry Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-navy-900/60 border border-white/5">
                        <div>
                          <div className="text-gray-400 text-xs mb-1">Threat Level</div>
                          <div className={`font-bold text-sm md:text-base flex items-center gap-1.5 ${
                            msg.content.riskLevel === 'HIGH' ? 'text-orange-400' : msg.content.riskLevel === 'MODERATE' ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                            {msg.content.riskLevel === 'HIGH' ? 'High Risk' : msg.content.riskLevel === 'MODERATE' ? 'Moderate Watch' : 'Normal / Low'}
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-400 text-xs mb-1">Model Confidence</div>
                          <div className="text-white font-bold text-sm md:text-base">{msg.content.confidence}</div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <div className="text-gray-400 text-xs mb-1">Impact Layer</div>
                          <div className="text-accent-blue font-semibold text-sm">
                            {userLocation?.address || "Active Region"}
                          </div>
                        </div>
                      </div>

                      {/* Recommended Action */}
                      <div className="mb-6 p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                        <div className="text-accent-blue text-xs font-semibold uppercase tracking-wider mb-1">
                          Recommended Safety Action
                        </div>
                        <p className="text-gray-200 text-sm leading-relaxed">{msg.content.action}</p>
                      </div>
                      
                      {msg.content.related && (
                        <div className="flex justify-end pt-2">
                          <button 
                            onClick={() => navigate(msg.content.related.includes('Map') ? '/map' : '/emergency')} 
                            className="text-sm font-medium text-accent-blue hover:text-accent-blue-hover transition-colors flex items-center gap-1.5 group cursor-pointer"
                          >
                            Explore {msg.content.related} <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-navy-800/80 border border-glass-border text-gray-200 flex items-start justify-between gap-4 shadow-md">
                      <p className="leading-relaxed text-sm md:text-base">{msg.text}</p>
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`p-2 rounded-lg text-xs transition-colors cursor-pointer shrink-0 ${
                          activeSpeechId === msg.id && isSpeaking
                            ? 'bg-accent-blue/20 text-accent-blue animate-pulse'
                            : 'text-gray-400 hover:text-white bg-navy-900/60'
                        }`}
                        title={activeSpeechId === msg.id && isSpeaking ? "Stop audio" : "Listen to answer"}
                      >
                        {activeSpeechId === msg.id && isSpeaking ? <VolumeX size={15} className="text-red-400" /> : <Volume2 size={15} />}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 max-w-md self-start items-center">
              <div className="w-9 h-9 rounded-xl shrink-0 bg-navy-800 border border-accent-blue/30 text-accent-blue flex items-center justify-center">
                <Bot size={18} className="animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div className="px-5 py-3 rounded-2xl bg-navy-800/80 border border-glass-border text-gray-300 text-sm flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Analyzing atmospheric parameters...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Pinned Fullscreen Console */}
      <div className="shrink-0 px-4 md:px-12 lg:px-20 py-4 bg-navy-900/90 backdrop-blur-xl border-t border-glass-border z-20">
        <div className="max-w-4xl mx-auto space-y-3">
          
          {/* Suggested Prompts Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-xs text-gray-400 whitespace-nowrap font-medium flex items-center gap-1 mr-1">
              <Mic size={12} className="text-accent-blue" /> Quick:
            </span>
            {quickPrompts.map((prompt, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(prompt.text)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-glass-border bg-navy-800/90 text-gray-300 text-xs hover:bg-navy-700 hover:text-white hover:border-accent-blue/40 transition-all whitespace-nowrap cursor-pointer shadow-sm"
              >
                <prompt.icon size={12} className="text-accent-blue" />
                {prompt.text}
              </button>
            ))}
          </div>

          {/* Speech Error Banner */}
          {speechError && (
            <div className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-xl flex items-center justify-between shadow-lg animate-in fade-in">
              <span>{speechError}</span>
              <button onClick={() => setSpeechError(null)} className="text-gray-400 hover:text-white text-base leading-none">&times;</button>
            </div>
          )}

          {/* Active Listening Waveform Banner */}
          {isListening && (
            <div className="px-5 py-2.5 bg-navy-800/95 border border-accent-blue/60 text-accent-blue rounded-xl flex items-center justify-between shadow-[0_0_20px_rgba(0,180,216,0.25)] animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 h-4">
                  <span className="w-1 h-3 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-5 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                </div>
                <span className="text-xs md:text-sm font-semibold text-white tracking-wide">
                  Listening to voice command... Speak your weather query clearly
                </span>
              </div>
              <button 
                onClick={toggleVoiceRecognition}
                className="text-xs font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded-full border border-red-500/40 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Input Console Bar */}
          <div className="relative flex items-center shadow-2xl">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening... Speak your weather question" : "Ask WeatherGPT a question or click the mic to speak..."}
              className={`w-full bg-navy-800/90 border text-white rounded-2xl pl-5 pr-28 py-4 focus:outline-none transition-all text-sm md:text-base ${
                isListening 
                  ? 'border-accent-blue shadow-[0_0_20px_rgba(0,180,216,0.35)] bg-navy-800' 
                  : 'border-glass-border focus:border-accent-blue focus:shadow-[0_0_15px_rgba(0,180,216,0.2)]'
              }`}
            />
            
            <div className="absolute right-2.5 flex items-center gap-1.5">
              {/* Voice Command Mic Button */}
              <button 
                type="button"
                onClick={toggleVoiceRecognition}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isListening 
                    ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-pulse' 
                    : 'text-gray-400 hover:text-accent-blue hover:bg-navy-700/70'
                }`}
                title={isListening ? "Stop listening" : "Voice Command (Click & Speak)"}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              {/* Send Button */}
              <button 
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2.5 text-accent-blue hover:text-white hover:bg-accent-blue rounded-xl disabled:opacity-30 disabled:text-gray-600 disabled:hover:bg-transparent transition-all cursor-pointer"
                title="Send query"
              >
                <Send size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
