const pug = require('pug');
const gameApp = require('../src/game');


// -- Unit Tests --

describe('calculate points', () => {

    const game = gameApp();
    const maximumTimeCounter = 12;

    it('adds 1 point when is correct and time exceeds 10 seconds', () => {
       game.setAnswersUser([{
           isCorrect: true,
           time: 11
       }]);
       expect(game.calculatePoints()).toEqual(1);
    });
    it('adds 2 points when is correct and time is between 3 and 10 seconds', () => {
        game.setAnswersUser([{
            isCorrect: true,
            time: 5
        }]);
        expect(game.calculatePoints()).toEqual(2);
    });
    it('adds 3 points when is correct and time is less thant 3 seconds', () => {
        game.setAnswersUser([{
            isCorrect: true,
            time: 2
        }]);
        expect(game.calculatePoints()).toEqual(3);
    });
    it('subtracts 3 points when is wrong and time limit has been exceeded', () => {
        game.setAnswersUser([{
            isCorrect: false,
            time : maximumTimeCounter + 1
        }]);
        expect(game.calculatePoints()).toEqual(-3);
    });
    it('subtracts 2 points when is wrong and time exceeds 10 seconds', () => {
        game.setAnswersUser([{
            isCorrect: false,
            time : 11
        }]);
        expect(game.calculatePoints()).toEqual(-2);
    });
    it('subtracts 1 point when is wrong and time is less than 10 seconds', () => {
        game.setAnswersUser([{
            isCorrect: false,
            time : 3
        }]);
        expect(game.calculatePoints()).toEqual(-1);
    });
});

// -- Integratio test --

/*
    - answers a question
    - restart the counter time
    - does not repeat the last question
*/

describe('checks DOM', () => {

    const questions = [
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

    beforeEach((done) => {
        document.body.innerHTML = pug.compileFile('./views/index.pug', null)();
        const getQuestions = {
            getQuestions : () => {
                return new Promise(resolve => {
                    resolve(JSON.stringify(questions));
                });
            }
        };
        gameApp(getQuestions).start(done);
    });

    it('loads the page', () => {
        expect(
            document.getElementById('button-init-questions'))
            .not.toBeNull();
    });
    it('expects first question to be rendered', () => {
        const buttonStart = document.getElementById('button-init-questions');
        buttonStart.click();
        const questionTitle = document.getElementById('button-send-question');
        expect(questionTitle).not.toBeNull();
    });
    it('answers a question and renders next question', () => {
        const buttonStart = document.getElementById('button-init-questions');
        buttonStart.click();
        const inputAnswer = document.querySelector('.input-radio');
        inputAnswer.click();
        const questionTitle = document.getElementById('button-send-question');
        questionTitle.click();
        const titleQuestion = document.querySelector('#questions-list h5');
        expect(titleQuestion.innerHTML.trim()).toEqual(questions[1].questionText);

    })

   /* La anterior no me sale. Los pasos necesarios serían:
        - Click en el button start
        - Click en una respuesta
        - Click en el botón de pasar a la siguiente pregunta
        - Comprobar que el title html de la pregunta sea el mismo que el del array de preguntas.
        ¿Pero de dónde saco el array de preguntas? Necesitaría insertárselo por el test */

});

