const application = (function () {
    'use strict';

    let questionsWithAnswers = [];
    let currentQuestionIndex = 0;
    let answerUserId;
    let currentIdQuestion;
    const answersUser = [];

    let timer;

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
                correctAnswerId: 3
            }
        ];
        callback(serverData);
    }

    function initGame() {
        showButtonNextQuestion();
        paintQuestion(currentQuestion());
        prepareAnswersToBeClicked();
        prepareNextQuestion();
    }

    function onNextQuestion() {
        // && isAnyAnswerChecked()
        if (areThereMoreQuestions()) {
            paintQuestion(currentQuestion());
            prepareAnswersToBeClicked();
            saveInfoAnswerUser();

            startCountDown();

            prepareNextQuestion();
            // timer = window.setTimeout(countDown, 3000);

        } else {
            // if (isAnyAnswerChecked() !== true) {
            //     forceUserToAnswer();
            // }
            if (areThereMoreQuestions() !== true) {
                saveInfoAnswerUser();
                window.clearTimeout(timer);
                //And go back to the beginning of the game
            }
        }
    }


    const timerDom = document.getElementById("timer");
    var acumulador = 0;

    function startCountDown() {
        var myVar = setInterval(function () {
            timerDom.innerHTML = acumulador;
            acumulador++;
            if (acumulador > 5) {
                console.log("hola");
                acumulador = 0;
                timerDom.innerHTML = acumulador;
                clearInterval(myVar);
            }
        }, 1000);
    }

    // function countDown() {
    //     window.clearTimeout(timer);
    //     onNextQuestion();
    // }


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
    }

    function currentQuestion() {
        return questionsWithAnswers[currentQuestionIndex];
    }

    function prepareNextQuestion() {
        ++currentQuestionIndex;
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
        questionsList.innerHTML = titleQuestion + "<div class='answers-content'>" + answersInputs + "</div>";
        answersInputs = "";
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
            isCorrect: isAnswerCorrect()
        });
        console.log(answersUser);
    }

    function isAnswerCorrect() {
        if (answerUserId === questionsWithAnswers[currentIdQuestion].correctAnswerId) {
            console.log("Has acertado");
            return true;
        } else {
            console.log("Has fallado");
            return false;
        }
    }

    function forceUserToAnswer() {
        alert("Elige una respuesta antes de pasar a la siguiente");
    }

    return {
        start: start
    };

}());
