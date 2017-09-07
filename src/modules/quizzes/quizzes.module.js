////////////
// IMPORT //
////////////

//import 'ngTable';
import '../../directives/addRow/ngTableAddRow.loader';
import quizzesConfig from './quizzes.config';
import QuizzesController from './quizzes.controller';

// import './quizzes.scss';


////////////
// EXPORT //
////////////

export default angular.module('qfap.quizzes', [
    'ngTable'
  ])
  .config(quizzesConfig)
  .controller('QuizzesController', QuizzesController)
  .name;