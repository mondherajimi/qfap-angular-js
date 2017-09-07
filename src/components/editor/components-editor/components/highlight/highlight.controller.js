////////////
// IMPORT //
////////////

// load template in templateCache
import '!ngtemplate?relativeTo=/src/components/editor/components-editor/components/highlight/&prefix=component/!html!./highlight.html';


////////////////
// CONTROLLER //
////////////////

class HighlightComponentController {

  /*@ngInject*/
  constructor($uibModalInstance, ModalService, params) {
    this.$uibModalInstance = $uibModalInstance;
    this.ModalService = ModalService;

    this.type = 'highlight';
    this.jsonTpl = {
      title: '',
      text: ''
    };

    this.editorConfig = {};

    this.init(params);
  }

  // Initialize component
  init(params) {
    this.$cpnt = params.$element;
    this.data = params.structure ? _.clone(params.structure.data) : this.jsonTpl;
    this.showDelete = !!params.structure;
  }

  // Get or set title input value
  getSetTitle(title) {
    // set with a valid title
    if (arguments.length) {
      this.data.title = title;
    }
    // get or invalid title
    else {}

    return this.data.title;
  }


  //////////////////////
  // MANAGE COMPONENT //
  //////////////////////

  // Update or insert component
  update() {
    const updateData = {
      $element: this.$cpnt
    };

    // update
    if (this.showDelete) {
      updateData.method = 'update';
      updateData.structure = this.data;
    }
    // insert
    else {
      updateData.method = 'create';
      updateData.structure = {
        type: this.type,
        data: this.data
      };
    }

    this.$uibModalInstance.close(updateData);
  }

  // Delete component
  delete() {
    this.ModalService.confirm({
      text: 'Êtes-vous sûr de vouloir supprimer ce composant ?'
    })
    .result.then(
      (success) => {
        this.$uibModalInstance.close({
          method: 'destroy',
          $element: this.$cpnt
        });
      },
      (error) => { }
    );
  }

}


////////////
// EXPORT //
////////////

export default HighlightComponentController;
