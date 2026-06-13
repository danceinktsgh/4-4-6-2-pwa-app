import { useEffect, useMemo, useRef, useState } from 'react';

const BREATHING_PATTERN = '4-4-6-2';
const USER_CODE = 'local-user';
const STORAGE_KEY = 'breathing_4462_sessions';
const PHASES = [
  {
    key: 'inhale',
    label: '吸氣',
    guidance: '慢慢吸氣',
    seconds: 4,
    ballPosition: 'bottom',
    nextPosition: 'top',
  },
  {
    key: 'holdHigh',
    label: '停留',
    guidance: '輕輕停留',
    seconds: 4,
    ballPosition: 'top',
    nextPosition: 'top',
  },
  {
    key: 'exhale',
    label: '呼氣',
    guidance: '慢慢呼氣',
    seconds: 6,
    ballPosition: 'top',
    nextPosition: 'bottom',
  },
  {
    key: 'holdLow',
    label: '停留',
    guidance: '自然停留',
    seconds: 2,
    ballPosition: 'bottom',
    nextPosition: 'bottom',
  },
];
const CYCLE_SECONDS = PHASES.reduce((total, phase) => total + phase.seconds, 0);
const DURATIONS = [
  { label: '5 分鐘', seconds: 300 },
  { label: '10 分鐘', seconds: 600 },
];
const FEELINGS = ['更平靜', '普通', '緊繃下降', '想睡', '頭暈或不適'];

export async function saveSessionToBackend(record) {
  // Reserved for a future Supabase insert.
  return record;
}

function getStoredSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
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

function buildSessionRecord({
  startedAt,
  endedAt,
  plannedSeconds,
  elapsedSeconds,
  completed,
  cyclesCompleted,
  feeling = '',
  note = '',
}) {
  return {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `session-${Date.now()}`,
    user_code: USER_CODE,
    pattern: BREATHING_PATTERN,
    started_at: startedAt,
    ended_at: endedAt,
    planned_seconds: plannedSeconds,
    duration_seconds: Math.max(0, Math.floor(elapsedSeconds)),
    completed,
    cycles_completed: cyclesCompleted,
    feeling,
    note,
  };
}

function App() {
  const [plannedSeconds, setPlannedSeconds] = useState(DURATIONS[0].seconds);
  const [status, setStatus] = useState('idle');
  const [startedAt, setStartedAt] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [pendingRecord, setPendingRecord] = useState(null);
  const [feeling, setFeeling] = useState(FEELINGS[0]);
  const [note, setNote] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [records, setRecords] = useState([]);
  const startedAtMsRef = useRef(null);
  const accumulatedSecondsRef = useRef(0);
  const lastSpokenPhaseRef = useRef(null);

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

  const remainingSeconds = Math.max(0, plannedSeconds - elapsedSeconds);
  const cyclesCompleted = Math.floor(elapsedSeconds / CYCLE_SECONDS);
  const progress = plannedSeconds > 0 ? Math.min(1, elapsedSeconds / plannedSeconds) : 0;
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isActive = isRunning || isPaused;
  const ballTarget =
    isRunning || isPaused || status === 'ended' ? phaseInfo.nextPosition : 'bottom';

  useEffect(() => {
    setRecords(getStoredSessions());
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

  function speakGuidance(text) {
    if (!('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.72;
    utterance.pitch = 0.92;
    utterance.volume = 0.72;
    window.speechSynthesis.speak(utterance);
  }

  function startSession() {
    const now = new Date();
    window.speechSynthesis?.cancel();
    setStartedAt(now.toISOString());
    setElapsedSeconds(0);
    setFeedbackOpen(false);
    setPendingRecord(null);
    setNote('');
    setFeeling(FEELINGS[0]);
    setStatus('running');
    startedAtMsRef.current = Date.now();
    accumulatedSecondsRef.current = 0;
    lastSpokenPhaseRef.current = null;
  }

  function pauseSession() {
    accumulatedSecondsRef.current = elapsedSeconds;
    setStatus('paused');
    window.speechSynthesis?.pause();
  }

  function resumeSession() {
    startedAtMsRef.current = Date.now();
    setStatus('running');
    window.speechSynthesis?.resume();
  }

  function finishSession(completed = false, forcedElapsed = elapsedSeconds) {
    if (status === 'idle' && !startedAt) {
      return;
    }

    const finalElapsed = Math.min(plannedSeconds, Math.max(0, Math.floor(forcedElapsed)));
    const endedAt = new Date().toISOString();
    const finalCycles = Math.floor(finalElapsed / CYCLE_SECONDS);
    const baseRecord = buildSessionRecord({
      startedAt: startedAt ?? endedAt,
      endedAt,
      plannedSeconds,
      elapsedSeconds: finalElapsed,
      completed,
      cyclesCompleted: finalCycles,
    });

    window.speechSynthesis?.cancel();
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
  }

  return (
    <main className="app-shell">
      <section className="breathing-stage" aria-label="4-4-6-2 呼吸訓練">
        <div className="forest-layer layer-back" />
        <div className="forest-layer layer-mid" />
        <div className="forest-layer layer-front" />

        <div className="top-bar">
          <div>
            <p className="eyebrow">4-4-6-2 呼吸訓練</p>
            <h1>穩定呼吸</h1>
          </div>
          <label className="voice-toggle">
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(event) => setVoiceEnabled(event.target.checked)}
            />
            <span>語音</span>
          </label>
        </div>

        <div className="duration-picker" aria-label="選擇練習時間">
          {DURATIONS.map((duration) => (
            <button
              className={plannedSeconds === duration.seconds ? 'selected' : ''}
              disabled={isActive}
              key={duration.seconds}
              onClick={() => setPlannedSeconds(duration.seconds)}
              type="button"
            >
              {duration.label}
            </button>
          ))}
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
          {!isActive && (
            <button className="primary" onClick={startSession} type="button">
              開始
            </button>
          )}
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
            </div>
            <button className="primary full" type="submit">
              儲存紀錄
            </button>
          </form>
        </section>
      )}

      {records.length > 0 && (
        <aside className="history-dock" aria-label="最近練習紀錄">
          <span>最近紀錄</span>
          <strong>{records.length}</strong>
        </aside>
      )}
    </main>
  );
}

export default App;
