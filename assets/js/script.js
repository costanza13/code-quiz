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

var highScores = [];
var quizTimer = 0;
var previousResult = 'na';
var questionNumber = 0;
var questionsElementsArray = [];
var tick;
var mainContentEl = document.querySelector('#main-content');
var resultEl = document.querySelector('#result');
var welcomeEl = document.querySelector('#welcome');
var viewHighScoresEl = document.querySelector('#view-high-scores');
var startQuizEl = document.querySelector('#start-quiz');
var quizTimerEl = document.querySelector('#quiz-timer');

var initQuiz = function() {
  loadHighScores();
  quizTimer = 0;
  updateQuizTimerEl();
  createQuestionsArray();
}

var loadHighScores = function() {
  var highScoresJSON = localStorage.getItem('highScores');
  if (!highScoresJSON) {
    return;  // do nothing
  }
  highScores = JSON.parse(highScoresJSON);
}

var updateQuizTimerEl = function() {
  quizTimerEl.textContent = quizTimer;
}

var createQuestionsArray = function() {
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
}

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
}

var viewHighScoresHandler = function(event) {
  console.log('highScores', highScores);
}

var startQuizHandler = function(event) {
  console.log('starting quiz');

  // hide the welcome message
  welcomeEl.remove();

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

  // enter the quiz questions loop
  showNextQuestion();
}

var showNextQuestion = function() {
  if (questionNumber > 0) {
    document.querySelector('.question-block').remove();
  }
  if (questionNumber < questionsElementsArray.length) {
    // display question and answer buttons
    mainContentEl.appendChild(questionsElementsArray[questionNumber]);
  } else {
    endQuiz(quizTimer);
  }
}

var answerButtonHandler = function(event) {
  var resultTimer;

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
  clearTimeout(resultTimer);
  resultTimer = setTimeout(function() {
    resultEl.textContent = '';
  }, 1000);
    
  questionNumber++;
  showNextQuestion();

}

var endQuiz = function(score) {
  clearInterval(tick);

  if (score) {
    console.log('enter high score');
  } else {
    console.log('try again');
  }
  console.log('done');
  console.log('score: ', score);
}


// event listeners
viewHighScoresEl.addEventListener("click", viewHighScoresHandler);
startQuizEl.addEventListener("click", startQuizHandler);


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
