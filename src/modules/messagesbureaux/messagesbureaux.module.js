////////////
// IMPORT //
////////////

import '../../directives/addRow/ngTableAddRow.loader';

import messagesbureauxConfig from './messagesbureaux.config';
import MessagesbureauxController from './messagesbureaux.controller';


////////////
// EXPORT //
////////////

export default angular.module('qfap.messagesbureaux', [
    'ngTable'
  ])
  .config(messagesbureauxConfig)
  .controller('MessagesbureauxController', MessagesbureauxController)
  .name;
