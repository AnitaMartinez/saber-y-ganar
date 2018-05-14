const application = (function () {
    'use strict';

    let questionsWithAnswers = [];
    let currentQuestionIndex = 0;
    let answerUserId;
    let currentIdQuestion;
    const answersUser = [];
    let timeCounter;
    const accumulatorTimeCounter = {
        accumulator: 0
    };
    const maximumTimeCounter = 5;

    function init() {
        const buttonStartGame = document.getElementById("button-init-questions");
        const buttonSendQuestion = document.getElementById("button-send-question");
        buttonStartGame.addEventListener("click", onStart);
        buttonSendQuestion.addEventListener("click", onNextQuestion);
        getQuestions(data => questionsWithAnswers = data);
    }

    function getQuestions(callback) {
        var serverData = [
            {
                id: 0,
                questionText: "¿Cuál es la capital de Portugal?",
                answers: [
                    { id: 1, answerText: "Faro", idQuestion: 0 },
                    { id: 2, answerText: "Oporto", idQuestion: 0 },
                    { id: 3, answerText: "Lisboa", idQuestion: 0 }
                ],
                correctAnswerId: 3
            },
            {
                id: 1,
                questionText: "¿Cuál es la capital de Egipto?",
                answers: [
                    { id: 1, answerText: "Faro", idQuestion: 1 },
                    { id: 2, answerText: "El Cairo", idQuestion: 1 },
                    { id: 3, answerText: "Lisboa", idQuestion: 1 }
                ],
                correctAnswerId: 2
            },
            {
                id: 2,
                questionText: "¿Cuál es la capital de España?",
                answers: [
                    { id: 1, answerText: "Madrid", idQuestion: 2 },
                    { id: 2, answerText: "Oporto", idQuestion: 2 },
                    { id: 3, answerText: "Lisboa", idQuestion: 2 }
                ],
                correctAnswerId: 1
            },
            {
                id: 3,
                questionText: "¿Cuál es la capital de Francia?",
                answers: [
                    { id: 1, answerText: "Madrid", idQuestion: 3 },
                    { id: 2, answerText: "París", idQuestion: 3 },
                    { id: 3, answerText: "Lisboa", idQuestion: 3 }
                ],
                correctAnswerId: 2
            }
        ];
        callback(serverData);
    }

    function onStart() {
        showTimer();
        showButtonNextQuestion();
        paintQuestion(currentQuestion());
        updateQuestionIndex();
        startCountdown();
        prepareAnswersToBeClicked();
        updateScoreboard();
    }

    function onNextQuestion() {
        if (!areThereMoreQuestions()) {
            saveInfoAnswerUser();
            updateScoreboard();
            if (isTimeOut() || isAnyAnswerChecked()) {
                resetGame();
                init();
            }
        }
        else if (isAnyAnswerChecked()) {
            saveInfoAnswerUser();
            prepareStepsToPlayQuestion();
        } else {
            if (!isTimeOut()) {
                forceUserToAnswer();
            }
            else {
                markAnswerAsNotAnswered();
                saveInfoAnswerUser();
                prepareStepsToPlayQuestion();
            }


        }
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
        console.log(answersUser);
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
            inputsRadio[i].addEventListener("click", handleClickInAnswers);
        }
    }

    function handleClickInAnswers(event) {
        checkAnswerSelected(event);
        getInfoAnswerUser();
    }

    function getInfoAnswerUser() {
        currentIdQuestion = parseInt(event.currentTarget.dataset.idquestion);
        answerUserId = parseInt(event.currentTarget.value);
    }

    function checkAnswerSelected() {
        unCheckAnswers();
        checkCurrentAnswer();
    }

    function unCheckAnswers() {
        const inputsRadio = document.getElementsByClassName('input-radio');
        for (let i = 0; i < inputsRadio.length; i++) {
            inputsRadio[i].removeAttribute("checked");
        }
    }

    function checkCurrentAnswer() {
        event.currentTarget.setAttribute("checked", "");
    }

    function isAnswerCorrect() {
        if (answerUserId === null) {
            console.log("Has fallado, puesto que no has contestado y se ha pasado el tiempo");
            return false;
        } else {
            if (answerUserId === questionsWithAnswers[currentIdQuestion].correctAnswerId) {
                console.log("Has acertado");
                return true;
            } else {
                console.log("Has fallado");
                return false;
            }
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

    function calculatePoints() {
        let points = 0;
        for (let i = 0; i < answersUser.length; i++) {
            if (answersUser[i].isCorrect) {
                if (answersUser[i].time <= 2) {
                    points += 2;
                } else if (answersUser[i].time <= 10) {
                    points += 1;
                } else if (answersUser[i].time > 10) {
                    points += 0;
                }
            }
            if (answersUser[i].isCorrect === false) {
                if (answersUser[i].time > 20) {
                    points -= 2;
                } else if (answersUser[i].time > 10) {
                    points -= 1;
                } else {
                    points -= 3;
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

    function resetGame() {
        clearCountDown();
        resetDOM();
        resetQuestionsAndAnswers();
    }

    function resetDOM() {
        const questionsList = document.getElementById("questions-list");
        const buttonSendQuestion = document.getElementById("button-send-question");
        const timerDom = document.getElementById("timer");
        questionsList.innerHTML = "<button id='button-init-questions'>Comenzar</button>";
        buttonSendQuestion.classList.add('hidden');
        timerDom.classList.add('hidden');
    }

    function resetQuestionsAndAnswers() {
        currentQuestionIndex = 0;
        questionsWithAnswers.length = 0;
        answersUser.length = 0;
    }

    return {
        start: init
    };

}());
