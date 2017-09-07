////////////
// IMPORT //
////////////

import uiBootstrap from 'uiBootstrap';

import { MODAL_CONFIG } from './modal.constant';
import ModalService from './modal.service';
import ModalController from './modal.controller';


////////////
// EXPORT //
////////////

export default angular.module('qfap.modal', [
    uiBootstrap
  ])
  .constant('MODAL_CONFIG', MODAL_CONFIG)
  .service('ModalService', ModalService)
  .controller('ModalController', ModalController)
  .name;