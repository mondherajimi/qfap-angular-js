////////////
// IMPORT //
////////////

// load template in templateCache
import '!ngtemplate?relativeTo=/src/components/editor/components-editor/components/verbatim/&prefix=component/!html!./verbatim.html';


////////////////
// CONTROLLER //
////////////////

class VerbatimComponentController {

  /*@ngInject*/
  constructor($uibModalInstance, ModalService, params) {
    this.$uibModalInstance = $uibModalInstance;
    this.ModalService = ModalService;

    this.type = 'verbatim';
    this.jsonTpl = {
      quote: '',
      author: ''
    };

    // 3 for " " characters
    this.maxLength = 140 - 3;

    this.init(params);
  }

  // Initialize component
  init(params) {
    this.$cpnt = params.$element;
    this.data = params.structure ? _.clone(params.structure.data) : this.jsonTpl;
    this.showDelete = !!params.structure;
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

export default VerbatimComponentController;
