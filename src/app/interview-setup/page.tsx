// src/app/interview-setup/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface State {
  duration: string | null;
  type: string | null;
  source: string | null;
  company: string;
  role: string;
  ownText: string;
  pickedProblem: string | null;
}

interface Option {
  val: string;
  label: string;
  cls: string;
}

interface StepConfig {
  title: string;
  desc: string;
  label: string;
  options: Option[];
}

const stepsConfig: Record<string, StepConfig> = {
  duration: {
    title: 'Choose duration',
    desc: 'How long should this interview run? This also sets the timer during your session.',
    label: 'Pick one',
    options: [
      { val: '15', label: '15 min', cls: 'clip1' },
      { val: '30', label: '30 min', cls: 'clip2' },
      { val: '45', label: '45 min', cls: 'clip3' },
      { val: '60', label: '60 min', cls: 'clip6' },
    ]
  },
  type: {
    title: 'Choose interview type',
    desc: 'Pick the format. This decides what kind of problem gets used and how it is graded.',
    label: 'Pick one',
    options: [
      { val: 'HLD', label: 'HLD', cls: 'clip1' },
      { val: 'LLD', label: 'LLD', cls: 'clip2' },
      { val: 'DSA', label: 'DSA', cls: 'clip3' },
      { val: 'AI', label: 'AI / ML', cls: 'clip4' },
      { val: 'Behavioral', label: 'Behavioral', cls: 'clip5' },
      { val: 'PR', label: 'Code Review', cls: 'clip6' },
    ]
  },
  source: {
    title: 'Choose problem source',
    desc: 'How do you want your problem statement to be decided?',
    label: 'Pick one',
    options: [
      { val: 'ai', label: 'Generate with AI', cls: 'clip1' },
      { val: 'own', label: 'Write your own', cls: 'clip2' },
    ]
  }
};

const gradients: Record<string, string> = {
  clip1: 'linear-gradient(160deg,#3E6BFF,#213FCC)',
  clip2: 'linear-gradient(160deg,#00E0AB,#00A87E)',
  clip3: 'linear-gradient(160deg,#262832,#121319)',
  clip4: 'linear-gradient(160deg,#FF6B6B,#C93030)',
  clip5: 'linear-gradient(160deg,#B084F5,#7B3FD9)',
  clip6: 'linear-gradient(160deg,#FFB930,#C97800)',
};

export default function InterviewSetupPage() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState('duration');
  const [state, setState] = useState<State>({
    duration: null,
    type: null,
    source: null,
    company: '',
    role: '',
    ownText: '',
    pickedProblem: null,
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const selectOption = (step: string, val: string) => {
    setState(prev => ({ ...prev, [step]: val }));
    
    if (step === 'duration' && !state.type) {
      setTimeout(() => setCurrentStep('type'), 350);
    } else if (step === 'type' && !state.source) {
      setTimeout(() => setCurrentStep('source'), 350);
    }
  };

  const updateField = (field: keyof State, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const doneSteps = [state.duration, state.type, state.source].filter(Boolean).length;
  const currentStepNum = doneSteps < 3 ? doneSteps + 1 : 3;

  const metaParts = [];
  if (state.duration) metaParts.push(`<b>${state.duration} min</b>`);
  if (state.type) metaParts.push(`<b>${state.type}</b>`);
  if (state.source) {
    const sourceLabels: Record<string, string> = {
      ai: 'AI generated',
      own: 'Own statement'
    };
    metaParts.push(`<b>${sourceLabels[state.source]}</b>`);
  }

  const isReady = state.duration && state.type && state.source &&
    (state.source !== 'own' || state.ownText.trim().length > 0);

  const startInterview = async () => {
    try {
      const payload = {
        duration: parseInt(state.duration!),
        type: state.type!.toLowerCase(),
        source: state.source,
        company: state.company || 'General',
        role: state.role,
        ownText: state.ownText,
      };

      const res = await fetch('/api/interviews/setup-and-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Failed to start interview: ${data.error}`);
        return;
      }

      if (data.id) {
        router.push(`/interview/live/${data.id}`);
      }
    } catch (err) {
      console.error('Network error starting interview:', err);
      alert('Network error starting interview');
    }
  };

  const cfg = stepsConfig[currentStep];

  return (
    <div style={{
      background: '#FAF9F6',
      color: '#15161C',
      fontFamily: '"Inter", sans-serif',
      WebkitFontSmoothing: 'antialiased',
      padding: '48px 24px',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1080px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '32px',
        padding: '36px 40px 40px',
        boxShadow: '0 24px 60px rgba(21,22,28,0.06)',
        border: '1px solid rgba(21,22,28,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', gap: '24px' }}>
          <div style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: '18px', whiteSpace: 'nowrap' }}>
            interview<span style={{ color: '#C97800' }}>.</span>lab
          </div>
          <div style={{
            flex: 1,
            maxWidth: '340px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#FAF9F6',
            border: '1px solid rgba(21,22,28,0.08)',
            borderRadius: '999px',
            padding: '10px 18px',
            fontSize: '13.5px',
            color: '#5A5B66'
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.3-4.3"/>
            </svg>
            <span>Search actions&hellip;</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 600, color: '#5A5B66', whiteSpace: 'nowrap' }}>
            Menu
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="19" cy="12" r="2"/>
            </svg>
          </div>
        </div>

        <div style={{ display: 'flex', borderRadius: '26px', overflow: 'hidden', minHeight: '460px' }}>
          <div style={{
            width: '52px',
            flexShrink: 0,
            background: '#FAF9F6',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 0'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', alignItems: 'center' }}>
              {['duration', 'type', 'source'].map((step) => (
                <div
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: currentStep === step ? '#15161C' : '#5A5B66',
                    letterSpacing: '0.02em',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                >
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </div>
              ))}
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A5B66" strokeWidth="2.5" style={{ animation: 'bob 2s ease-in-out infinite' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>

          <div style={{
            flex: '0 0 42%',
            position: 'relative',
            background: 'linear-gradient(165deg,#FFB930,#C97800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ position: 'absolute', top: '18px', right: '18px' }}>
              <button 
                onClick={() => router.push('/')}
                style={{
                  position: 'relative',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(255,255,255,0.18)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 1
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 6l12 12M18 6L6 18"/>
                </svg>
              </button>
            </div>

            {currentStep === 'duration' && (
              <svg width="120" height="120" viewBox="0 0 200 200" fill="none" style={{ animation: 'float 4.5s ease-in-out infinite' }}>
                <circle cx="100" cy="100" r="92" fill="rgba(255,255,255,0.14)"/>
                <circle cx="100" cy="100" r="52" stroke="#fff" strokeWidth="7" fill="none"/>
                <line x1="100" y1="100" x2="100" y2="66" stroke="#fff" strokeWidth="7" strokeLinecap="round"/>
                <line x1="100" y1="100" x2="124" y2="112" stroke="#fff" strokeWidth="7" strokeLinecap="round"/>
              </svg>
            )}

            {currentStep === 'type' && (
              <svg width="120" height="120" viewBox="0 0 200 200" fill="none" style={{ animation: 'float 4.5s ease-in-out infinite' }}>
                <circle cx="100" cy="100" r="92" fill="rgba(255,255,255,0.14)"/>
                <path d="M100 56L150 84L100 112L50 84Z" stroke="#fff" strokeWidth="7" strokeLinejoin="round" fill="none"/>
                <path d="M50 106L100 134L150 106" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M50 128L100 156L150 128" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            )}

            {currentStep === 'source' && (
              <svg width="120" height="120" viewBox="0 0 200 200" fill="none" style={{ animation: 'float 4.5s ease-in-out infinite' }}>
                <circle cx="100" cy="100" r="92" fill="rgba(255,255,255,0.14)"/>
                <circle cx="100" cy="100" r="46" stroke="#fff" strokeWidth="7" fill="none"/>
                <circle cx="100" cy="100" r="24" stroke="#fff" strokeWidth="7" fill="none"/>
                <circle cx="100" cy="100" r="6" fill="#fff"/>
              </svg>
            )}

            <div style={{ position: 'absolute', bottom: '26px', left: '26px' }}>
              <button 
                onClick={startInterview}
                disabled={!isReady}
                style={{
                  position: 'relative',
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#fff',
                  color: '#C97800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isReady ? 'pointer' : 'not-allowed',
                  zIndex: 1,
                  boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
                  opacity: isReady ? 1 : 0.35
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <div style={{ flex: 1, padding: '34px 38px', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              alignSelf: 'flex-end',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#C97800',
              background: 'rgba(232,148,10,0.1)',
              padding: '5px 12px',
              borderRadius: '999px',
              marginBottom: 'auto'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E8940A', animation: 'pulse 1.8s ease-in-out infinite' }}></span>
              Step {currentStepNum} of 3
            </div>

            <h2 style={{ fontSize: '30px', fontWeight: 700, marginTop: '18px', fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}>
              {cfg.title}
            </h2>
            <div style={{ fontSize: '13px', color: '#5A5B66', marginTop: '4px', fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: metaParts.length ? metaParts.join(' &middot; ') : 'Nothing selected yet' }} />
            <p style={{ fontSize: '14px', color: '#5A5B66', lineHeight: 1.65, marginTop: '16px', maxWidth: '420px' }}>
              {cfg.desc}
            </p>

            <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#5A5B66', margin: '22px 0 12px' }}>
              {cfg.label}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {cfg.options.map((opt) => (
                <div
                  key={opt.val}
                  onClick={() => selectOption(currentStep, opt.val)}
                  style={{
                    flex: 1,
                    minWidth: '110px',
                    height: '56px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    gap: '6px',
                    cursor: 'pointer',
                    padding: '0 10px',
                    textAlign: 'center',
                    background: gradients[opt.cls],
                    transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                    outline: state[currentStep as keyof State] === opt.val ? '2px solid #15161C' : '2px solid transparent',
                    outlineOffset: '2px'
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>

            {currentStep === 'source' && state.source === 'ai' && (
              <div style={{
                marginTop: '16px',
                border: '1px solid rgba(21,22,28,0.08)',
                borderRadius: '14px',
                padding: '16px 18px',
                background: '#FAF9F6'
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5A5B66', marginBottom: '6px' }}>
                      Target company (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Amazon, Stripe"
                      value={state.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      style={{
                        width: '100%',
                        border: '1px solid rgba(21,22,28,0.1)',
                        borderRadius: '10px',
                        padding: '9px 11px',
                        fontSize: '13px',
                        fontFamily: '"Inter", sans-serif',
                        color: '#15161C',
                        background: '#fff',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5A5B66', marginBottom: '6px' }}>
                      Role level (optional)
                    </label>
                    <select
                      value={state.role}
                      onChange={(e) => updateField('role', e.target.value)}
                      style={{
                        width: '100%',
                        border: '1px solid rgba(21,22,28,0.1)',
                        borderRadius: '10px',
                        padding: '9px 11px',
                        fontSize: '13px',
                        fontFamily: '"Inter", sans-serif',
                        color: '#15161C',
                        background: '#fff',
                        outline: 'none'
                      }}
                    >
                      <option value="">Any</option>
                      <option value="Junior">Junior / L3</option>
                      <option value="Mid">Mid / L4</option>
                      <option value="Senior">Senior / L5</option>
                      <option value="Staff">Staff / L6</option>
                    </select>
                  </div>
                </div>
                <div style={{ fontSize: '11.5px', color: '#5A5B66', marginTop: '8px' }}>
                  Leave blank — AI generates a generic problem for the selected type.
                </div>
              </div>
            )}

            {currentStep === 'source' && state.source === 'own' && (
              <div style={{
                marginTop: '16px',
                border: '1px solid rgba(21,22,28,0.08)',
                borderRadius: '14px',
                padding: '16px 18px',
                background: '#FAF9F6'
              }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5A5B66', marginBottom: '6px' }}>
                  Problem statement
                </label>
                <textarea
                  placeholder="Type or paste your problem..."
                  value={state.ownText}
                  onChange={(e) => updateField('ownText', e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid rgba(21,22,28,0.1)',
                    borderRadius: '10px',
                    padding: '9px 11px',
                    fontSize: '13px',
                    fontFamily: '"Inter", sans-serif',
                    color: '#15161C',
                    background: '#fff',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '70px'
                  }}
                />
              </div>
            )}

            {isReady && (
              <button
                onClick={startInterview}
                style={{
                  marginTop: '24px',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(160deg,#FFB930,#C97800)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(201,120,0,0.25)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(201,120,0,0.35)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(201,120,0,0.25)';
                }}
              >
                Start Interview
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}
