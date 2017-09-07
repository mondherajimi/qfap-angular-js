////////////
// HELPER //
////////////

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}


////////////
// IMPORT //
////////////

import uiBootstrap from 'uiBootstrap';

import pagesConfig from './pages.config';
import PagesService from './pages.service';
import PagesController from './pages.controller';

import ArticleController from './article/article.controller';
import ArticleControlsController from './article/article.controls.controller';
import RecordController from './record/record.controller';
// import RecordControlsController from './record/record.controls.controller';

import fichesModule from './fiches/fiches.module.js';

// Set pages templates:
// Require all html templates in ./partials folder.
// Pages templates are stored in 'pages/<template>.html' $templateCache key.
requireAll(require.context("!ngtemplate?relativeTo=/src/modules/pages/partials/&prefix=pages/!html!./partials", true, /\.html$/));


////////////
// EXPORT //
////////////

export default angular.module('qfap.pages', [
    uiBootstrap,

    fichesModule
  ])
  .config(pagesConfig)
  .service('PagesService', PagesService)
  .controller('PagesController', PagesController)
  .controller('ArticleController', ArticleController)
  .controller('ArticleControlsController', ArticleControlsController)
  .controller('RecordController', RecordController)
  // .controller('RecordControlsController', RecordControlsController)
  .name;