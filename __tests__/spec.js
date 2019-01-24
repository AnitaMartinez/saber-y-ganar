const gameApp = require('../src/game');
const game = gameApp();

// -- Unit Tests --

describe("calculate points", () => {

    const maximumTimeCounter = 12;

    it("adds 1 point when is correct and time exceeds 10 seconds", () => {
       game.setAnswersUser([{
           isCorrect: true,
           time: 11
       }]);
       expect(game.calculatePoints()).toEqual(1);
    });
    it("adds 2 points when is correct and time is between 3 and 10 seconds", () => {
        game.setAnswersUser([{
            isCorrect: true,
            time: 5
        }]);
        expect(game.calculatePoints()).toEqual(2);
    });
    it("adds 3 points when is correct and time is less thant 3 seconds", () => {
        game.setAnswersUser([{
            isCorrect: true,
            time: 2
        }]);
        expect(game.calculatePoints()).toEqual(3);
    });
    it("subtracts 3 points when is wrong and time limit has been exceeded", () => {
        game.setAnswersUser([{
            isCorrect: false,
            time : maximumTimeCounter + 1
        }]);
        expect(game.calculatePoints()).toEqual(-3);
    });
    it("subtracts 2 points when is wrong and time exceeds 10 seconds", () => {
        game.setAnswersUser([{
            isCorrect: false,
            time : 11
        }]);
        expect(game.calculatePoints()).toEqual(-2);
    });
    it("subtracts 1 point when is wrong and time is less than 10 seconds", () => {
        game.setAnswersUser([{
            isCorrect: false,
            time : 3
        }]);
        expect(game.calculatePoints()).toEqual(-1);
    });
});


