// initalize some useful variables
var highScores = [];
var pageContentEl = document.querySelector('#page-content');
var welcomeEl = document.querySelector('#welcome');
var viewHighScoresEl = document.querySelector('#view-high-scores');
var startQuizEl = document.querySelector('#start-quiz');

var loadHighScores = function() {
  var highScoresJSON = localStorage.getItem('highScores');
  if (!highScoresJSON) {
    return;  // do nothing
  }
  highScores = JSON.parse(highScoresJSON);
}

var createAnswerButtons = function() {
  var answersEl = document.createElement('div');
  for (var i = 0; i < 4; i ++) {
    var answerButtonEl = document.createElement('button');
    answerButtonEl.className = 'btn answer-btn';
    answerButtonEl.setAttribute('data-answer-id', i);
    answerButtonEl.textContent = i + '. Answer ' + i;
    answersEl.appendChild(answerButtonEl);
  }
  console.log(answersEl);

  answersEl.addEventListener('click', answerButtonHandler);

  return answersEl;
}

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
// 4) when no more questions or time counter reaches 0, end quiz
//     a) capture score (counter value)
//     b) if score > 0
//          - prompt user for initials
//          - save score in highscores array
//          - save highscores array in local storage
//          - show highscores
// 5) show highscores
//      a) display highscores, sorted by score
//      b) include a "go back" button, leading to the welcome screen
//      c) include a "clear highscores" button, which empties the highscores array and clears it from local storage

var viewHighScoresHandler = function(event) {
  console.log('highScores', highScores);
}

var startQuizHandler = function(event) {
  console.log('starting quiz');
  welcomeEl.remove();
  pageContentEl.appendChild(answersEl);
}

var answerButtonHandler = function(event) {
  console.log(event.target.getAttribute('data-answer-id'));
}

// event listeners
viewHighScoresEl.addEventListener("click", viewHighScoresHandler);
startQuizEl.addEventListener("click", startQuizHandler);


loadHighScores();
var answersEl = createAnswerButtons();
