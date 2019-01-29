const pug = require('pug');
const gameApp = require('../src/game');

// -- Unit tests --

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

// -- Integration tests --

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

    let btnInit;
    let btnSend;
    let timer;

    const getDomElements = () => {
        btnInit = document.querySelector('#button-init-questions');
        btnSend = document.querySelector('#button-send-question');
        timer = document.querySelector('#timer');
    };

    beforeEach(done => {
        document.body.innerHTML = pug.compileFile('./views/index.pug', null)();
        const getQuestions = {
            getQuestions : () => {
                return new Promise(resolve => {
                    resolve(JSON.stringify(questions));
                });
            }
        };
        gameApp(getQuestions).start(done);
        getDomElements();
    });

    it('loads the page', () => {
        expect(btnInit).not.toBeNull();
        expect(btnSend).not.toBeNull();

    });
    it('answers a question and renders next question', () => {
        btnInit.click();
        const inputAnswer = document.querySelector('.input-radio');
        inputAnswer.click();
        btnSend.click();
        const titleQuestion = document.querySelector('#questions-list h5');
        expect(titleQuestion.innerHTML.trim()).toEqual(questions[1].questionText);
    });
    it('restarts counter time', done => {
        btnInit.click();
        const inputAnswer = document.querySelector('.input-radio');
        inputAnswer.click();
        btnSend.click();
        setTimeout(() => {
            expect(Number(timer.innerHTML)).toEqual(0);
            done();
        }, 1000);
    });

});

