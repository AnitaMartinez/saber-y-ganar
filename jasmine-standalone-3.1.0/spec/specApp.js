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
           (3 puntos, undefined, 21) -> 0
*
*
* */

describe('calculo de marcador', function () {
    function recalcularMarcador(puntos, esCorrecta, tiempo) {
        switch (true) {
            case esCorrecta && (tiempo <= 2): return puntos + 2;
            case esCorrecta && (tiempo <= 10): return puntos + 1;
            case esCorrecta && (tiempo > 10): return puntos;
            case !esCorrecta && (tiempo > 20): return puntos - 3;
            case !esCorrecta && (tiempo > 10): return puntos - 2;
            case !esCorrecta && (tiempo <= 20): return puntos - 1;
            default: ;
        }
    }

    it("suma más puntos si acierta muy rápido", function () {
        expect(recalcularMarcador(0, true, 1)).toBe(2);
        expect(recalcularMarcador(2, true, 1)).toBe(4);
    });
    it("suma punto si acierta rápido", function () {
        expect(recalcularMarcador(1, true, 5)).toBe(2);
        expect(recalcularMarcador(1, true, 3)).toBe(2);
    });
    it("no suma puntos si acierto muy lento", function () {
        expect(recalcularMarcador(1, true, 11)).toBe(1);
        expect(recalcularMarcador(5, true, 18)).toBe(5);
    });
    it("resta más puntos si fallo muy lento", function () {
        expect(recalcularMarcador(2, false, 11)).toBe(0);
        expect(recalcularMarcador(0, false, 18)).toBe(-2);
    });
    it("resta punto si fallo lento", function () {
        expect(recalcularMarcador(1, false, 3)).toBe(0);
        expect(recalcularMarcador(10, false, 10)).toBe(9);
    });
    it("resta puntos si no contesto en mucho tiempo", function () {
        expect(recalcularMarcador(3, false, 21)).toBe(0);
    });
    it("resta puntos si no contesto en 20 segundos", function () {
        expect(recalcularMarcador(3, undefined, 21)).toBe(0);
    });
});