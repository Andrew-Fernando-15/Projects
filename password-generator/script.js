// ── State ──
let currentType = 'standard';
let currentMode = 'easy';
let digitCount  = 6;

// ── Word lists for passphrase ──
const WORDS = [
  'apple','river','stone','cloud','flame','arrow','sword','dream','night','bloom',
  'frost','tiger','eagle','ocean','spark','brave','quick','lucky','shade','grain',
  'cliff','flint','storm','dusk','dawn','pine','silk','iron','gold','bolt',
  'crystal','desert','forest','garden','harbor','island','jungle','keystone','lantern','mirror'
];

// ── DOM refs ──
const infoBtn         = document.getElementById('infoBtn');
const tooltip         = document.getElementById('tooltip');
const typeButtons     = document.querySelectorAll('.type-btn');
const digitSection    = document.getElementById('digitSection');
const digitSlider     = document.getElementById('digitSlider');
const digitCountEl    = document.getElementById('digitCount');
const modeSection     = document.getElementById('modeSection');
const modeButtons     = document.querySelectorAll('.mode-btn');
const modeFill        = document.getElementById('modeFill');
const badges          = document.querySelectorAll('.badge');
const generateBtn     = document.getElementById('generateBtn');
const overlay         = document.getElementById('overlay');
const suggestions     = document.getElementById('suggestions');
const generateAgainBtn = document.getElementById('generateAgainBtn');
const phraseInput     = document.getElementById('phraseInput');

// ── Tooltip (10s auto-hide) ──
let tooltipTimer = null;
infoBtn.addEventListener('click', () => {
  tooltip.classList.add('visible');
  clearTimeout(tooltipTimer);
  tooltipTimer = setTimeout(() => tooltip.classList.remove('visible'), 10000);
});
document.addEventListener('click', (e) => {
  if (e.target !== infoBtn) tooltip.classList.remove('visible');
});

// ── Password Type ──
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.type;

    if (currentType === 'numbers') {
      digitSection.classList.remove('hidden');
      modeSection.classList.add('disabled');
    } else {
      digitSection.classList.add('hidden');
      modeSection.classList.remove('disabled');
    }
  });
});

// ── Digit Slider ──
digitSlider.addEventListener('input', () => {
  digitCount = parseInt(digitSlider.value);
  digitCountEl.textContent = digitCount;
});

// ── Mode Selector ──
function setMode(mode) {
  currentMode = mode;
  modeButtons.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));

  const idx = ['easy','balanced','strong','passphrase'].indexOf(mode);
  modeFill.style.left  = `calc(${idx * 25}% + 4px)`;
  modeFill.style.width = 'calc(25% - 8px)';
}
setMode('easy');

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => setMode(btn.dataset.mode));
});

badges.forEach(badge => {
  badge.addEventListener('click', () => {
    const map = { 'badge-easy':'easy','badge-balanced':'balanced','badge-strong':'strong','badge-passphrase':'passphrase' };
    for (const [cls, mode] of Object.entries(map)) {
      if (badge.classList.contains(cls)) setMode(mode);
    }
  });
});

// ── Password Generation ──
function randomChar(chars) {
  return chars[Math.floor(Math.random() * chars.length)];
}

function generatePassword() {
  const phrase = phraseInput.value.trim();
  if (currentType === 'numbers') return generateNumeric(digitCount);
  if (currentType === 'letters') return generateLetters(phrase);
  return generateStandard(phrase, currentMode);
}

function generateNumeric(length) {
  let result = '';
  for (let i = 0; i < length; i++) result += Math.floor(Math.random() * 10);
  return result;
}

function generateLetters(phrase) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  let base = '';
  if (phrase) base = phrase.replace(/[^a-zA-Z]/g, '');
  const targetLen = 8 + Math.floor(Math.random() * 5);
  let result = '';
  for (let i = 0; i < base.length && result.length < targetLen; i++) {
    result += Math.random() > 0.5 ? base[i].toUpperCase() : base[i].toLowerCase();
  }
  while (result.length < targetLen) {
    result += Math.random() > 0.5 ? randomChar(upper) : randomChar(lower);
  }
  return shuffle(result);
}

function generateStandard(phrase, mode) {
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower   = 'abcdefghijklmnopqrstuvwxyz';
  const digits  = '0123456789';
  const symbols = { easy: '!@#', balanced: '!@#$%&', strong: '!@#$%^&*()-_+=<>?' };

  if (mode === 'passphrase') {
    const count = 3 + Math.floor(Math.random() * 2);
    const picked = [];
    for (let i = 0; i < count; i++) {
      picked.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    picked[0] = picked[0][0].toUpperCase() + picked[0].slice(1);
    return picked.join('-') + Math.floor(Math.random() * 90 + 10) + '!';
  }

  const symSet  = symbols[mode] || symbols.easy;
  const targetLen = mode === 'strong' ? 12 : (8 + Math.floor(Math.random() * 3));
  let base = '';

  if (phrase) {
    const cleaned = phrase.replace(/\s+/g, '');
    for (let i = 0; i < cleaned.length && base.length < targetLen - 3; i++) {
      const c = cleaned[i];
      base += Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase();
    }
  }

  let result = base;
  result += randomChar(upper);
  result += randomChar(digits);
  result += randomChar(symSet);

  const all = lower + upper + digits + symSet;
  while (result.length < targetLen) result += randomChar(all);

  return shuffle(result).slice(0, targetLen);
}

function shuffle(str) {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

// ── Show Popup ──
function buildSuggestions() {
  suggestions.innerHTML = '';
  const passwords = [generatePassword(), generatePassword(), generatePassword()];
  passwords.forEach(pw => {
    const box = document.createElement('div');
    box.className = 'suggestion-box';

    const pwEl = document.createElement('span');
    pwEl.className = 'suggestion-password';
    pwEl.textContent = pw;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(pw).then(() => {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });

    box.appendChild(pwEl);
    box.appendChild(copyBtn);
    suggestions.appendChild(box);
  });
}

generateBtn.addEventListener('click', () => {
  buildSuggestions();
  overlay.classList.remove('hidden');
});

generateAgainBtn.addEventListener('click', buildSuggestions);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.add('hidden');
});

const BG_IMAGES = ['bg-1.jfif', 'bg-2.jfif', 'bg-3.webp'];
let bgIndex = 0;
let activeBg = 1;

const bgLayer1 = document.getElementById('bgLayer1');
const bgLayer2 = document.getElementById('bgLayer2');

bgLayer1.style.backgroundImage = `url('${BG_IMAGES[0]}')`;
bgLayer1.style.opacity = '1';
bgLayer2.style.opacity = '0';

function rotateBg() {
  bgIndex = (bgIndex + 1) % BG_IMAGES.length;
  const incoming = activeBg === 1 ? bgLayer2 : bgLayer1;
  const outgoing  = activeBg === 1 ? bgLayer1 : bgLayer2;

  incoming.style.backgroundImage = `url('${BG_IMAGES[bgIndex]}')`;
  incoming.style.opacity = '1';
  outgoing.style.opacity = '0';

  activeBg = activeBg === 1 ? 2 : 1;
}

setInterval(rotateBg, 8000); // change 8000 to however many milliseconds you want
