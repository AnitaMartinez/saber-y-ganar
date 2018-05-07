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

    const throwQuestions = questionsWithAnswers => {
        const questionsList = document.getElementById("questions-list");
        const buttonSendQuestion = document.getElementById("button-send-question");
        let titleQuestion;
        let answersInputs = "";

        let i = 0;
        function paintNextQuestion() {
            if (i < questionsWithAnswers.length) {
                titleQuestion = `<h5> ${questionsWithAnswers[i].question} </h5>`;

                for (const answers of questionsWithAnswers[i].answers) {
                    answersInputs += (
                        `<div>
                        <input type="radio" id=${answers.answerDescription} name="answer" value="answer">
                        <label for=${answers.answerDescription}>${answers.answerDescription}</label>
                        </div>`
                    );
                }
                questionsList.innerHTML = titleQuestion + "<div class='answers-content'>" + answersInputs + "</div>";
                i++;
                answersInputs = "";
            }
        }
        buttonSendQuestion.addEventListener("click", paintNextQuestion);
    }

    //Get the data
    let questionsWithAnswers = [];
    getQuestions(function (data) {
        questionsWithAnswers = data;
        throwQuestions(questionsWithAnswers);
    });

}());