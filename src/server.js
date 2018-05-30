const express = require('express');
const app = express();

// CONFIGURATION:
app.use(express.static('src'));
app.set('view engine', 'pug');
app.set('views', 'views');

// ROUTES:
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/api/questions', (request, response) => {
    let questions = [
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
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(questions));
});

// START APP
app.listen(3000, () => console.log('Example app listening on port 3000!'))
