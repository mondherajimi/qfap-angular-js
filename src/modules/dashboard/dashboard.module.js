////////////
// IMPORT //
////////////

import 'ngTable';
import 'algoliasearch';
import uiBootstrap from 'uiBootstrap';

import dashboardConfig from './dashboard.config';
import DashboardController from './dashboard.controller';
import MessagesmodalController from './messagesmodal.controller';
import ChoisirmodalController from './choisirmodal.controller';

// import './dashboard.scss';


////////////
// EXPORT //
////////////

export default angular.module('qfap.dashboard', [
    'ngTable',
    'algoliasearch',
    uiBootstrap
  ])
  .config(dashboardConfig)
  .controller('DashboardController', DashboardController)
  .controller('MessagesmodalController', MessagesmodalController)
  .controller('ChoisirmodalController', ChoisirmodalController)
  .name;