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
    const maximumTimeCounter = 20;


    function start() {
        const buttonStartGame = document.getElementById("button-init-questions");
        buttonStartGame.addEventListener("click", initGame);
        const buttonSendQuestion = document.getElementById("button-send-question");
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

    function initGame() {
        showButtonNextQuestion();
        paintQuestion(currentQuestion());
        startCountDown();
        prepareAnswersToBeClicked();
    }

    function onNextQuestion() {
        if (areThereMoreQuestions() !== true) {
            clearCountDown();
            saveInfoAnswerUser();
            console.log("Fin del juego"); //Volver al punto de partida
            console.log(calculatePoints());
            return;
        }
        //Esta lógica está mal expresada, lo del else, podría pasar de lo del si hay más preguntas en los dos del else, ya que tengo un return arriba
        if (areThereMoreQuestions() && isAnyAnswerChecked()) {
            prepareStepsToPlayQuestion();

        } else {
            if (isAnyAnswerChecked() !== true && (accumulatorTimeCounter.accumulator > maximumTimeCounter)) {
                answerUserId = null;   //Refactor
                prepareStepsToPlayQuestion();

            } else if (isAnyAnswerChecked() !== true && (accumulatorTimeCounter.accumulator < maximumTimeCounter)) {
                forceUserToAnswer();
            }
        }
    }

    function prepareStepsToPlayQuestion() {
        saveInfoAnswerUser();
        clearCountDown();
        paintQuestion(currentQuestion());
        startCountDown();
        prepareAnswersToBeClicked();
    }

    function startCountDown() {
        const timerDom = document.getElementById("timer");
        timeCounter = setInterval(function () {
            timerDom.innerHTML = accumulatorTimeCounter.accumulator;  //Esto va en otra función porque es pintar
            accumulatorTimeCounter.accumulator++;
            if (accumulatorTimeCounter.accumulator > maximumTimeCounter) {
                onNextQuestion();
            }
        }, 1000);
    }

    function clearCountDown() {
        const timerDom = document.getElementById("timer");
        clearInterval(timeCounter);
        accumulatorTimeCounter.accumulator = 0;
        timerDom.innerHTML = accumulatorTimeCounter.accumulator; //Esto va en otra función porque es pintar
    }

    function areThereMoreQuestions() {
        return currentQuestionIndex < (questionsWithAnswers.length);
    }

    function isAnyAnswerChecked() {
        const inputsRadio = document.getElementsByClassName('input-radio');
        for (let i = 0; i < inputsRadio.length; i++) {
            if (inputsRadio[i].checked === true) {
                return true;
            }
        }
    }

    function currentQuestion() {
        return questionsWithAnswers[currentQuestionIndex];
    }

    function paintQuestion(question) {
        console.log("Al principio de paint: currentQuestionIndex: ", currentQuestionIndex);
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
        questionsList.innerHTML = titleQuestion + "<div class='answers-content'>" + answersInputs + "</div>";
        answersInputs = "";
        ++currentQuestionIndex;  //refactor, porque esto no está pintando, pero llamarla aquí o tener cuidado con dónde la pongo
    }

    function showButtonNextQuestion() {
        const buttonSendQuestion = document.getElementById("button-send-question");
        buttonSendQuestion.classList.remove('hidden');
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

    function saveInfoAnswerUser() {
        answersUser.push({
            idQuestion: currentIdQuestion,
            idAnswer: answerUserId,
            isCorrect: isAnswerCorrect(),
            time: accumulatorTimeCounter.accumulator
        });
        console.log(answersUser);
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

    function forceUserToAnswer() {
        alert("Elige una respuesta antes de pasar a la siguiente");
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
                    points -= 3;
                } else if (answersUser[i].time > 10) {
                    points -= 2;
                } else {
                    points -= 1;
                }
            }
        }
        return points;
    }





    return {
        start: start
    };

}());
