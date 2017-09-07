////////////
// IMPORT //
////////////

// medium-editor insert plugin
import insertPluginModule from './insert-plugin/insertPlugin.module';

// components editor
import { COMPONENTS_EDITOR_CONFIG, INSERT_PLUGIN_CONFIG } from './componentsEditor.constant';
import componentsEditorComponent from './componentsEditor.component';

// components
import componentTextDirective from './components/text/text.directive';
import ComponentPlaceController from './components/place/place.controller';
import ComponentVerbatimController from './components/verbatim/verbatim.controller';
import ComponentVideoController from './components/video/video.controller';
import ComponentImageController from './components/image/image.controller';
import ComponentHtmlController from './components/html/html.controller';
import ComponentHighlightController from './components/highlight/highlight.controller';
import ComponentQuizController from './components/quiz/quiz.controller';
import PlaceParisienComponentController from './components/place-parisien/place-parisien.controller';

////////////
// EXPORT //
////////////

export default angular.module('qfap.editor.components', [
    insertPluginModule
  ])
  .constant('COMPONENTS_EDITOR_CONFIG', COMPONENTS_EDITOR_CONFIG)
  .constant('INSERT_PLUGIN_CONFIG', INSERT_PLUGIN_CONFIG)
  .component('componentsEditor', componentsEditorComponent)
  .directive('componentText', componentTextDirective)
  .controller('ComponentPlaceController', ComponentPlaceController)
  .controller('ComponentVerbatimController', ComponentVerbatimController)
  .controller('ComponentVideoController', ComponentVideoController)
  .controller('ComponentImageController', ComponentImageController)
  .controller('ComponentHtmlController', ComponentHtmlController)  
  .controller('ComponentHighlightController', ComponentHighlightController)
  .controller('ComponentQuizController', ComponentQuizController)
  .controller('PlaceParisienComponentController', PlaceParisienComponentController)
  .name;