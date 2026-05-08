// ============================================================
//  SMART ENGLISH HANDBOOK 5 - Main Application
//  Refactored with proper structure and error handling
// ============================================================

// Application State Management
const AppState = (() => {
  let state = {
    vocab: { unit: 1 },
    structures: { unit: 1 },
    quiz: { pool: [], idx: 0, score: 0 },
    match: { selected: null, pairs: [], count: 0 },
    scramble: { pool: [], idx: 0, score: 0 },
    flashcard: { pool: [], idx: 0, flipped: false },
    chat: { history: [] },
    user: { name: localStorage.getItem('user_name') || '' }
  };

  return {
    get: (path) => path.split('.').reduce((o, k) => o?.[k], state),
    set: (path, value) => {
      const keys = path.split('.');
      let obj = state;
      keys.slice(0, -1).forEach(k => obj = obj[k]);
      obj[keys[keys.length - 1]] = value;
    },
    reset: (category) => {
      if (category === 'quiz') state.quiz = { pool: [], idx: 0, score: 0 };
      if (category === 'match') state.match = { selected: null, pairs: [], count: 0 };
      if (category === 'scramble') state.scramble = { pool: [], idx: 0, score: 0 };
      if (category === 'flashcard') state.flashcard = { pool: [], idx: 0, flipped: false };
    }
  };
})();

// Progress Tracking
const ProgressTracker = (() => {
  const STORAGE_KEY = 'english_handbook_progress';

  return {
    save: (gameType, score, total) => {
      try {
        const progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        progress[gameType] = {
          score,
          total,
          date: new Date().toISOString(),
          percentage: Math.round(score / total * 100)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        renderProgressDashboard();
      } catch (e) {
        console.error('Progress save error:', e);
      }
    },

    getStats: () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      } catch (e) {
        console.error('Progress read error:', e);
        return {};
      }
    }
  };
})();

function renderProgressDashboard() {
  const dashboard = document.getElementById('progress-dashboard');
  if (!dashboard) return;
  
  const stats = ProgressTracker.getStats();
  const games = [
    { id: 'quiz', name: 'Quiz', emoji: '❓' },
    { id: 'matching', name: 'Nối từ', emoji: '🔗' },
    { id: 'scramble', name: 'Sắp xếp', emoji: '🔀' }
  ];

  dashboard.innerHTML = games.map(g => {
    const s = stats[g.id] || { score: 0, total: 0, percentage: 0 };
    return `
      <div class="stat-card">
        <div class="stat-emoji">${g.emoji}</div>
        <div class="stat-info"><b>${g.name}</b>: ${s.score}/${s.total} (${s.percentage}%)</div>
      </div>
    `;
  }).join('');
}

// Sound System (Simple Beeps for Demo)
const Sound = (() => {
  const play = (freq, type, duration) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };
  return {
    success: () => { play(523.25, 'sine', 0.5); setTimeout(() => play(659.25, 'sine', 0.5), 100); },
    error: () => { play(150, 'sawtooth', 0.3); },
    click: () => { play(800, 'sine', 0.05); }
  };
})();

function saveUserName() {
  const input = document.getElementById('user-name-input');
  const name = input?.value.trim();
  if (name) {
    localStorage.setItem('user_name', name);
    AppState.set('user.name', name);
    document.getElementById('welcome-modal').style.display = 'none';
    Notification.show(`Chào mừng ${name}! Chúc bạn học vui vẻ!`, 'success');
    Sound.success();
  }
}

function initWelcome() {
  if (!AppState.get('user.name')) {
    document.getElementById('welcome-modal').style.display = 'flex';
  }
}

// Notification System
const Notification = (() => {
  const createNotification = (message, type = 'info') => {
    const existing = document.getElementById('notification');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.id = 'notification';
    div.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'error' ? '#F44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
      color: white;
      border-radius: 8px;
      z-index: 9999;
      font-weight: 600;
      animation: slideIn 0.3s ease;
    `;
    div.textContent = message;
    document.body.appendChild(div);

    setTimeout(() => div.remove(), 3000);
  };

  return { show: createNotification };
})();

// ============================================================
//  UTILITY FUNCTIONS
// ============================================================
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function speak(word) {
  if (!('speechSynthesis' in window)) {
    Notification.show('❌ Trình duyệt không hỗ trợ phát âm', 'error');
    return;
  }
  try {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('Speech error:', e);
  }
}

function sanitizeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================
//  NAVIGATION & TAB SYSTEM
// ============================================================
function initTabs() {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const tabId = 'tab-' + btn.dataset.tab;
      const tab = document.getElementById(tabId);
      if (tab) tab.classList.add('active');
    });
  });
}

function initClassroomMode() {
  const toggle = document.getElementById('classroom-mode-toggle');
  toggle?.addEventListener('click', () => {
    const active = document.body.classList.toggle('classroom-mode');
    Notification.show(active ? '👨‍🏫 Chế độ lớp học: Đã bật' : '🏠 Chế độ cá nhân', 'info');
    Sound.click();
  });
}

function initDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle');
  const isDark = localStorage.getItem('dark-mode') === 'true';
  
  if (isDark) document.body.classList.add('dark-theme');
  
  toggle?.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('dark-mode', dark);
    Notification.show(dark ? '🌙 Chế độ tối' : '☀️ Chế độ sáng', 'info');
  });
}

// ============================================================
//  VOCABULARY MODULE
// ============================================================
const VocabModule = (() => {
  function buildUnits() {
    const container = document.getElementById('vocab-units');
    if (!container) return;

    UNITS.forEach(unit => {
      const btn = document.createElement('button');
      btn.className = 'unit-btn' + (unit.id === 1 ? ' active' : '');
      btn.textContent = unit.name;
      btn.addEventListener('click', () => {
        AppState.set('vocab.unit', unit.id);
        document.querySelectorAll('#vocab-units .unit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderVocab();
      });
      container.appendChild(btn);
    });
    renderVocab();
  }

  function renderVocab() {
    const unitId = AppState.get('vocab.unit');
    const unit = UNITS.find(u => u.id === unitId);
    const grid = document.getElementById('vocab-grid');

    if (!grid || !unit) return;

    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();

    unit.vocab.forEach(vocab => {
      const card = document.createElement('div');
      card.className = 'vocab-card';
      card.style.borderTopColor = unit.color;
      card.innerHTML = `
        <span class="emoji">${sanitizeHtml(vocab.emoji)}</span>
        <div class="word">${sanitizeHtml(vocab.word)}</div>
        <div class="meaning">${sanitizeHtml(vocab.meaning)}</div>
        <button class="speak-btn" aria-label="Nghe phát âm ${vocab.word}">🔊 Nghe</button>
      `;
      card.querySelector('.speak-btn').addEventListener('click', () => speak(vocab.word));
      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  return { init: buildUnits };
})();

// ============================================================
//  STRUCTURES MODULE
// ============================================================
const StructuresModule = (() => {
  function buildUnits() {
    const container = document.getElementById('struct-units');
    if (!container) return;

    UNITS.forEach(unit => {
      const btn = document.createElement('button');
      btn.className = 'unit-btn' + (unit.id === 1 ? ' active' : '');
      btn.style.borderColor = unit.color;
      btn.textContent = unit.name;
      btn.dataset.color = unit.color;

      btn.addEventListener('click', () => {
        AppState.set('structures.unit', unit.id);
        document.querySelectorAll('#struct-units .unit-btn').forEach(b => {
          b.classList.remove('active');
          b.style.background = '#fff';
          b.style.color = b.dataset.color;
        });
        btn.classList.add('active');
        btn.style.background = unit.color;
        btn.style.color = '#fff';
        renderStructures();
      });

      container.appendChild(btn);
    });
    renderStructures();
  }

  function renderStructures() {
    const unitId = AppState.get('structures.unit');
    const unit = UNITS.find(u => u.id === unitId);
    const container = document.getElementById('struct-content');

    if (!container || !unit) return;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    unit.structures.forEach(structure => {
      const card = document.createElement('div');
      card.className = 'structure-card';
      card.style.borderLeftColor = unit.color;

      let examplesHtml = '';
      structure.examples.forEach(([en, vi]) => {
        examplesHtml += `
          <li>
            <span class="en">🔹 ${sanitizeHtml(en)}</span><br>
            <span class="vi">&nbsp;&nbsp;&nbsp;→ ${sanitizeHtml(vi)}</span>
          </li>
        `;
      });

      card.innerHTML = `
        <h3>${sanitizeHtml(structure.title)}</h3>
        <div class="structure-formula">${sanitizeHtml(structure.formula)}</div>
        <ul class="structure-examples">${examplesHtml}</ul>
      `;

      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  }

  return { init: buildUnits };
})();

// ============================================================
//  GAMES MODULE
// ============================================================
let allVocab = [];

function initGamesData() {
  allVocab = [];
  UNITS.forEach(unit => {
    unit.vocab.forEach(vocab => {
      allVocab.push({ ...vocab, unit: unit.id });
    });
  });
}

function backToGames() {
  document.querySelectorAll('.game-area').forEach(a => a.classList.remove('active'));
  const menu = document.getElementById('games-menu');
  if (menu) menu.style.display = '';
}

function startGame(type) {
  const menu = document.getElementById('games-menu');
  if (menu) menu.style.display = 'none';

  try {
    if (allVocab.length === 0) {
      Notification.show('⚠️ Không có dữ liệu để chơi game!', 'error');
      backToGames();
      return;
    }
    if (type === 'quiz') initQuiz();
    else if (type === 'matching') initMatching();
    else if (type === 'scramble') initScramble();
    else if (type === 'flashcard') initFlashcard();

    const gameArea = document.getElementById('game-' + type);
    if (gameArea) gameArea.classList.add('active');
  } catch (e) {
    console.error('Game start error:', e);
    Notification.show('❌ Lỗi khi bắt đầu game', 'error');
  }
}

// --- QUIZ GAME ---
function initQuiz() {
  AppState.reset('quiz');
  const quizPool = shuffle([...allVocab]).slice(0, 10);
  AppState.set('quiz.pool', quizPool);
  AppState.set('quiz.idx', 0);
  AppState.set('quiz.score', 0);

  const totalEl = document.getElementById('quiz-total');
  const scoreEl = document.getElementById('quiz-score');
  if (totalEl) totalEl.textContent = quizPool.length;
  if (scoreEl) scoreEl.textContent = 0;

  renderQuiz();
}

function renderQuiz() {
  const body = document.getElementById('quiz-body');
  if (!body) return;

  const quizPool = AppState.get('quiz.pool');
  const quizIdx = AppState.get('quiz.idx');
  const quizScore = AppState.get('quiz.score');

  if (quizIdx >= quizPool.length) {
    const pct = Math.round(quizScore / quizPool.length * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '😊' : '📚';
    const message = pct >= 80 ? 'Xuất sắc! Bạn học rất tốt!' : pct >= 60 ? 'Tốt lắm! Tiếp tục cố gắng nhé!' : 'Hãy ôn lại từ vựng nhé!';

    body.innerHTML = `
      <div class="result-box">
        <div class="big-emoji">${emoji}</div>
        <h2>Kết quả: ${quizScore}/${quizPool.length}</h2>
        <p>${message}</p>
        <button class="btn btn-blue" onclick="initQuiz()">🔄 Chơi lại</button>
      </div>
    `;
    document.getElementById('quiz-progress').style.width = '100%';

    ProgressTracker.save('quiz', quizScore, quizPool.length);
    return;
  }

  const q = quizPool[quizIdx];
  const opts = shuffle([
    q.meaning,
    ...shuffle(allVocab.filter(x => x.word !== q.word)).slice(0, 3).map(x => x.meaning)
  ]);

  document.getElementById('quiz-progress').style.width = (quizIdx / quizPool.length * 100) + '%';

  let optionsHtml = '';
  opts.forEach(opt => {
    optionsHtml += `
      <button class="quiz-opt" data-answer="${sanitizeHtml(opt)}" data-correct="${sanitizeHtml(q.meaning)}">
        ${sanitizeHtml(opt)}
      </button>
    `;
  });

  body.innerHTML = `
    <div class="quiz-question">Từ <strong>"${sanitizeHtml(q.word)}"</strong> ${q.emoji} có nghĩa là gì?</div>
    <div class="quiz-options">${optionsHtml}</div>
  `;

  body.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => answerQuiz(btn));
  });
}

function answerQuiz(btn) {
  const chosen = btn.dataset.answer;
  const correct = btn.dataset.correct;

  document.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);

  if (chosen === correct) {
    btn.classList.add('correct');
    const currentScore = AppState.get('quiz.score');
    AppState.set('quiz.score', currentScore + 1);
    document.getElementById('quiz-score').textContent = currentScore + 1;
    Sound.success();
  } else {
    btn.classList.add('wrong');
    Sound.error();
    document.querySelectorAll('.quiz-opt').forEach(b => {
      if (b.dataset.answer === correct) b.classList.add('correct');
    });
  }

  const currentIdx = AppState.get('quiz.idx');
  AppState.set('quiz.idx', currentIdx + 1);
  setTimeout(renderQuiz, 900);
}

// --- MATCHING GAME ---
function initMatching() {
  AppState.reset('match');
  const matchPairs = shuffle([...allVocab]).slice(0, 6);
  AppState.set('match.pairs', matchPairs);
  AppState.set('match.count', 0);

  const scoreEl = document.getElementById('match-score');
  if (scoreEl) scoreEl.textContent = 0;

  const lefts = shuffle([...matchPairs]);
  const rights = shuffle([...matchPairs]);

  const L = document.getElementById('match-left');
  const R = document.getElementById('match-right');

  if (L) L.innerHTML = '';
  if (R) R.innerHTML = '';

  lefts.forEach(p => {
    const div = document.createElement('div');
    div.className = 'match-item';
    div.dataset.word = p.word;
    div.dataset.side = 'left';
    div.textContent = `${p.emoji} ${p.word}`;
    div.addEventListener('click', () => selectMatch(div));
    L.appendChild(div);
  });

  rights.forEach(p => {
    const div = document.createElement('div');
    div.className = 'match-item';
    div.dataset.word = p.word;
    div.dataset.side = 'right';
    div.textContent = p.meaning;
    div.addEventListener('click', () => selectMatch(div));
    R.appendChild(div);
  });
}

function selectMatch(el) {
  if (el.classList.contains('matched')) return;

  let selected = AppState.get('match.selected');

  if (!selected) {
    AppState.set('match.selected', el);
    el.classList.add('selected');
    return;
  }

  if (selected.dataset.side === el.dataset.side) {
    AppState.set('match.selected', el);
    selected.classList.remove('selected');
    el.classList.add('selected');
    return;
  }

  if (selected.dataset.word === el.dataset.word) {
    [selected, el].forEach(x => {
      x.classList.remove('selected');
      x.classList.add('matched');
    });

    const currentCount = AppState.get('match.count');
    const newCount = currentCount + 1;
    AppState.set('match.count', newCount);
    Sound.success();
    document.getElementById('match-score').textContent = newCount;

    if (newCount === 6) {
      setTimeout(() => {
        alert('🎉 Hoàn thành! Bạn đã khớp đúng tất cả 6 cặp!');
        ProgressTracker.save('matching', 6, 6);
        initMatching();
      }, 300);
    }
  } else {
    [selected, el].forEach(x => x.classList.add('wrong-match'));
    Sound.error();
    setTimeout(() => {
      [selected, el].forEach(x => x.classList.remove('selected', 'wrong-match'));
    }, 700);
  }

  AppState.set('match.selected', null);
}

// --- SCRAMBLE GAME ---
function initScramble() {
  AppState.reset('scramble');
  const scrPool = shuffle([...allVocab.filter(x => x.word.length >= 4 && !x.word.includes(' '))]).slice(0, 8);
  AppState.set('scramble.pool', scrPool);
  AppState.set('scramble.idx', 0);
  AppState.set('scramble.score', 0);

  const scoreEl = document.getElementById('scr-score');
  if (scoreEl) scoreEl.textContent = 0;

  renderScramble();
}

function renderScramble() {
  const body = document.getElementById('scr-body');
  if (!body) return;

  const scrPool = AppState.get('scramble.pool');
  const scrIdx = AppState.get('scramble.idx');
  const scrScore = AppState.get('scramble.score');

  if (scrIdx >= scrPool.length) {
    body.innerHTML = `
      <div class="result-box">
        <div class="big-emoji">🎊</div>
        <h2>Điểm: ${scrScore}/${scrPool.length}</h2>
        <p>${scrScore >= 6 ? 'Giỏi lắm!' : 'Hãy thử lại nhé!'}</p>
        <button class="btn btn-green" onclick="initScramble()">🔄 Chơi lại</button>
      </div>
    `;
    ProgressTracker.save('scramble', scrScore, scrPool.length);
    return;
  }

  const q = scrPool[scrIdx];
  const scr = scrambleWord(q.word);

  body.innerHTML = `
    <p style="font-weight:800;margin-bottom:8px">Câu ${scrIdx + 1}/${scrPool.length} — Gợi ý: ${q.emoji} ${sanitizeHtml(q.meaning)}</p>
    <div class="scramble-word">${scr.toUpperCase()}</div>
    <p class="scramble-hint">Sắp xếp lại các chữ cái để tạo từ đúng</p>
    <input class="scramble-input" id="scr-input" placeholder="Nhập từ..." />
    <div class="btn-row">
      <button class="btn btn-green">✅ Kiểm tra</button>
      <button class="btn btn-back">⏭ Bỏ qua</button>
    </div>
    <div id="scr-feedback" style="margin-top:12px;font-weight:700"></div>
  `;

  const checkBtn = body.querySelector('.btn-green');
  const skipBtn = body.querySelector('.btn-back');
  const inputEl = body.querySelector('#scr-input');

  checkBtn.addEventListener('click', () => checkScramble(q.word));
  skipBtn.addEventListener('click', skipScramble);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkScramble(q.word);
  });

  setTimeout(() => inputEl.focus(), 100);
}

function checkScramble(ans) {
  const inputEl = document.getElementById('scr-input');
  const fbEl = document.getElementById('scr-feedback');
  const val = inputEl?.value.trim().toLowerCase();

  if (val === ans) {
    fbEl.innerHTML = `<span style="color:var(--green)">✅ Đúng rồi! "${ans}"</span>`;
    const currentScore = AppState.get('scramble.score');
    AppState.set('scramble.score', currentScore + 1);
    document.getElementById('scr-score').textContent = currentScore + 1;
    Sound.success();
  } else {
    fbEl.innerHTML = `<span style="color:var(--red)">❌ Sai! Đáp án đúng là: <strong>${ans}</strong></span>`;
    Sound.error();
  }

  const currentIdx = AppState.get('scramble.idx');
  AppState.set('scramble.idx', currentIdx + 1);
  setTimeout(renderScramble, 1200);
}

function skipScramble() {
  const currentIdx = AppState.get('scramble.idx');
  AppState.set('scramble.idx', currentIdx + 1);
  renderScramble();
}

function scrambleWord(word) {
  let arr = word.split('');
  do {
    arr = shuffle(arr);
  } while (arr.join('') === word);
  return arr.join('');
}

// --- FLASHCARD GAME ---
function initFlashcard() {
  AppState.reset('flashcard');
  const fcPool = shuffle([...allVocab]).slice(0, 15);
  AppState.set('flashcard.pool', fcPool);
  AppState.set('flashcard.idx', 0);
  AppState.set('flashcard.flipped', false);

  const totalEl = document.getElementById('fc-total');
  if (totalEl) totalEl.textContent = fcPool.length;

  renderFlashcard();
}

function renderFlashcard() {
  AppState.set('flashcard.flipped', false);
  const fcPool = AppState.get('flashcard.pool');
  const fcIdx = AppState.get('flashcard.idx');

  const idxEl = document.getElementById('fc-idx');
  if (idxEl) idxEl.textContent = fcIdx + 1;

  const q = fcPool[fcIdx];
  const body = document.getElementById('fc-body');

  if (body) {
    body.innerHTML = `
      <div id="fc-card" onclick="flipCard()" style="background:#fff;border-radius:24px;padding:50px 30px;text-align:center;cursor:pointer;box-shadow:0 12px 40px rgba(33,150,243,0.15);transition:all 0.3s;min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-top:6px solid var(--blue)">
        <div style="font-size:3.5rem;margin-bottom:16px">${q.emoji}</div>
        <div style="font-family:'Fredoka One',cursive;font-size:2rem;color:var(--blue)">${sanitizeHtml(q.word)}</div>
        <div style="color:var(--text-soft);margin-top:8px;font-size:0.9rem">👆 Nhấn để xem nghĩa</div>
      </div>
    `;
  }
}

function flipCard() {
  const fcPool = AppState.get('flashcard.pool');
  const fcIdx = AppState.get('flashcard.idx');
  const fcFlipped = AppState.get('flashcard.flipped');
  const q = fcPool[fcIdx];
  const card = document.getElementById('fc-card');

  if (!fcFlipped) {
    card.innerHTML = `
      <div style="font-size:3.5rem;margin-bottom:16px">${q.emoji}</div>
      <div style="font-family:'Fredoka One',cursive;font-size:1.6rem;color:var(--purple)">${sanitizeHtml(q.meaning)}</div>
      <div style="margin-top:12px;font-size:1rem;color:var(--text-soft)">${sanitizeHtml(q.word)}</div>
    `;
    card.style.background = 'var(--purple-light)';
    AppState.set('flashcard.flipped', true);
  } else {
    renderFlashcard();
  }
}

function fcNext() {
  const fcPool = AppState.get('flashcard.pool');
  const fcIdx = AppState.get('flashcard.idx');
  AppState.set('flashcard.idx', (fcIdx + 1) % fcPool.length);
  renderFlashcard();
}

function fcPrev() {
  const fcPool = AppState.get('flashcard.pool');
  const fcIdx = AppState.get('flashcard.idx');
  AppState.set('flashcard.idx', (fcIdx - 1 + fcPool.length) % fcPool.length);
  renderFlashcard();
}

// ============================================================
//  AI CHATBOT MODULE
// ============================================================
function getSystemPrompt() {
  const userName = AppState.get('user.name') || 'học sinh';
  // Tạo danh sách từ vựng chi tiết để AI tham chiếu chính xác
  const vocabContext = typeof UNITS !== 'undefined' 
    ? UNITS.map(u => `Unit ${u.id} (${u.name}): Từ vựng [${u.vocab.map(v => v.word + ' - ' + v.meaning).join(', ')}]`).join('\n')
    : 'Chương trình Tiếng Anh 5';

  return `Bạn là "Gia sư Tiếng Anh" thông minh cho ứng dụng Smart English Handbook 5.
Đang nói chuyện với bạn nhỏ tên là: ${userName}.

NGỮ CẢNH BÀI HỌC TRONG HỆ THỐNG:
${vocabContext}

Quy tắc trả lời:
- Luôn gọi tên học sinh (${userName}) trong câu trả lời để thân thiện.
- Bạn chỉ trả lời các câu hỏi liên quan đến Tiếng Anh và các Unit đã liệt kê ở trên.
- Nếu học sinh hỏi về từ vựng có trong danh sách, hãy dùng đúng nghĩa tiếng Việt được cung cấp.
- Cấu trúc phản hồi: 
  1. Giải thích nghĩa ngắn gọn.
  2. Cho 1 ví dụ cực ngắn (Ví dụ: "I live in a big city.").
  3. Khuyến khích học sinh (Ví dụ: "Bạn thử đặt câu với từ này nhé!").
- Sử dụng ngôn ngữ thân thiện cho trẻ 10 tuổi. Luôn có emoji vui nhộn.
- Các từ tiếng Anh phải được viết hoa hoặc để trong "ngoặc kép".
- KHÔNG trả lời các vấn đề ngoài việc học Tiếng Anh.`;
}

async function callClaude(userMsg) {
  // LƯU Ý: Để chạy thực tế trên trình duyệt, bạn thường gặp lỗi CORS. 
  // Key này nên được quản lý ở Backend. Đây là cấu hình chuẩn cho API.
  const API_KEY = 'YOUR_ACTUAL_CLAUDE_API_KEY'; 

  // Mock response nếu đang dùng key Demo (Tránh lỗi CORS)
  if (API_KEY.includes('DEMO')) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`🌟 Chào bạn! Mình là AI Trợ Lý. Vì đây là phiên bản Demo, mình đang giả lập phản hồi. 
Bạn có thể đặt câu hỏi về các Unit từ 1 đến 10 nhé! Ví dụ: "Nghĩa của từ Address là gì?" 📖✍️`);
      }, 1500);
    });
  }

  try {
    const messages = getChatHistory();
    messages.push({ role: 'user', content: userMsg });

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system: getSystemPrompt(),
        messages: messages.slice(-10)
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || `Lỗi API: ${response.status}`);
    }

    const data = await response.json();

    if (!data.content || !data.content[0]?.text) {
      throw new Error('Invalid response format');
    }

    return data.content[0].text;

  } catch (error) {
    console.error('AI Chat error:', error);
    if (error.message.includes('401')) {
      return '🔑 Lỗi API key. Vui lòng kiểm tra cấu hình.';
    } else if (error.message.includes('Network')) {
      return '🔌 Không kết nối được. Kiểm tra mạng nhé!';
    }
    return '😕 Xin lỗi, AI gặp lỗi. Thử lại nhé!';
  }
}

function getChatHistory() {
  const history = AppState.get('chat.history') || [];
  return history.map(m => ({ role: m.role, content: m.content }));
}

function addMsg(role, text) {
  const history = AppState.get('chat.history') || [];
  history.push({ role, content: text });
  AppState.set('chat.history', history);

  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;

  const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  // Chuyển assistant thành bot để khớp với CSS
  const displayRole = role === 'assistant' ? 'bot' : role;
  div.className = 'msg ' + displayRole;
  div.innerHTML = `
    <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
    <div class="msg-time">${displayRole === 'user' ? 'Bạn' : 'AI Trợ lý'} · ${time}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;

  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typing-indicator';
  div.innerHTML = '<div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() {
  document.getElementById('typing-indicator')?.remove();
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.querySelector('.chat-send');
  const msg = input?.value.trim();

  if (!msg) return Notification.show('Vui lòng nhập câu hỏi', 'info');

  // Khóa giao diện trong khi chờ AI
  input.value = '';
  input.disabled = true;
  if (sendBtn) sendBtn.disabled = true;

  try {
    addMsg('user', msg);
    showTyping();

    const reply = await callClaude(msg);
    addMsg('assistant', reply);
  } catch (e) {
    console.error('Chat error:', e);
    Notification.show('❌ Lỗi chat', 'error');
  } finally {
    hideTyping();
    input.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    input.focus();
  }
}

function sendSuggestion(btn) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = btn.textContent;
    sendChat();
  }
}

// ============================================================
//  INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (typeof UNITS === 'undefined') {
      throw new Error('Dữ liệu UNITS chưa được tải. Hãy đảm bảo file data.js đã được nhúng.');
    }
    initTabs();
    initDarkMode();
    initClassroomMode();
    initWelcome();
    VocabModule.init();
    StructuresModule.init();
    initGamesData();
    renderProgressDashboard();
  } catch (e) {
    console.error('Initialization error:', e);
    Notification.show('❌ Lỗi khởi động ứng dụng', 'error');
  }
});
