////////////
// IMPORT //
////////////

// load template in templateCache
import '!ngtemplate?relativeTo=/src/components/editor/components-editor/components/image/&prefix=component/!html!./image.html';

//import MediaLibraryService from '../../../../media-library/mediaLibrary.service';

////////////////
// CONTROLLER //
////////////////

class ImageComponentController {

  /*@ngInject*/
  constructor($http, $log, $scope, Api, $uibModalInstance, ModalService, MediaLibraryService, params, $filter) {
    this.$http = $http;
    this.$log = $log;
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.ModalService = ModalService;
    this.Api = Api;
    this.MediaLibraryService = MediaLibraryService;
    this.$filter = $filter;

    this.type = 'image';
    this.jsonTpl = {
      title: '',
      url: '',
      block: '',
      cookie: false
    };

    this.events = {
      loading: false,
      errorMsg: false
    };

    this.init(params);
  }

  // Initialize component
  init(params) {
    this.$cpnt = params.$element;
    this.data = params.structure ? params.structure.data : this.jsonTpl;
    this.showDelete = !!params.structure;
    
    this.$scope.data=this.data;
    
    
    this.Api
    	.get('/medias/'+this.data.id)
    	.then((media) => {
    		this.$scope.media=media;
    	});
    	
  this.$scope.$watch('data.size',  (size) => {
  
 
  	this.$scope.data.src = this.$scope.data.src.replace(/\?w=\w+/,'');
  	if (size) {
  		this.$scope.data.src += '?w='+size;  	
  		}
  });
  
	this.$scope.$watch('data.align',  (align) => {
  
  	
 
  	this.$scope.data.modifiers = [];
  	if (align) {
  		console.log(align);
  		this.$scope.data.modifiers = [align]; 
  		}
  		
  	console.log(this.$scope.data);
  	
  });
    	
    
  }
  


  //////////////////
  // UPDATE //
  //////////////////
  replace() {

  this.MediaLibraryService
        .getMedia()
		.then( (image) => {

			this.$scope.data.id = image.id;
			this.$scope.data.src = this.$filter('path')(image, this.$scope.data.size);
			this.$scope.data.alt = image.alt;
			this.$scope.data.credit = image.credit;
			
 		   this.Api
    		.get('/medias/'+image.id)
    		.then((media) => {
    			this.$scope.media=media;
    		});			
			
		})

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
    
    console.log('update');

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

export default ImageComponentController;
