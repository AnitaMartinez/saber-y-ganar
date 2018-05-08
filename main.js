var application = (function () {
    'use strict';

    let questionsWithAnswers = [];
    let currentQuestionIndex = 0;
    let answerUserId;
    let currentIdQuestion;

    function start() {
        const buttonSendQuestion = document.getElementById("button-send-question");
        buttonSendQuestion.addEventListener("click", handleEvents);
        getQuestions(data => {
            questionsWithAnswers = data;
        });
    }

    function handleEvents() {
        onNextQuestion();
        saveInfoAnswerUser();
    }

    function getQuestions(callback) {
        var serverData = [
            {
                id: 1,
                questionText: "¿Cuál es la capital de Portugal?",
                answers: [
                    { id: 1, answerText: "Faro", idQuestion: 1 },
                    { id: 2, answerText: "Oporto", idQuestion: 1 },
                    { id: 3, answerText: "Lisboa", idQuestion: 1 }
                ],
                correctAnswerId: 3
            },
            {
                id: 2,
                questionText: "¿Cuál es la capital de Egipto?",
                answers: [
                    { id: 1, answerText: "Faro", idQuestion: 2 },
                    { id: 2, answerText: "El Cairo", idQuestion: 2 },
                    { id: 3, answerText: "Lisboa", idQuestion: 2 }
                ],
                correctAnswerId: 2
            },
            {
                id: 3,
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

    function onNextQuestion() {
        if (areThereMoreQuestions()) {
            paintQuestion(currentQuestion());

        }
        getInfoAnswerUser();
        prepareNextQuestion();
    }

    //Por refactorizar: 

    function getInfoAnswerUser() {
        var radios = document.querySelectorAll('.input'); //Cambiar el queryselector
        for (let i = 0; i < radios.length; i++) {
            radios[i].addEventListener("click", getValue);
        }
        function getValue(event) {
            currentIdQuestion = event.currentTarget.dataset.idquestion;
            answerUserId = event.currentTarget.value;
        }
    }

    const answersUser = [];

    function saveInfoAnswerUser() {
        answersUser.push({ idQuestion: currentIdQuestion, idAnswer: answerUserId });
        console.log(answersUser);

    }

    //Hasta aquí



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
                    <input class="input" type="radio" data-idquestion=${question.id} value=${answer.id} id=${answer.answerText} name="answers">
                    <label for=${answer.answerText}> ${answer.answerText} </label>
                </div>`
            );
        }
        questionsList.innerHTML = titleQuestion + "<div class='answers-content'>" + answersInputs + "</div>";
        answersInputs = "";
    }

    return {
        start: start
    };

}());

// players = [
//     {
//         name: "Laura",
//         answers: [
//             { idQuestion: 1, idAnswer: 2 },
//             { idQuestion: 2, idAnswer: 3 },
//             { idQuestion: 3, idAnswer: 1 }
//         ],
//         points: 33
//     },
//     {
//         name: "María",
//         answers: [
//             { idQuestion: 1, idAnswer: 1 },
//             { idQuestion: 2, idAnswer: 3 },
//             { idQuestion: 3, idAnswer: 1 }
//         ],
//         points: 20
//     }
// ];
