export default function createGame(client){
  let questionsWithAnswers = [];
  let currentQuestionIndex = 0;
  let answerUserId;
  let currentIdQuestion;
  let answersUser = [];
  let timeCounter;
  const accumulatorTimeCounter = {
      accumulator: 0
  };
  const maximumTimeCounter = 12;

  function init() {
      const buttonStartGame = document.getElementById("button-init-questions");
      const buttonSendQuestion = document.getElementById("button-send-question");
      buttonStartGame.addEventListener("click", onStart);
      buttonSendQuestion.addEventListener("click", onNextQuestion);

      client.getQuestions().then((questions) => {
          questionsWithAnswers = JSON.parse(questions);
      })
  }


  function onStart() {
      resetQuestionsAndAnswers();
      showTimer();
      showButtonNextQuestion();
      paintQuestion(currentQuestion());
      updateQuestionIndex();
      startCountdown();
      prepareAnswersToBeClicked();
      updateScoreboard();
  }

  function onNextQuestion() {
      if (!isAnyAnswerChecked() && !isTimeOut()) {
          forceUserToAnswer();
          return;  //claúsula guarda
      }

      if (!isAnyAnswerChecked() && isTimeOut()) {
          markAnswerAsNotAnswered();
      }
      if (areThereMoreQuestions()) {
          saveInfoAnswerUser();
          prepareStepsToPlayQuestion();
      }
      else {
          saveInfoAnswerUser();
          resetGame();
          init();
      }
      updateScoreboard();
  }

  function prepareStepsToPlayQuestion() {
      clearCountDown();
      paintQuestion(currentQuestion());
      updateQuestionIndex();
      startCountdown();
      prepareAnswersToBeClicked();
  }

  function startCountdown() { //callback ¿?
      timeCounter = setInterval(function () {
          onTimeChanged();
          onTimeOut();
      }, 1000);
  }

  function onTimeChanged() {
      showTime();
      accumulatorTimeCounter.accumulator++;
  }

  function onTimeOut() {
      if (isTimeOut()) {
          onNextQuestion();
      }
  }

  function isTimeOut() {
      return accumulatorTimeCounter.accumulator > maximumTimeCounter;
  }

  function clearCountDown() {
      clearInterval(timeCounter);
      resetAccumulatorCountdown();
      showTime();
  }

  function resetAccumulatorCountdown() {
      accumulatorTimeCounter.accumulator = 0;
  }

  function showTime() {
      const timerDom = document.getElementById("timer");
      timerDom.innerHTML = accumulatorTimeCounter.accumulator;
  }

  function paintQuestion(question) {
      const questionsList = document.getElementById("questions-list");
      let titleQuestion;
      let answersInputs = "";
      titleQuestion = `<h5> ${question.questionText} </h5>`;
      for (const answer of question.answers) {
          answersInputs += (
              `<div>
                  <input class="input-radio" type="radio" data-idquestion=${question.id} value=${answer.id} id=${answer.answerText} name="answers">
                  <label for=${answer.answerText}> ${answer.answerText} </label>
              </div>`
          );
      }
      questionsList.innerHTML = titleQuestion + "<div class='container-answers'>" + answersInputs + "</div>";
      answersInputs = "";
  }

  function updateQuestionIndex() {
      ++currentQuestionIndex;
  }

  function currentQuestion() {
      return questionsWithAnswers[currentQuestionIndex];
  }

  function saveInfoAnswerUser() {
      answersUser.push({
          idQuestion: currentIdQuestion,
          idAnswer: answerUserId,
          isCorrect: isAnswerCorrect(),
          time: accumulatorTimeCounter.accumulator
      });
      //console.log(answersUser);
  }

  function showButtonNextQuestion() {
      const buttonSendQuestion = document.getElementById("button-send-question");
      buttonSendQuestion.classList.remove('hidden');
  }

  function showTimer() {
      const timerDom = document.getElementById("timer");
      timerDom.classList.remove('hidden');
  }

  function areThereMoreQuestions() {
      return currentQuestionIndex < questionsWithAnswers.length;
  }

  function isAnyAnswerChecked() {
      const inputsRadio = document.getElementsByClassName('input-radio');
      for (let i = 0; i < inputsRadio.length; i++) {
          if (inputsRadio[i].checked === true) {
              return true;
          }
      }
      return false;
  }

  function markAnswerAsNotAnswered() {
      answerUserId = null;
  }

  function forceUserToAnswer() {
      alert("Elige una respuesta antes de pasar a la siguiente");
  }

  function prepareAnswersToBeClicked() {
      const inputsRadio = document.getElementsByClassName('input-radio');
      for (let i = 0; i < inputsRadio.length; i++) {
          inputsRadio[i].addEventListener("click", getInfoAnswerUser);
      }
  }

  function getInfoAnswerUser(event) {
      currentIdQuestion = parseInt(event.currentTarget.dataset.idquestion);
      answerUserId = parseInt(event.currentTarget.value);
  }

  function isAnswerCorrect() {
      if (answerUserId === null) {
          console.log("Has fallado, puesto que no has contestado y se ha pasado el tiempo");
          return false;
      }
      else if (answerUserId === questionsWithAnswers[currentIdQuestion].correctAnswerId) {
          console.log("Has acertado");
          return true;
      } else {
          console.log("Has fallado");
          return false;
      }
  }

  function updateScoreboard() {
      paintTotalPoints(calculatePoints());
      paintCorrectAnswers();
      paintTotalAnswers();
  }

  function paintTotalPoints(points) {
      const txtTotalPoints = document.getElementById("total-points");
      txtTotalPoints.innerText = points;
  }

  function paintTotalAnswers() {
      const txtTotalAnswers = document.getElementById("total-answers");
      txtTotalAnswers.innerText = answersUser.length;
  }

  function paintCorrectAnswers() {
      const text = document.getElementById("correct-answers");
      text.innerText = calculateNumberOfCorrectAnswers();
  }

  //Just to do the test:
  function setAnswersUser(answers){
      answersUser = answers
  }

  function calculatePoints() {
      let points = 0;
      for (let i = 0; i < answersUser.length; i++) {
          if (answersUser[i].isCorrect) {
              if (answersUser[i].time > 10) {
                  console.log("Correcta, más de 10 segundos");
                  points += 1;
              }
              else if (answersUser[i].time < 3) {
                  console.log("Correcta, en menos de 3 segundos");
                  points += 3;
              }
              else {
                  console.log("Correcta, entre 3 y 10 segundos");
                  points += 2;
              }
          }
          if (answersUser[i].isCorrect === false) {
              if (answersUser[i].time > maximumTimeCounter) {
                  points -= 3;
              }
              else if (answersUser[i].time > 10) {
                  points -= 2;
              }
              else {
                  points -= 1;
              }
          }
      }
      return points;
  }

  function calculateNumberOfCorrectAnswers() {
      let accumulatorAnswers = 0;
      for (let i = 0; i < answersUser.length; i++) {
          if (answersUser[i].isCorrect === true) {
              accumulatorAnswers += 1;
          }
      }
      return accumulatorAnswers;
  }

  function resetQuestionsAndAnswers() {
      currentQuestionIndex = 0;
      answersUser.length = 0;
  }

  function resetGame() {
      clearCountDown();
      resetDOM();
  }

  function resetDOM() {
      const questionsList = document.getElementById("questions-list");
      questionsList.innerHTML = "<button id='button-init-questions'>Volver a jugar</button>";
      const timerDom = document.getElementById("timer");
      timerDom.classList.add('hidden');
      const buttonSendQuestion = document.getElementById("button-send-question");
      buttonSendQuestion.classList.add('hidden');
  }

  return {
      start: init,
      setAnswersUser,
      calculatePoints
  };
}

//just to do the tests
if (typeof (module) != 'undefined') {
    module.exports = createGame
}
