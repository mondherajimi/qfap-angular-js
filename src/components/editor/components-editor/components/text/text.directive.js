////////////
// IMPORT //
////////////

import MediumEditor from 'mediumEditor';


///////////////
// DIRECTIVE //
///////////////

/*@ngInject*/
function textComponentDirective(EditorService) {

  return {
    require: ['ngModel', '^^componentsEditor'],
    restrict: 'C',
    link: function(scope, element, attrs, ctrls) {
      const ngModelCtrl = ctrls[0];
      const cpntEditorCtrl = ctrls[1];

      // we create only one instace MediumEditor for the whole editor
      if (!cpntEditorCtrl.cpntEditor) {
        cpntEditorCtrl.cpntEditor = new MediumEditor(cpntEditorCtrl.editorElements, cpntEditorCtrl.editorOptions);
      }
      // occurences of MediumEditor need to be destroyed before we set up new ones
      else {
        cpntEditorCtrl.cpntEditor.destroy();
      }

      // set up MediumEditor
      cpntEditorCtrl.editorElements.push(element[0]);
      cpntEditorCtrl.cpntEditor.setup();

      // init insert plugin
      if (cpntEditorCtrl.editorOptions.insertPlugin) {
        $(cpntEditorCtrl.editorElements).mediumInsert({
          editor: cpntEditorCtrl.cpntEditor,
          enabled: true,
          addons: cpntEditorCtrl.editorOptions.insertPlugin
        });
      }

      // render view model to view
      ngModelCtrl.$render = function() {
        // update DOM without removing controls
        element
          .children(':not(' + cpntEditorCtrl.controlsSelector + ')')
          .remove();
        element.prepend(ngModelCtrl.$viewValue || '<p><br></p>');

        let placeholder = cpntEditorCtrl.cpntEditor.getExtensionByName('placeholder');
        if (placeholder) {
          placeholder.updatePlaceholder(element[0]);
        }
      };

      scope.updateModel = function($element) {
        const cleanedContent = cpntEditorCtrl.cleanContent($element);
        ngModelCtrl.$setViewValue(cleanedContent);
      };

      // read view to update view model
      cpntEditorCtrl.cpntEditor.subscribe('editableInput', function (event, editable) {
        scope.updateModel(angular.element(editable));

        cpntEditorCtrl.parseText();
      });

      // check if editor content is empty
      ngModelCtrl.$isEmpty = function(value) {
        if (/[<>]/.test(value)) {
          return EditorService.toInnerText(value).length === 0;
        }
        else if (value) {
          return value.length === 0;
        }
        else {
          return true;
        }
      };

      // // update editor if options changed
      // scope.$watch('config', function(config) {
      //   options = EditorService.parseOptions(config);
      //   ngModelCtrl.basicEditor.init(element, options);
      // });

      // destroy editor
      element.on('$destroy', function() {
        console.log('DESTROY TEXT COMPONENT')
      });
    }
  };
}


////////////
// EXPORT //
////////////

export default textComponentDirective;
