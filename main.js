'use strict';


function getQuestions(callback) {
    var serverData = [
        {
            id: 1,
            question: "¿Cuál es la capital de Portugal?",
            answers: [
                { id: 1, answerDescritpion: "Faro", isCorrect: false, idQuestion: 1 },
                { id: 2, answerDescritpion: "Oporto", isCorrect: false, idQuestion: 1 },
                { id: 3, answerDescritpion: "Lisboa", isCorrect: true, idQuestion: 1 }
            ]
        },
        {
            id: 2,
            question: "¿Cuál es la capital de Egipto?",
            answers: [
                { id: 1, answerDescritpion: "Faro", isCorrect: false, idQuestion: 2 },
                { id: 2, answerDescritpion: "El Cairo", isCorrect: true, idQuestion: 2 },
                { id: 3, answerDescritpion: "Lisboa", isCorrect: false, idQuestion: 2 }
            ]
        },
        {
            id: 3,
            question: "¿Cuál es la capital de España?",
            answers: [
                { id: 1, answerDescritpion: "Madrid", isCorrect: true, idQuestion: 3 },
                { id: 2, answerDescritpion: "Oporto", isCorrect: false, idQuestion: 3 },
                { id: 3, answerDescritpion: "Lisboa", isCorrect: false, idQuestion: 3 }
            ]
        }
    ];
    callback(serverData);
}

const paintQuestions = questionsWithAnswers => {
    const questionsList = document.getElementById("questions-list");
    const buttonSendQuestion = document.getElementById("button-submit");

    var i = 0;
    function paintQuestions() {
        if (i < questionsWithAnswers.length) {
            questionsList.innerHTML = `<h5>${questionsWithAnswers[i].question}</h5>`

            for (const answers of questionsWithAnswers[i].answers) {
                questionsList.innerHTML += (
                    `<input type="radio" id=${answers.answerDescritpion} name="answer" value="answer">
                    <label for=${answers.answerDescritpion}>${answers.answerDescritpion}</label>`
                );
            }
            i++;
        }
    }
    buttonSendQuestion.addEventListener("click", paintQuestions);
}

//Get the data
var questionsWithAnswers = [];
getQuestions(function (data) {
    questionsWithAnswers = data;
    console.log(questionsWithAnswers);
    paintQuestions(questionsWithAnswers);
});


