// initalize some useful variables
const QUIZ_TIME = 75;  // how long the quiz lasts, in seconds
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
];

var highScores = [];
var quizTimer = 0;
var pageContentEl = document.querySelector('#page-content');
var welcomeEl = document.querySelector('#welcome');
var viewHighScoresEl = document.querySelector('#view-high-scores');
var startQuizEl = document.querySelector('#start-quiz');
var quizTimerEl = document.querySelector('#quiz-timer');

var initQuiz = function() {
  loadHighScores();
  clearQuizTimer();
  createQuestionsArray();
}

var loadHighScores = function() {
  var highScoresJSON = localStorage.getItem('highScores');
  if (!highScoresJSON) {
    return;  // do nothing
  }
  highScores = JSON.parse(highScoresJSON);
}

var clearQuizTimer = function() {
  quizTimer = 0;
  quizTimerEl.textContent = quizTimer;
}

var createQuestionsArray = function() {
  // create an empty question elements array
  var questionsElementsArray = [];
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
    // pageContentEl.appendChild(questionBlockEl);  // temporary to show this part is working
  }
  // return the question elements array
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

  // start the countdown timer
  // enter the quiz loop
}

var answerButtonHandler = function(event) {
  console.log(event.target.getAttribute('data-answer-id'));
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
