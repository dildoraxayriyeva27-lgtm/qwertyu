// ===== Mobil menyu =====
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

// ===== Scroll animatsiya =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      if (e.target.querySelector('.counter')) runCounters(e.target);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Raqam sanagich (36 million) =====
function runCounters(scope) {
  scope.querySelectorAll('.counter').forEach(c => {
    const target = +c.dataset.target;
    let n = 0;
    const timer = setInterval(() => {
      n++;
      c.textContent = n;
      if (n >= target) clearInterval(timer);
    }, 40);
  });
}

// ===== Aktiv menyu havolasi =====
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('nav a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 140) current = s.id; });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
});

// ===== Mini-viktorina =====
const questions = [
  { q: "O'zbek tili necha million odamning ona tili?", a: ["12 million", "36 million", "60 million"], c: 1 },
  { q: "O'zbekiston poytaxti qaysi shahar?", a: ["Samarqand", "Buxoro", "Toshkent"], c: 2 },
  { q: "«Salom» so'zi qanday ma'noni bildiradi?", a: ["Xayr", "Rahmat", "Salomlashish"], c: 2 },
  { q: "«Rahmat» so'zining ma'nosi nima?", a: ["Thank you", "Please", "Sorry"], c: 0 },
  { q: "Hozirgi o'zbek yozuvi asosan qaysi alifboga asoslangan?", a: ["Lotin", "Arab", "Yunon"], c: 0 }
];

let idx = 0, score = 0, locked = false;
const qText = document.getElementById('qText');
const answers = document.getElementById('answers');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const qCount = document.getElementById('qCount');
const qScore = document.getElementById('qScore');

function loadQuestion() {
  const item = questions[idx];
  locked = false;
  nextBtn.disabled = true;
  feedback.textContent = '';
  qCount.textContent = `${idx + 1} / ${questions.length}`;
  qScore.textContent = `Ball: ${score}`;
  qText.textContent = item.q;
  answers.innerHTML = '';
  item.a.forEach((text, i) => {
    const b = document.createElement('button');
    b.textContent = text;
    b.addEventListener('click', () => choose(i, b));
    answers.appendChild(b);
  });
  nextBtn.textContent = idx === questions.length - 1 ? 'Natijani ko\'rish' : 'Keyingisi →';
}

function choose(i, btn) {
  if (locked) return;
  locked = true;
  const right = questions[idx].c;
  const buttons = answers.querySelectorAll('button');
  if (i === right) {
    btn.classList.add('correct');
    feedback.textContent = "✅ To'g'ri!";
    score++;
  } else {
    btn.classList.add('wrong');
    buttons[right].classList.add('correct');
    feedback.textContent = "❌ Noto'g'ri javob.";
  }
  buttons.forEach(b => b.disabled = true);
  qScore.textContent = `Ball: ${score}`;
  nextBtn.disabled = false;
}

nextBtn.addEventListener('click', () => {
  if (nextBtn.dataset.restart) {
    idx = 0; score = 0;
    delete nextBtn.dataset.restart;
    loadQuestion();
    return;
  }
  idx++;
  if (idx < questions.length) {
    loadQuestion();
  } else {
    qText.textContent = `🎉 Natija: ${score} / ${questions.length}`;
    answers.innerHTML = '';
    feedback.textContent = score >= 4 ? "Ajoyib! Siz o'zbek tilini yaxshi bilasiz!" : "Yaxshi urinish! Yana bir bor urinib ko'ring.";
    nextBtn.textContent = 'Qayta boshlash ↺';
    nextBtn.dataset.restart = '1';
    nextBtn.disabled = false;
  }
});

loadQuestion();