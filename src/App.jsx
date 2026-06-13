import { useEffect, useMemo, useRef, useState } from 'react';

const BREATHING_PATTERN = '5-5';
const MIN_SESSION_SECONDS = 300;
const STORAGE_KEY = 'breathing_55_sessions';
const PROFILE_KEY = 'breathing_55_profile';
const PHASES = [
  {
    key: 'inhale',
    label: '吸氣',
    guidance: '慢慢吸氣',
    seconds: 5,
    nextPosition: 'top',
  },
  {
    key: 'exhale',
    label: '吐氣',
    guidance: '慢慢吐氣',
    seconds: 5,
    nextPosition: 'bottom',
  },
];
const CYCLE_SECONDS = PHASES.reduce((total, phase) => total + phase.seconds, 0);
const DURATIONS = [
  { label: '5 分鐘', seconds: 300 },
  { label: '10 分鐘', seconds: 600 },
];
const FEELINGS = ['更平靜', '普通', '緊繃下降', '想睡', '頭暈或不適'];
const DEFAULT_PROFILE = {
  userCode: '',
  displayName: '',
  groupName: '',
  targetSessionsPerDay: 1,
};

export async function saveSessionToBackend(record) {
  // Reserved for a future Supabase insert.
  return record;
}

function getStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getStoredSessions() {
  return getStoredJson(STORAGE_KEY, []);
}

function getStoredProfile() {
  return getStoredJson(PROFILE_KEY, null);
}

function saveRecordLocally(record) {
  const sessions = getStoredSessions();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...sessions]));
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, '0');
  const seconds = String(safeSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function formatDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getLastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return formatDateKey(date);
  });
}

function normalizeProfile(profile) {
  const displayName = profile.displayName.trim();
  const fallbackCode = displayName || `USER-${Date.now().toString().slice(-5)}`;

  return {
    userCode: (profile.userCode.trim() || fallbackCode).toUpperCase(),
    displayName: displayName || fallbackCode,
    groupName: profile.groupName.trim(),
    targetSessionsPerDay: Math.max(1, Number(profile.targetSessionsPerDay) || 1),
  };
}

function buildSessionRecord({
  profile,
  startedAt,
  endedAt,
  plannedSeconds,
  elapsedSeconds,
  completed,
  cyclesCompleted,
  feeling = '',
  note = '',
}) {
  const durationSeconds = Math.max(0, Math.floor(elapsedSeconds));

  return {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `session-${Date.now()}`,
    user_code: profile.userCode,
    user_name: profile.displayName,
    group_name: profile.groupName,
    pattern: BREATHING_PATTERN,
    started_at: startedAt,
    ended_at: endedAt,
    session_date: formatDateKey(startedAt),
    planned_seconds: plannedSeconds,
    duration_seconds: durationSeconds,
    completed,
    qualified: durationSeconds >= MIN_SESSION_SECONDS,
    cycles_completed: cyclesCompleted,
    feeling,
    note,
  };
}

function App() {
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(DEFAULT_PROFILE);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [screen, setScreen] = useState('home');
  const [plannedSeconds, setPlannedSeconds] = useState(DURATIONS[0].seconds);
  const [status, setStatus] = useState('idle');
  const [startedAt, setStartedAt] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [pendingRecord, setPendingRecord] = useState(null);
  const [feeling, setFeeling] = useState(FEELINGS[0]);
  const [note, setNote] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicActive, setMusicActive] = useState(false);
  const [records, setRecords] = useState([]);
  const startedAtMsRef = useRef(null);
  const accumulatedSecondsRef = useRef(0);
  const lastSpokenPhaseRef = useRef(null);
  const audioRef = useRef(null);

  const phaseInfo = useMemo(() => {
    const phaseSecond = elapsedSeconds % CYCLE_SECONDS;
    let cursor = 0;
    for (const phase of PHASES) {
      if (phaseSecond < cursor + phase.seconds) {
        return {
          ...phase,
          remainingInPhase: cursor + phase.seconds - phaseSecond,
        };
      }
      cursor += phase.seconds;
    }
    return {
      ...PHASES[0],
      remainingInPhase: PHASES[0].seconds,
    };
  }, [elapsedSeconds]);

  const tracking = useMemo(() => {
    const days = getLastSevenDays();
    const qualifiedRecords = records.filter((record) => record.qualified);
    const target = profile?.targetSessionsPerDay ?? 1;
    const byDay = days.map((date) => {
      const count = qualifiedRecords.filter((record) => record.session_date === date).length;
      return {
        date,
        count,
        achieved: count >= target,
      };
    });

    return {
      target,
      todayCount: byDay[0]?.count ?? 0,
      achievedDays: byDay.filter((day) => day.achieved).length,
      byDay,
      totalQualified: qualifiedRecords.length,
    };
  }, [records, profile]);

  const remainingSeconds = Math.max(0, plannedSeconds - elapsedSeconds);
  const cyclesCompleted = Math.floor(elapsedSeconds / CYCLE_SECONDS);
  const progress = plannedSeconds > 0 ? Math.min(1, elapsedSeconds / plannedSeconds) : 0;
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isActive = isRunning || isPaused;
  const ballTarget =
    isRunning || isPaused || status === 'ended' ? phaseInfo.nextPosition : 'bottom';

  useEffect(() => {
    const storedProfile = getStoredProfile();
    setRecords(getStoredSessions());

    if (storedProfile) {
      setProfile(storedProfile);
      setProfileForm(storedProfile);
      setIsEditingProfile(false);
    } else {
      setIsEditingProfile(true);
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      const liveElapsed =
        accumulatedSecondsRef.current + (Date.now() - startedAtMsRef.current) / 1000;
      const nextElapsed = Math.min(plannedSeconds, Math.floor(liveElapsed));
      setElapsedSeconds(nextElapsed);

      if (liveElapsed >= plannedSeconds) {
        finishSession(true, plannedSeconds);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [isRunning, plannedSeconds]);

  useEffect(() => {
    if (!isRunning || !voiceEnabled || lastSpokenPhaseRef.current === phaseInfo.key) {
      return;
    }

    lastSpokenPhaseRef.current = phaseInfo.key;
    speakGuidance(phaseInfo.guidance);
  }, [isRunning, phaseInfo.key, phaseInfo.guidance, voiceEnabled]);

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  function speakGuidance(text) {
    if (!('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.72;
    utterance.pitch = 0.92;
    utterance.volume = 0.7;
    window.speechSynthesis.speak(utterance);
  }

  function startAmbientSound() {
    if (audioRef.current || !musicEnabled) {
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }

    const context = new AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const oscillators = [174, 220, 329.63].map((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const pan = context.createStereoPanner();

      oscillator.type = index === 1 ? 'triangle' : 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 2 ? 0.025 : 0.04;
      pan.pan.value = index === 0 ? -0.28 : index === 2 ? 0.24 : 0;
      oscillator.connect(gain);
      gain.connect(pan);
      pan.connect(filter);
      oscillator.start();
      return { oscillator, baseFrequency: frequency };
    });

    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.16;
    }
    const noise = context.createBufferSource();
    const noiseGain = context.createGain();
    noise.buffer = buffer;
    noise.loop = true;
    noiseGain.gain.value = 0.018;
    noise.connect(noiseGain);
    noiseGain.connect(filter);
    noise.start();

    filter.type = 'lowpass';
    filter.frequency.value = 720;
    filter.Q.value = 0.7;
    filter.connect(master);
    master.gain.value = 0.0001;
    master.connect(context.destination);
    master.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 1.2);

    const driftTimer = window.setInterval(() => {
      oscillators.forEach(({ oscillator, baseFrequency }, index) => {
        const drift = Math.sin(Date.now() / (4200 + index * 800)) * 0.8;
        oscillator.frequency.linearRampToValueAtTime(
          baseFrequency + drift,
          context.currentTime + 3,
        );
      });
    }, 3200);

    audioRef.current = {
      context,
      master,
      oscillators,
      noise,
      driftTimer,
    };
    setMusicActive(true);
  }

  function stopAmbientSound() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    window.clearInterval(audio.driftTimer);
    audio.master.gain.setTargetAtTime(0.0001, audio.context.currentTime, 0.25);
    window.setTimeout(() => {
      audio.oscillators.forEach(({ oscillator }) => oscillator.stop());
      audio.noise.stop();
      audio.context.close();
    }, 600);
    audioRef.current = null;
    setMusicActive(false);
  }

  function submitProfile(event) {
    event.preventDefault();
    const nextProfile = normalizeProfile(profileForm);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));
    setProfile(nextProfile);
    setProfileForm(nextProfile);
    setIsEditingProfile(false);
  }

  function startSession() {
    if (!profile) {
      setIsEditingProfile(true);
      setScreen('home');
      return;
    }

    const now = new Date();
    window.speechSynthesis?.cancel();
    setStartedAt(now.toISOString());
    setElapsedSeconds(0);
    setFeedbackOpen(false);
    setPendingRecord(null);
    setNote('');
    setFeeling(FEELINGS[0]);
    setStatus('running');
    setScreen('practice');
    startedAtMsRef.current = Date.now();
    accumulatedSecondsRef.current = 0;
    lastSpokenPhaseRef.current = null;
    startAmbientSound();
  }

  function pauseSession() {
    accumulatedSecondsRef.current = elapsedSeconds;
    setStatus('paused');
    stopAmbientSound();
    window.speechSynthesis?.pause();
  }

  function resumeSession() {
    startedAtMsRef.current = Date.now();
    setStatus('running');
    if (musicEnabled) {
      startAmbientSound();
    }
    window.speechSynthesis?.resume();
  }

  function finishSession(completed = false, forcedElapsed = elapsedSeconds) {
    if ((status === 'idle' && !startedAt) || !profile) {
      return;
    }

    const finalElapsed = Math.min(plannedSeconds, Math.max(0, Math.floor(forcedElapsed)));
    const endedAt = new Date().toISOString();
    const finalCycles = Math.floor(finalElapsed / CYCLE_SECONDS);
    const baseRecord = buildSessionRecord({
      profile,
      startedAt: startedAt ?? endedAt,
      endedAt,
      plannedSeconds,
      elapsedSeconds: finalElapsed,
      completed,
      cyclesCompleted: finalCycles,
    });

    window.speechSynthesis?.cancel();
    stopAmbientSound();
    setElapsedSeconds(finalElapsed);
    setPendingRecord(baseRecord);
    setFeedbackOpen(true);
    setStatus('ended');
    startedAtMsRef.current = null;
    accumulatedSecondsRef.current = finalElapsed;
    lastSpokenPhaseRef.current = null;
  }

  async function submitFeedback(event) {
    event.preventDefault();
    if (!pendingRecord) {
      return;
    }

    const record = {
      ...pendingRecord,
      feeling,
      note: note.trim(),
    };

    saveRecordLocally(record);
    await saveSessionToBackend(record);
    setRecords(getStoredSessions());
    setPendingRecord(null);
    setFeedbackOpen(false);
    setStatus('idle');
    setStartedAt(null);
    setElapsedSeconds(0);
    accumulatedSecondsRef.current = 0;
    setScreen('home');
  }

  function exportRecords() {
    const payload = {
      profile,
      exported_at: new Date().toISOString(),
      records,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `breathing-records-${formatDateKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (screen === 'home') {
    return (
      <main className="app-shell">
        <section className="profile-stage" aria-label="個人資料與練習追蹤">
          <div className="forest-layer layer-back" />
          <div className="forest-layer layer-mid" />
          <div className="forest-layer layer-front" />

          <div className="home-layout">
            <header className="home-header">
              <p className="eyebrow">5-5 呼吸訓練</p>
              <h1>吸 5 秒，吐 5 秒</h1>
              <p>每分鐘 6 次呼吸，每次至少 5 分鐘。</p>
            </header>

            <section className="profile-panel" aria-label="個人資料">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">個人資料</p>
                  <h2>{profile ? profile.displayName : '建立追蹤代碼'}</h2>
                </div>
                {profile && !isEditingProfile && (
                  <button className="text-button" onClick={() => setIsEditingProfile(true)} type="button">
                    編輯
                  </button>
                )}
              </div>

              {(isEditingProfile || !profile) && (
                <form className="profile-form" onSubmit={submitProfile}>
                  <label>
                    <span>個案代碼</span>
                    <input
                      onChange={(event) =>
                        setProfileForm((current) => ({
                          ...current,
                          userCode: event.target.value,
                        }))
                      }
                      placeholder="例如 A001"
                      value={profileForm.userCode}
                    />
                  </label>
                  <label>
                    <span>姓名或暱稱</span>
                    <input
                      onChange={(event) =>
                        setProfileForm((current) => ({
                          ...current,
                          displayName: event.target.value,
                        }))
                      }
                      placeholder="例如 王小明"
                      value={profileForm.displayName}
                    />
                  </label>
                  <label>
                    <span>群組 / 單位</span>
                    <input
                      onChange={(event) =>
                        setProfileForm((current) => ({
                          ...current,
                          groupName: event.target.value,
                        }))
                      }
                      placeholder="例如 A 班、病房、團體名稱"
                      value={profileForm.groupName}
                    />
                  </label>
                  <label>
                    <span>每日目標次數</span>
                    <input
                      min="1"
                      onChange={(event) =>
                        setProfileForm((current) => ({
                          ...current,
                          targetSessionsPerDay: event.target.value,
                        }))
                      }
                      type="number"
                      value={profileForm.targetSessionsPerDay}
                    />
                  </label>
                  <button className="primary full" type="submit">
                    儲存資料
                  </button>
                </form>
              )}

              {profile && !isEditingProfile && (
                <div className="profile-summary">
                  <div>
                    <span>個案代碼</span>
                    <strong>{profile.userCode}</strong>
                  </div>
                  <div>
                    <span>群組</span>
                    <strong>{profile.groupName || '未設定'}</strong>
                  </div>
                  <div>
                    <span>每日目標</span>
                    <strong>{profile.targetSessionsPerDay} 次</strong>
                  </div>
                </div>
              )}
            </section>

            <section className="tracker-panel" aria-label="練習追蹤">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">練習追蹤</p>
                  <h2>今天 {tracking.todayCount} / {tracking.target} 次</h2>
                </div>
                <button disabled={!records.length} onClick={exportRecords} type="button">
                  匯出
                </button>
              </div>

              <div className="tracker-stats">
                <div>
                  <span>達標天數</span>
                  <strong>{tracking.achievedDays}</strong>
                </div>
                <div>
                  <span>達標練習</span>
                  <strong>{tracking.totalQualified}</strong>
                </div>
              </div>

              <div className="day-list">
                {tracking.byDay.map((day) => (
                  <div className={day.achieved ? 'day-row achieved' : 'day-row'} key={day.date}>
                    <span>{day.date}</span>
                    <strong>{day.count} 次</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="start-panel" aria-label="開始練習">
              <div className="duration-picker" aria-label="選擇練習時間">
                {DURATIONS.map((duration) => (
                  <button
                    className={plannedSeconds === duration.seconds ? 'selected' : ''}
                    key={duration.seconds}
                    onClick={() => setPlannedSeconds(duration.seconds)}
                    type="button"
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
              <div className="sound-row">
                <label className="voice-toggle">
                  <input
                    checked={voiceEnabled}
                    onChange={(event) => setVoiceEnabled(event.target.checked)}
                    type="checkbox"
                  />
                  <span>語音</span>
                </label>
                <label className="voice-toggle">
                  <input
                    checked={musicEnabled}
                    onChange={(event) => {
                      setMusicEnabled(event.target.checked);
                      if (!event.target.checked) {
                        stopAmbientSound();
                      }
                    }}
                    type="checkbox"
                  />
                  <span>舒緩音樂</span>
                </label>
              </div>
              <button className="primary start-button" onClick={startSession} type="button">
                開始練習
              </button>
              <p className="safety-note">
                若練習中出現頭暈、胸悶或明顯不適，請立即停止。
              </p>
            </section>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="breathing-stage" aria-label="5-5 呼吸訓練">
        <div className="forest-layer layer-back" />
        <div className="forest-layer layer-mid" />
        <div className="forest-layer layer-front" />

        <div className="top-bar">
          <div>
            <p className="eyebrow">5-5 呼吸訓練</p>
            <h1>{profile?.displayName ?? '穩定呼吸'}</h1>
          </div>
          <div className="top-actions">
            <label className="voice-toggle">
              <input
                checked={voiceEnabled}
                onChange={(event) => setVoiceEnabled(event.target.checked)}
                type="checkbox"
              />
              <span>語音</span>
            </label>
            <label className="voice-toggle">
              <input
                checked={musicEnabled}
                onChange={(event) => {
                  setMusicEnabled(event.target.checked);
                  if (event.target.checked && isRunning) {
                    startAmbientSound();
                  } else {
                    stopAmbientSound();
                  }
                }}
                type="checkbox"
              />
              <span>{musicActive ? '音樂中' : '音樂'}</span>
            </label>
          </div>
        </div>

        <div className="breathing-center">
          <div
            className={`orb-track ${phaseInfo.nextPosition === 'top' ? 'move-up' : 'move-down'}`}
            style={{ '--phase-duration': `${phaseInfo.seconds}s` }}
          >
            <div className={`breath-orb ${ballTarget === 'top' ? 'at-top' : 'at-bottom'}`} />
          </div>

          <div className="phase-readout" aria-live="polite">
            <span>{phaseInfo.label}</span>
            <strong>{Math.ceil(phaseInfo.remainingInPhase)}</strong>
          </div>
        </div>

        <div className="metrics-panel" aria-label="練習狀態">
          <div>
            <span>已練習時間</span>
            <strong>{formatTime(elapsedSeconds)}</strong>
          </div>
          <div>
            <span>剩餘時間</span>
            <strong>{formatTime(remainingSeconds)}</strong>
          </div>
          <div>
            <span>完成輪數</span>
            <strong>{cyclesCompleted}</strong>
          </div>
        </div>

        <div className="progress-line" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>

        <div className="controls" aria-label="練習控制">
          {isRunning && (
            <button onClick={pauseSession} type="button">
              暫停
            </button>
          )}
          {isPaused && (
            <button className="primary" onClick={resumeSession} type="button">
              繼續
            </button>
          )}
          {isActive && (
            <button className="quiet" onClick={() => finishSession(false)} type="button">
              結束
            </button>
          )}
        </div>

        <p className="safety-note">
          若練習中出現頭暈、胸悶或明顯不適，請立即停止。
        </p>
      </section>

      {feedbackOpen && (
        <section className="feedback-modal" aria-label="練習回饋" role="dialog">
          <form className="feedback-card" onSubmit={submitFeedback}>
            <p className="eyebrow">本次練習已結束</p>
            <h2>記錄身體感受</h2>
            <div className="feeling-grid">
              {FEELINGS.map((item) => (
                <label className={feeling === item ? 'feeling selected' : 'feeling'} key={item}>
                  <input
                    checked={feeling === item}
                    name="feeling"
                    onChange={() => setFeeling(item)}
                    type="radio"
                    value={item}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            <label className="note-field">
              <span>備註</span>
              <textarea
                onChange={(event) => setNote(event.target.value)}
                placeholder="可記下呼吸感受、身體狀態或下次想調整的地方"
                rows="4"
                value={note}
              />
            </label>
            <div className="feedback-summary">
              <span>練習時間 {formatTime(pendingRecord?.duration_seconds ?? 0)}</span>
              <span>完成輪數 {pendingRecord?.cycles_completed ?? 0}</span>
              <span>{pendingRecord?.qualified ? '達到 5 分鐘' : '未滿 5 分鐘'}</span>
            </div>
            <button className="primary full" type="submit">
              儲存紀錄
            </button>
          </form>
        </section>
      )}
    </main>
  );
}

export default App;
