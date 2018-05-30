import createClient from './client.js';
import createGame from './game.js';


window.onload = function(){
  const questions = createClient();
  createGame(questions).start();
}
