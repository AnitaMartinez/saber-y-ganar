var application = (function () {
    'use strict';

    let questionsWithAnswers = [];
    let currentQuestionIndex = 0;
    let answerUserId;
    let currentIdQuestion;
    const answersUser = [];

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
                    { id: 1, answerText: "Faro", idQuestion: 1 },
                    { id: 2, answerText: "Oporto", idQuestion: 1 },
                    { id: 3, answerText: "Lisboa", idQuestion: 1 }
                ],
                correctAnswerId: 3
            },
            {
                id: 1,
                questionText: "¿Cuál es la capital de Egipto?",
                answers: [
                    { id: 1, answerText: "Faro", idQuestion: 2 },
                    { id: 2, answerText: "El Cairo", idQuestion: 2 },
                    { id: 3, answerText: "Lisboa", idQuestion: 2 }
                ],
                correctAnswerId: 2
            },
            {
                id: 2,
                questionText: "¿Cuál es la capital de España?",
                answers: [
                    { id: 1, answerText: "Madrid", idQuestion: 3 },
                    { id: 2, answerText: "Oporto", idQuestion: 3 },
                    { id: 3, answerText: "Lisboa", idQuestion: 3 }
                ],
                correctAnswerId: 1
            }
        ];
        callback(serverData);
    }

    function initGame() {
        showButtonNextQuestion();
        paintQuestion(currentQuestion());
        prepareNextQuestion();
        getInfoAnswerUser();
    }

    function showButtonNextQuestion() {
        const buttonSendQuestion = document.getElementById("button-send-question");
        buttonSendQuestion.classList.remove('hidden');
    }

    function onNextQuestion() {
        if (areThereMoreQuestions()) {
            paintQuestion(currentQuestion());

        }
        getInfoAnswerUser();
        saveInfoAnswerUser();
        prepareNextQuestion();
    }

    function areThereMoreQuestions() {
        return currentQuestionIndex < questionsWithAnswers.length;
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

    function getInfoAnswerUser() {
        const inputsRadio = document.getElementsByClassName('input-radio');


        for (let i = 0; i < inputsRadio.length; i++) {
            inputsRadio[i].addEventListener("click", getIdsAnswer);
        }
        function getIdsAnswer(event) {
            currentIdQuestion = parseInt(event.currentTarget.dataset.idquestion);
            answerUserId = parseInt(event.currentTarget.value);


            for (let i = 0; i < inputsRadio.length; i++) {
                inputsRadio[i].removeAttribute("checked");
            }

            event.currentTarget.setAttribute("checked", "");

        }
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

    function saveInfoAnswerUser() {
        answersUser.push({
            idQuestion: currentIdQuestion,
            idAnswer: answerUserId,
            isCorrect: isAnswerCorrect()
        });
        console.log(answersUser);
    }

    return {
        start: start
    };

}());
