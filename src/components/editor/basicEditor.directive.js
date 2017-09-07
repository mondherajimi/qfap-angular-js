////////////
// IMPORT //
////////////

import MediumEditor from 'mediumEditor';


///////////////
// DIRECTIVE //
///////////////

/*@ngInject*/
function basicEditorDirective(EditorService) {

  return {
    require: 'ngModel',
    restrict: 'E',
    scope: {
      config: '<?'
    },
    link: function(scope, element, attrs, ngModelCtrl) {

      let options = EditorService.parseOptions(scope.config);

      if (!ngModelCtrl.basicEditor) {
        ngModelCtrl.basicEditor = new MediumEditor(element, options);
      }

      // render view model to view
      ngModelCtrl.$render = function() {
        element.html(ngModelCtrl.$viewValue || "");

        let placeholder = ngModelCtrl.basicEditor.getExtensionByName('placeholder');
        if (placeholder) {
          placeholder.updatePlaceholder(element[0]);
        }
      };

      // read view to update view model
      ngModelCtrl.basicEditor.subscribe('editableInput', function (event, editable) {
        ngModelCtrl.$setViewValue(editable.innerHTML.trim());
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

      // update editor if options changed
      scope.$watch('config', function(config) {
        options = EditorService.parseOptions(config);
        ngModelCtrl.basicEditor.init(element, options);
      });

      // destroy editor
      element.on('$destroy', function() {
        ngModelCtrl.basicEditor.destroy();
      });
    }
  };
}


////////////
// EXPORT //
////////////

export default basicEditorDirective;
