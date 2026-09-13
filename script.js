// متغيرات اللعبة
let currentDifficulty = 'medium';
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let skippedAnswers = 0;
let timeLeft = 30;
let timerInterval = null;
let selectedAnswer = null;

// عناصر DOM
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const resultsScreen = document.getElementById('resultsScreen');

const startBtn = document.getElementById('startBtn');
const retryBtn = document.getElementById('retryBtn');
const homeBtn = document.getElementById('homeBtn');
const nextBtn = document.getElementById('nextBtn');
const skipBtn = document.getElementById('skipBtn');
const themeBtn = document.getElementById('themeBtn');

const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('optionsContainer');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const currentQuestionEl = document.getElementById('currentQuestion');
const totalQuestionsEl = document.getElementById('totalQuestions');

const finalScoreEl = document.getElementById('finalScore');
const scoreMessageEl = document.getElementById('scoreMessage');
const correctAnswersEl = document.getElementById('correctAnswers');
const wrongAnswersEl = document.getElementById('wrongAnswers');
const skippedAnswersEl = document.getElementById('skippedAnswers');

// أحداث الزر الرئيسي
startBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', () => {
    resetGame();
    startGame();
});
homeBtn.addEventListener('click', goHome);
nextBtn.addEventListener('click', nextQuestion);
skipBtn.addEventListener('click', skipQuestion);
themeBtn.addEventListener('click', toggleTheme);

// اختيار المستوى
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        e.target.closest('.difficulty-btn').classList.add('active');
        currentDifficulty = e.target.closest('.difficulty-btn').dataset.level;
    });
});

// تبديل الوضع الليلي
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// تحميل الوضع المحفوظ
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// بدء اللعبة
function startGame() {
    resetGame();
    currentQuestions = getRandomQuestions(currentDifficulty, 10);
    totalQuestionsEl.textContent = currentQuestions.length;
    
    showScreen(gameScreen);
    loadQuestion();
}

// تحميل السؤال
function loadQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        endGame();
        return;
    }

    const question = currentQuestions[currentQuestionIndex];
    currentQuestionEl.textContent = currentQuestionIndex + 1;
    questionEl.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    selectedAnswer = null;
    nextBtn.disabled = true;
    timeLeft = 30;
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });

    startTimer();
}

// اختيار الإجابة
function selectAnswer(index, buttonEl) {
    if (selectedAnswer !== null) return;
    
    selectedAnswer = index;
    const correctIndex = currentQuestions[currentQuestionIndex].correct;
    const allButtons = document.querySelectorAll('.option-btn');
    
    allButtons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === correctIndex) {
            btn.classList.add('correct');
        } else if (i === selectedAnswer && selectedAnswer !== correctIndex) {
            btn.classList.add('wrong');
        }
    });

    if (selectedAnswer === correctIndex) {
        correctAnswers++;
        score += 10;
    } else {
        wrongAnswers++;
        score -= 5;
    }

    scoreEl.textContent = Math.max(0, score);
    nextBtn.disabled = false;
    clearInterval(timerInterval);
}

// السؤال التالي
function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

// تجاوز السؤال
function skipQuestion() {
    skippedAnswers++;
    currentQuestionIndex++;
    loadQuestion();
}

// العداد الزمني
function startTimer() {
    timerEl.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (selectedAnswer === null) {
                skippedAnswers++;
            }
            nextQuestion();
        }
    }, 1000);
}

// نهاية اللعبة
function endGame() {
    clearInterval(timerInterval);
    
    finalScoreEl.textContent = Math.max(0, score);
    correctAnswersEl.textContent = correctAnswers;
    wrongAnswersEl.textContent = wrongAnswers;
    skippedAnswersEl.textContent = skippedAnswers;
    
    const scorePercentage = Math.max(0, score);
    let message = '';
    
    if (scorePercentage >= 80) {
        message = '🌟 عبقري! أنت متفوق جداً!';
    } else if (scorePercentage >= 60) {
        message = '🎯 ممتاز! أداء رائع!';
    } else if (scorePercentage >= 40) {
        message = '👍 جيد! حاول مرة أخرى!';
    } else {
        message = '💪 لا تستسلم! حاول بمستوى أسهل!';
    }
    
    scoreMessageEl.textContent = message;
    showScreen(resultsScreen);
}

// إعادة تعيين اللعبة
function resetGame() {
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    skippedAnswers = 0;
    selectedAnswer = null;
    scoreEl.textContent = '0';
    clearInterval(timerInterval);
}

// العودة للرئيسية
function goHome() {
    resetGame();
    showScreen(startScreen);
}

// عرض الشاشة
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// تأثيرات صوتية (اختياري)
function playSound(type) {
    // يمكن إضافة أصوات هنا لاحقاً
}

// حفظ النتائج في localStorage
function saveResult() {
    const results = JSON.parse(localStorage.getItem('arichResults') || '[]');
    results.push({
        difficulty: currentDifficulty,
        score: Math.max(0, score),
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        skippedAnswers: skippedAnswers,
        date: new Date().toLocaleDateString('ar-EG')
    });
    localStorage.setItem('arichResults', JSON.stringify(results));
}

// تهيئة اللعبة
document.addEventListener('DOMContentLoaded', () => {
    // اختيار المستوى الافتراضي
    const mediumBtn = document.querySelector('[data-level="medium"]');
    if (mediumBtn) {
        mediumBtn.classList.add('active');
    }
});

// ربط دالة حفظ النتائج بنهاية اللعبة
const originalEndGame = endGame;
window.endGame = function() {
    saveResult();
    originalEndGame();
};
