// initalize some useful variables
const QUIZ_TIME = 15;  // how long the quiz lasts, in seconds
const QUIZ_PENALTY = 10; // how many seconds to subtract for an incorrect answer

const quizQuestionsData = [
  {
    question: 'This is the first question.',
    answers: [
      { answer: 'answer 1.1', id: 1 },
      { answer: 'answer 1.2', id: 2 },
      { answer: 'answer 1.3', id: 3 },
      { answer: 'answer 1.4', id: 4 },
    ],
    correctId: 3
  },
  {
    question: 'This is the second question.',
    answers: [
      { answer: 'answer 2.1', id: 1 },
      { answer: 'answer 2.2', id: 2 },
      { answer: 'answer 2.3', id: 3 },
      { answer: 'answer 2.4', id: 4 },
    ],
    correctId: 2
  },
];

// global variables
var highScores = [];
var quizTimer = 0;
var questionNumber = 0;
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
    endQuiz(quizTimer);
  }
};

var endQuiz = function(score) {
  clearInterval(tick);

  quizEl.classList.add('hidden');
  quizDoneEl.classList.remove('hidden');
  document.querySelector('#final-score').textContent = score;

  if (score) {
    saveScoreEl.classList.remove('hidden');
  } else {
    document.querySelector('#no-score').classList.remove('hidden');
  }
  console.log('done');
  console.log('score: ', score);
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
  console.log('starting quiz');

  // hide the welcome message
  welcomeEl.classList.add('hidden');

  questionNumber = 0;
  // start the countdown timer
  quizTimer = QUIZ_TIME;
  updateQuizTimerEl();
  tick = setInterval(function() {
    if (quizTimer > 0) {
      quizTimer--;
      console.log('tick');
    } else {
      endQuiz(0);
    }
    updateQuizTimerEl();
  }, 1000);

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
  var score = document.querySelector('#final-score').textContent;

  addHighScore(initials, score);
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


// start the app
initQuiz();


// 1) welcome user (display welcome screen)
//     a) load high scores array from local storage
// 2) if start button is clicked, start the quiz
//     a) reset time counter to max time (75 seconds)
//     b) start countdown interval to decrement counter
//     c) enter quiz loop
// 3) quiz loop: loop over quiz questions
//     a) present question
//     b) present buttons for multiple choice answers
//     c) capture the user's answer and compare it to the correct answer
//     d) if incorrect
//          - subtract 10 seconds from time counter
//     e) jump to next question
//     f) flash result of previous answer below question for ~1 second
// 4) when no more questions or time counter reaches 0, end quiz
//     a) capture and display score (counter value)
//     b) flash result of previous answer below "all done"/score
//     c) if score > 0, prompt user for initials
//     d) when initials are entered
//          - save score in high scores array
//          - save high scores array in local storage
//          - show high scores
// 5) show high scores
//     a) display high scores, sorted by score
//     b) include a "go back" button, leading to the welcome screen
//     c) include a "clear high scores" button, which empties the high scores array and clears it from local storage
