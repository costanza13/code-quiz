// questions array
const quizQuestionsData = [
  {
    question: 'What typeof value does the JavaScript function confirm() return?',
    answers: [
      { answer: 'string', id: 1 },
      { answer: 'number', id: 2 },
      { answer: 'boolean', id: 3 },
      { answer: 'undefined', id: 4 },
    ],
    correctId: 3
  },
  {
    question: 'Which can you use to determine the type of a variable?',
    answers: [
      { answer: 'getType(var)', id: 1 },
      { answer: 'typeof var', id: 2 },
      { answer: 'var.type()', id: 3 },
      { answer: 'var.className', id: 4 },
    ],
    correctId: 2
  },
  {
    question: 'How is a JavaScript function declared?',
    answers: [
      { answer: 'function myFunc()', id: 1 },
      { answer: 'var myFunc = function()', id: 2 },
      { answer: 'both of the above', id: 3 },
      { answer: 'none of the above', id: 4 },
    ],
    correctId: 3
  },
  {
    question: 'How can you output messages to the console?',
    answers: [
      { answer: 'console.print(msg)', id: 1 },
      { answer: 'echo msg', id: 2 },
      { answer: 'msg.console()', id: 3 },
      { answer: 'console.log(msg)', id: 4 },
    ],
    correctId: 4
  },
  {
    question: 'Which of the following is <em>not</em> a valid JavaScript loop?',
    answers: [
      { answer: 'for (i = 0; i < 5; i++)', id: 1 },
      { answer: 'while (i < 5)', id: 2 },
      { answer: 'loop (i [0...4])', id: 3 },
      { answer: 'array.forEach(myFunc)', id: 4 },
    ],
    correctId: 3
  },
];
// initalize some useful constants
const QUIZ_QUESTION_COUNT = quizQuestionsData.length;
const TIME_PER_QUESTION = 15;  // time in seconds
const QUIZ_TIME = QUIZ_QUESTION_COUNT * TIME_PER_QUESTION;  // how long the quiz lasts, in seconds
const QUIZ_PENALTY = TIME_PER_QUESTION; // how many seconds to subtract for an incorrect answer


// global variables
var highScores = [];
var quizTimer = 0;
var questionNumber = 0;
var numCorrect = 0;
var questionsElementsArray = [];
var tick;  // for quiz timer interval
var resultTimer;  // for question result message timeout


// pre-built page elements
var topBarEl = document.querySelector('#top-bar');
var viewHighScoresEl = document.querySelector('#view-high-scores');
var quizTimerEl = document.querySelector('#quiz-timer');
var welcomeEl = document.querySelector('#welcome');
var startQuizEl = document.querySelector('#start-quiz');
var quizEl = document.querySelector('#quiz');
var quizDoneEl = document.querySelector('#quiz-done');
var highScoresEl = document.querySelector('#high-scores');
var saveScoreEl = document.querySelector('#save-score');
var resultEl = document.querySelector('#result');
var goBackButtonEl = document.querySelector('#go-back');
var tryAgainButtonEl = document.querySelector('#try-again');
var clearHighScoresButtonEl = document.querySelector('#clear-high-scores');

var initQuiz = function() {
  topBarEl.classList.remove('hidden');
  welcomeEl.classList.remove('hidden');
  quizEl.classList.add('hidden');
  quizDoneEl.classList.add('hidden');
  highScoresEl.classList.add('hidden');
  saveScoreEl.classList.add('hidden');
  resultEl.classList.add('hidden');
  document.querySelector('#no-score').classList.add('hidden');

  loadHighScores();  // might not need this one
  quizTimer = 0;
  questionNumber = 0;
  numCorrect = 0;
  updateQuizTimerEl();
  createQuestionsArray();
};

var loadHighScores = function() {
  var highScoresJSON = localStorage.getItem('highScores');
  if (!highScoresJSON) {
    return;  // do nothing
  }
  highScores = JSON.parse(highScoresJSON);
  highScores.sort((a, b) => {
    return b.score - a.score;
  });
};

var addHighScore = function(initials, score) {
  highScores.push({
    initials: initials,
    score: score
  });
  localStorage.setItem('highScores', JSON.stringify(highScores));
};

var clearHighScores = function() {
  highScores = [];
  localStorage.setItem('highScores', JSON.stringify(highScores));
}

var updateQuizTimerEl = function() {
  quizTimerEl.textContent = quizTimer;
};

var createQuestionsArray = function() {
  questionsElementsArray = [];

  // for each question
  for (var i = 0; i < quizQuestionsData.length; i++) {
    // create an element to encapsulate the question and associated answer buttons
    var questionBlockEl = document.createElement('div');
    questionBlockEl.className = 'question-block';

    // add the question
    var questionEL = document.createElement('p');
    questionEL.className = 'question';
    questionEL.setAttribute('data-question-id', i);
    questionEL.textContent = quizQuestionsData[i].question;
    questionBlockEl.appendChild(questionEL);

    // add the answers
    var answersEl = createAnswerButtonsEl(quizQuestionsData[i].answers);
    questionBlockEl.appendChild(answersEl);

    // add the question element to the question elements array
    questionsElementsArray.push(questionBlockEl);
  }
};

var createAnswerButtonsEl = function(answers) {
  var answersEl = document.createElement('div');
  for (var i = 0; i < 4; i++) {
    var answerButtonEl = document.createElement('button');
    answerButtonEl.className = 'btn answer-btn';
    answerButtonEl.setAttribute('data-answer-id', answers[i].id);
    answerButtonEl.textContent = (i + 1) + '. ' + answers[i].answer;
    answersEl.appendChild(answerButtonEl);
  }

  answersEl.addEventListener('click', answerButtonHandler);

  return answersEl;
};

var showNextQuestion = function() {
  var oldQuestion = document.querySelector('.question-block');
  if (oldQuestion) {
    oldQuestion.remove();
  }
  if (questionNumber < questionsElementsArray.length) {
    // display question and answer buttons
    quizEl.appendChild(questionsElementsArray[questionNumber]);
  } else {
    endQuiz();
  }

  // to prevent lingering hover on touchscreens
  resultEl.focus({preventScroll:true});
};

var endQuiz = function() {
  // calculate final score based on number of correct answers
  var finalScore = (numCorrect / questionsElementsArray.length) * 100;

  clearInterval(tick);

  quizEl.classList.add('hidden');
  quizDoneEl.classList.remove('hidden');
  document.querySelector('#final-score').textContent = finalScore;

  if (finalScore) {
    saveScoreEl.classList.remove('hidden');
  } else {
    document.querySelector('#no-score').classList.remove('hidden');
  }
};

var showHighScores = function() {
  loadHighScores();

  // build high scores ul
  var oldHighScoresListEl = document.querySelector('#scores-list');
  var newHighScoresListEl = document.createElement('ul');
  newHighScoresListEl.setAttribute('id', 'scores-list');
  for (var i = 0; i < highScores.length; i++) {
    var highScoresListItemEl = document.createElement('li');
    highScoresListItemEl.className = 'high-scores-item';
    highScoresListItemEl.textContent = (i + 1) + '. ' + highScores[i].initials + ' - ' + highScores[i].score;
    newHighScoresListEl.appendChild(highScoresListItemEl);
  }
  highScoresEl.replaceChild(newHighScoresListEl, oldHighScoresListEl);


  // make sure everything else is hidden
  topBarEl.classList.add('hidden');
  welcomeEl.classList.add('hidden');
  quizEl.classList.add('hidden');
  quizDoneEl.classList.add('hidden');
  highScoresEl.classList.remove('hidden');
  saveScoreEl.classList.add('hidden');
  resultEl.classList.add('hidden');
};


/*** event handlers ***/

var startQuizHandler = function(event) {
  // hide the welcome message
  welcomeEl.classList.add('hidden');

  questionNumber = 0;
  // start the countdown timer
  quizTimer = QUIZ_TIME;
  updateQuizTimerEl();
  // tick = setInterval(function() {
  //   if (quizTimer > 0) {
  //     quizTimer--;
  //   } else {
  //     endQuiz();
  //   }
  //   updateQuizTimerEl();
  // }, 1000);

  // enter the quiz questions "loop"
  showNextQuestion();

  // and show the quiz
  quizEl.classList.remove('hidden');
};

var answerButtonHandler = function(event) {
  // capture answer
  var answerId = parseInt(event.target.getAttribute('data-answer-id'));
  var questionId = parseInt(document.querySelector('.question').getAttribute('data-question-id'));
  console.log('question', questionId, 'answer', answerId, 'correct answer', quizQuestionsData[questionNumber].correctId);

  // compare it with correct answer
  // display the result of the previous question and update timer if incorrect
  if (answerId === quizQuestionsData[questionNumber].correctId) {
    resultEl.textContent = 'Correct!';
    numCorrect++;
  } else {
    resultEl.textContent = 'Wrong!';
    quizTimer -= QUIZ_PENALTY;
    if (quizTimer < 0) {
      quizTimer = 0;
    }
    updateQuizTimerEl();
  }
  resultEl.classList.remove('hidden');
  clearTimeout(resultTimer);
  resultTimer = setTimeout(function() {
    resultEl.classList.add('hidden');
    resultEl.textContent = '';
  }, 1000);
    
  questionNumber++;
  showNextQuestion();
};

var viewHighScoresHandler = function(event) {
  showHighScores()
};

var saveHighScoreHandler = function(event) {
  if (event.target.getAttribute('id') !== 'initials-submit') {
    return;
  }
  var initials = this.querySelector('#save-score-input').value;
  this.querySelector('#save-score-input').value = '';
  var finalScore = document.querySelector('#final-score').textContent;

  addHighScore(initials, finalScore);
  showHighScores();
};

var clearHighScoresHandler = function(event) {
  clearHighScores();
  showHighScores();
};

// event listeners
viewHighScoresEl.addEventListener('click', viewHighScoresHandler);
startQuizEl.addEventListener('click', startQuizHandler);
saveScoreEl.addEventListener('click', saveHighScoreHandler);
clearHighScoresButtonEl.addEventListener('click', clearHighScoresHandler);
goBackButtonEl.addEventListener('click', initQuiz);
tryAgainButtonEl.addEventListener('click', initQuiz);


// start the app on load
initQuiz();
