const gameApp = require('../src/game');
const game = gameApp();

// -- Unit Tests --

describe("calculate points", () => {

    const answerUser = {
            idQuestion: 0,
            idAnswer: 3,
            isCorrect: true,
            time: 11
    };

    it("adds 1 point when is correct and time exceeds 10 seconds", () => {
       game.setAnswersUser([answerUser] );
       expect(game.calculatePoints()).toEqual(1);
    });
    it("adds 2 points when is correct and time is between 3 and 10 seconds", () => {
        game.setAnswersUser([{
            ...answerUser,
            time : 4
        }]);
        expect(game.calculatePoints()).toEqual(2);
    });
    it("adds 3 points when is correct and time is less thant 3 seconds", () => {
        game.setAnswersUser([{
            ...answerUser,
            time : 2
        }]);
        expect(game.calculatePoints()).toEqual(3);
    });
});


