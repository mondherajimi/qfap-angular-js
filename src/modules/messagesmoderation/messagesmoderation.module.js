////////////
// IMPORT //
////////////

import '../../directives/addRow/ngTableAddRow.loader';

import messagesmoderationConfig from './messagesmoderation.config';
import MessagesmoderationController from './messagesmoderation.controller';


////////////
// EXPORT //
////////////

export default angular.module('qfap.messagesmoderation', [
    'ngTable'
  ])
  .config(messagesmoderationConfig)
  .controller('MessagesmoderationController', MessagesmoderationController)
  .name;
