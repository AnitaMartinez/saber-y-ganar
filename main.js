(function () {
    'use strict';

    function getQuestions(callback) {
        var serverData = [
            {
                id: 1,
                question: "¿Cuál es la capital de Portugal?",
                answers: [
                    { id: 1, answerDescription: "Faro", isCorrect: false, idQuestion: 1 },
                    { id: 2, answerDescription: "Oporto", isCorrect: false, idQuestion: 1 },
                    { id: 3, answerDescription: "Lisboa", isCorrect: true, idQuestion: 1 }
                ]
            },
            {
                id: 2,
                question: "¿Cuál es la capital de Egipto?",
                answers: [
                    { id: 1, answerDescription: "Faro", isCorrect: false, idQuestion: 2 },
                    { id: 2, answerDescription: "El Cairo", isCorrect: true, idQuestion: 2 },
                    { id: 3, answerDescription: "Lisboa", isCorrect: false, idQuestion: 2 }
                ]
            },
            {
                id: 3,
                question: "¿Cuál es la capital de España?",
                answers: [
                    { id: 1, answerDescription: "Madrid", isCorrect: true, idQuestion: 3 },
                    { id: 2, answerDescription: "Oporto", isCorrect: false, idQuestion: 3 },
                    { id: 3, answerDescription: "Lisboa", isCorrect: false, idQuestion: 3 }
                ]
            }
        ];
        callback(serverData);
    }

    let indexQuestion = 0;  //Está en el global

    function currentQuestion() {
        if (areThereMoreQuestions()) {
            return questionsWithAnswers[indexQuestion];
        }
        throw "No hay más preguntas";
    }

    function prepareNextQuestion() {
        ++indexQuestion;
    }

    function onNextQuestion() {
        if (areThereMoreQuestions()) {
            paintQuestion(currentQuestion());
        }
        prepareNextQuestion();
    }

    function areThereMoreQuestions() {
        return indexQuestion < questionsWithAnswers.length;
    }

    const paintQuestion = (question) => {
        const questionsList = document.getElementById("questions-list");
        let titleQuestion;
        let answersInputs = "";

        titleQuestion = `<h5> ${question.question} </h5>`;

        for (const answers of question.answers) {
            answersInputs += (
                `<div>
                    <input type="radio" id=${answers.answerDescription} name="answer" value="answer">
                    <label for=${answers.answerDescription}>${answers.answerDescription}</label>
                    </div>`
            );
        }
        questionsList.innerHTML = titleQuestion + "<div class='answers-content'>" + answersInputs + "</div>";
        answersInputs = "";

    };

    const throwQuestions = () => {
        const buttonSendQuestion = document.getElementById("button-send-question");
        buttonSendQuestion.addEventListener("click", onNextQuestion);
    };


    //Get the data
    let questionsWithAnswers = [];
    getQuestions(function (data) {
        questionsWithAnswers = data;
        throwQuestions();
    });



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

// const player = {
//     answers: [
//         { idQuestion: 0, idAnswer: 0 }
//     ],
//     points: 0
// };

// const getValueAnswer = () => {

// };