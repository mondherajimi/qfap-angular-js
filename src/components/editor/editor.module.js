////////////
// IMPORT //
////////////

import { EDITOR_TYPE, EDITOR_CONFIG } from './editor.constant';
import EditorService from './editor.service';

// basic editor & inline editor
import basicEditorDirective from './basicEditor.directive';

// components editor
import componentsEditorModule from './components-editor/componentsEditor.module';


////////////
// EXPORT //
////////////

export default angular.module('qfap.editor', [
    componentsEditorModule
  ])
  .constant('EDITOR_TYPE', EDITOR_TYPE)
  .constant('EDITOR_CONFIG', EDITOR_CONFIG)
  .service('EditorService', EditorService)
  .directive('basicEditor', basicEditorDirective)
  .directive('inlineEditor', basicEditorDirective) // sharing directive code is ok for now
  .name;