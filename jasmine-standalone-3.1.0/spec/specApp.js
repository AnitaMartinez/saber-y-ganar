/* TO DO - list
*
*   Calcular ganador
*
*     Detecta al usuario con más puntos
*         (Laura 33 puntos, Elisa 5, Jose 20) -> Laura gana
*     Detecta cuando los usuarios con más puntos han empatado
*         (Laura 33 puntos, Elisa 33, Jose 20) -> Elisa y Laura ganan
*
* */

describe('winner"s calculation', function () {

    let players;

    beforeEach(function () {
        players = [
            {
                name: "Laura",
                points: 33
            },
            {
                name: "Elisa",
                points: 5
            },
            {
                name: "Jose",
                points: 20
            }
        ]
    });

    const calculateWinner = () => {
        let winners = [];
        let points = 0;
        for (const player of players) {
            if (player.points > points) {
                points = player.points;
                winners = [];
                winners.push(player);
            }
            else if (player.points === points) {
                winners.push(player);
            }
        }
        return winners;
    }

    it("checks that the winning user is the one with most points", function () {
        expect(calculateWinner(players)).toEqual([{ name: "Laura", points: 33 }]);
        expect(calculateWinner(players)).not.toBe([{ name: "Laura", points: 33 }]);
    });
    it("detects a tie", function () {
        players[1].points = 33;
        expect(calculateWinner(players)).toEqual([{ name: "Laura", points: 33 }, { name: "Elisa", points: 33 }]);
    });
});


/* TO DO - list
*
*   velocidad de respuesta, acierto o fallo,
*
*      Si acierto pregunta en menos de 2 segundos (inclusive) - sumo 2 puntos
*          (0 puntos, pregunta correcta, 1 segundo) -> 2 puntos
*          (1 punto, correcta, 1 segundo) -> 3 puntos
*      Si acierto pregunta entre 3 y 10 segundos (inclusive) - sumo 1 punto
*          (1 punto, correcta, 5 segundos) -> 2 puntos
*          (1 punto, correcta, 3 segundos) -> 2 puntos
*      Si acierto y tardo mas de 11 segundos (inclusive) - 0 puntos
           (1 punto, correcta, 11 segundos)  -> 1 punto
           (5 punto, correcta, 18 segundos)  -> 5 punto
*      Si fallo pregunta en mas de 11 segundos (inclusive) - resto 2 puntos
           (2 puntos, incorrecta, 11 segundos) -> 0 puntos
           (0 puntos, incorrecta, 18 segundos) -> -2 puntos
*      Si fallo antes de 10 segundos (inclusive) - resto 1 punto
*          (1 punto, incorrecta, 3 segundos)  -> 0 puntos
           (10 punto, incorrecta, 10 segundos)  -> 9 puntos
*      Si en 20 segundos no has respondido , pasa a siguiente pregunta y pierdes 3 punto
           (3 puntos, noContesta, 21) -> 0 puntos
*      No se puede pasar sin responder: si en 20 segundos no ha respondido, pierde 3 puntos
           (3 puntos) -> 0
*
*
* */


describe('calculo de marcador', function () {
    function recalcularMarcadorEsCorreta(puntos, tiempo) {
        switch (true) {
            case tiempo <= 2: return puntos + 2;
            case tiempo <= 10: return puntos + 1;
            case tiempo > 10: return puntos;
            default: ;
        }
    }
    function recalcularMarcadorEsIncorrecta(puntos, tiempo) {
        switch (true) {
            case tiempo > 20: return puntos - 3;
            case tiempo > 10: return puntos - 2;
            case tiempo <= 20: return puntos - 1;
            default: ;
        }
    }
    function recalcularMarcadorSinRespuesta(puntos) {
        return puntos - 3;
    }

    it("suma más puntos si acierta muy rápido", function () {
        expect(recalcularMarcadorEsCorreta(0, 1)).toBe(2);
        expect(recalcularMarcadorEsCorreta(2, 1)).toBe(4);
    });
    it("suma punto si acierta rápido", function () {
        expect(recalcularMarcadorEsCorreta(1, 5)).toBe(2);
        expect(recalcularMarcadorEsCorreta(1, 3)).toBe(2);
    });
    it("no suma puntos si acierto muy lento", function () {
        expect(recalcularMarcadorEsCorreta(1, 11)).toBe(1);
        expect(recalcularMarcadorEsCorreta(5, 18)).toBe(5);
    });
    it("resta más puntos si fallo muy lento", function () {
        expect(recalcularMarcadorEsIncorrecta(2, 11)).toBe(0);
        expect(recalcularMarcadorEsIncorrecta(0, 18)).toBe(-2);
    });
    it("resta punto si fallo lento", function () {
        expect(recalcularMarcadorEsIncorrecta(1, 3)).toBe(0);
        expect(recalcularMarcadorEsIncorrecta(10, 10)).toBe(9);
    });
    it("resta puntos si no contesto en mucho tiempo", function () {
        expect(recalcularMarcadorEsIncorrecta(3, 21)).toBe(0);
    });
    it("resta puntos si no contesto en 20 segundos", function () {
        expect(recalcularMarcadorSinRespuesta(3)).toBe(0);
    });
});

/* TO DO - list
*
*      Reconoce si una respuesta es correcta
*          (pregunta, respuesta correcta, ) -> True
*      Reconoce una respuesta incorrecta
*          (pregunta, respuesta incorrecta ) -> False
*      Detecta cuando la respuesta no pertenece a la pregunta
           (pregunta, respuesta correcta, ) -> True
           (pregunta, respuesta incorrecta ) -> True
           (pregunta, respuesta que no pertenece a la pregunta, ) -> False
* */

describe("array preguntas", function () {
    const questionsWithAnswers = [{
        id: 1,
        question: "¿Cuál es la capital de Portugal?",
        answers: [
            { id: 1, answer: "Faro", isCorrect: false, idQuestion: 1 },
            { id: 2, answer: "Oporto", isCorrect: false, idQuestion: 1 },
            { id: 3, answer: "Lisboa", isCorrect: true, idQuestion: 1 }
        ]
    },
    {
        id: 2,
        question: "¿Cuál es la capital de Egipto?",
        answers: [
            { id: 1, answer: "Faro", isCorrect: false, idQuestion: 2 },
            { id: 2, answer: "El Cairo", isCorrect: true, idQuestion: 2 },
            { id: 3, answer: "Lisboa", isCorrect: false, idQuestion: 2 }
        ]
    },
    {
        id: 3,
        question: "¿Cuál es la capital de España?",
        answers: [
            { id: 1, answer: "Madrid", isCorrect: true, idQuestion: 3 },
            { id: 2, answer: "Oporto", isCorrect: false, idQuestion: 3 },
            { id: 3, answer: "Lisboa", isCorrect: false, idQuestion: 3 }
        ]
    }
    ];


    function dosetTimeout(i) {
        setTimeout(function () {
            console.log(questionsWithAnswers[i].question);
            for (const answer of questionsWithAnswers[i].answers) {
                console.log(answer.answer);
            }
        }, i * 1000);
    }

    for (let i = 0; i < questionsWithAnswers.length; i++) {
        dosetTimeout(i);
    }

});

describe("comprobador de respuestas", function () {
    const questionWithAnswers = {
        id: 1,
        question: "¿Cuál es la capital de Portugal?",
        answers: [
            { id: 1, answer: "Faro", isCorrect: false, idQuestion: 1 },
            { id: 2, answer: "Oporto", isCorrect: false, idQuestion: 1 },
            { id: 3, answer: "Lisboa", isCorrect: true, idQuestion: 1 }
        ]
    };

    const exampleResponseCorrect = questionWithAnswers.answers[2];
    const exampleResponseIncorrect = questionWithAnswers.answers[1];
    const exampleResponseOfOtherQuestion = { id: 1, answer: "adfad", isCorrect: false, idQuestion: 2 };

    function isCorrect(question, userAnswer) {
        return userAnswer.isCorrect;
    }

    function isMemberOfQuestion(question, userAnswer) {
        return question.id === userAnswer.idQuestion;
    }

    // function showQuestion ()

    it("reconoce una respuesta correcta", function () {
        expect(isCorrect(questionWithAnswers, exampleResponseCorrect)).toBeTruthy();
    });
    it("reconoce una respuesta incorrecta", function () {
        expect(isCorrect(questionWithAnswers, exampleResponseIncorrect)).toBeFalsy();
    });
    it("detecta cuando la respuesta no pertenece a su pregunta", function () {
        expect(isMemberOfQuestion(questionWithAnswers, exampleResponseCorrect)).toBeTruthy();
        expect(isMemberOfQuestion(questionWithAnswers, exampleResponseIncorrect)).toBeTruthy();
        expect(isMemberOfQuestion(questionWithAnswers, exampleResponseOfOtherQuestion)).toBeFalsy();
    });
});
