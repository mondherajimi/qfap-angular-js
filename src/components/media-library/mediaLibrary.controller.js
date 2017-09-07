////////////////
// CONTROLLER //
////////////////

class MediaLibraryController {

  /*@ngInject*/
  constructor($scope, $uibModalInstance, $filter, Api, USER_ACCESS, UserService, Upload, options, StaticData) {
    this.Api = Api;
    this.UserService = UserService;
    this.USER_ACCESS = USER_ACCESS;
    $scope.UserService = UserService;
    
    this.Upload = Upload;
    this.StaticData = StaticData;
    
    
    var infobulles = this.StaticData.getInfobulles();
    if (infobulles.then)
    	{
    	infobulles.then(function (response) {
  		  	$scope.infobullesCredits=_.filter(response, {'field':'credits','type':'media'})[0].text;
    		$scope.infobullesAlt=_.filter(response, {'field':'alt','type':'media'})[0].text;
    		$scope.infobullesKeywords=_.filter(response, {'field':'tag','type':'media'})[0].text;
    		})  
    	}
	else
    	{
    	$scope.infobullesCredits=_.filter(infobulles, {'field':'credits','type':'media'})[0].text;
    	$scope.infobullesAlt=_.filter(infobulles, {'field':'alt','type':'media'})[0].text;
    	$scope.infobullesKeywords=_.filter(infobulles, {'field':'tag','type':'media'})[0].text;
    	} 
  
      
    const TYPES = [
                          {
                          type: 'image',
                          subtype: 'png',
                          mimeType: 'image/png',
                          ext: [ '.png' ]
                          },
                          {
                          type: 'image',
                          subtype: 'jpeg',
                          mimeType: 'image/jpeg',
                          ext: [ '.jpg', '.jpeg' ]
                          },
                          {
                          type: 'image',
                          subtype: 'gif',
                          mimeType: 'image/gif',
                          ext: [ '.gif' ]
                          },
                          {
                          type: 'video',
                          subtype: 'mp4',
                          mimeType: 'video/mp4',
                          ext: [ '.mp4', '.m4v' ]
                          },
                          {
                          type: 'video',
                          subtype: 'ogg',
                          mimeType: 'video/ogg',
                          ext: [ '.ogv' ]
                          },
                          {
                          type: 'video',
                          subtype: 'webm',
                          mimeType: 'video/webm',
                          ext: [ '.webm' ]
                          },
                          {
                          type: 'application',
                          subtype: 'pdf',
                          mimeType: 'application/pdf',
                          ext: [ '.pdf' ]
                          }
                   ];


    // Array of fetched medias
    $scope.medias = [];

    // Current user id
    var uid = UserService.getId();
    $scope.uid = uid;

    // Current user groupe
    var user_group = UserService.getGroup();
    $scope.user_group = user_group;

    // Initialisation recherche à vide
    $scope.query = {
      keyword: ''
    };

    // Initialisation flag recherche en cours
    $scope.requestInProgress = false;

    // Onglet par défaut
    $scope.tab = 'mesimages';

    // Mode par défaut
    $scope.mode = 'search';

    // Gestion de l'affichage des onglets de la modal
    var auth_groupes = [11,5,10,4,2,8];
    
    

    // Onglet "Mes images"
    $scope.mesimages_auth = false;
    if (UserService.isContributor() || UserService.isModerator() || UserService.isRedactor() || UserService.isAdmin()) {
      $scope.mesimages_auth = true;
      $scope.onlyCurrentUser = true;
    }

    // Onglet "Mon groupe"
    $scope.mongroupe_auth = false;
    if ((_.indexOf(auth_groupes, user_group) >= 0) && (UserService.isContributor() || UserService.isModerator())) {
      $scope.mongroupe_auth = true;
    }

    // Onglet "Tout"
    $scope.tout_auth = false;
    if (UserService.isRedactor() || UserService.isAdmin()) {
      $scope.tout_auth = true;
    }

    // Onglet "Par défaut"
    $scope.defaut_auth = false;
    if (UserService.isContributor() || UserService.isModerator()) {
      $scope.defaut_auth = true;
    }
    


    var token= (UserService.user && UserService.user.token)? UserService.user.token : '';
    
    $scope.canInsert = options.canInsert !== undefined ? !!options.canInsert : true;
    
    
    

    	

	
    /**
     * Change tab
     */
    function switchTab(tab) {
      $scope.fetchMedias(false);
    }
    $scope.$watch('tab', switchTab);


    /**
     * Change mode
     */
    function switchMode(mode) {
    	console.log('change mode');
    	if (!$scope.medias.length) {
      		$scope.fetchMedias();
      	}
      	if (mode==='replace') {
      		console.log('replace');
      	}
      
    }
    $scope.$watch('mode', switchMode);
    
    
    
    
    // Pagination parameters
    $scope.itemsPerPage = 6;
    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.maxSize = 5;
    
      
      /**
       * Reset media to upload properties
       */
      function resetMediaToUpload() {
          $scope.mediaToUpload = {};
          $scope.mediaToUpload.files = [];
      }      
      

    /**
     * Fetch media from the api using keyword
     */
    $scope.fetchMedias = function fetchMedias() {
        $scope.requestInProgress = true;

        var query = {
          skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
          limit: $scope.itemsPerPage
        };

       

        var where = {};

        if ($scope.query.keyword) {
          where.or = [
            { keywords: { contains: $scope.query.keyword } },
            { alt: { contains: $scope.query.keyword } },
            { credit: { contains: $scope.query.keyword } }
          ];
        }

        if ($scope.tab == 'mesimages') {
          where.createdBy = uid;
        }

        if ($scope.tab == 'mongroupe') {
          where.idGroupes = user_group;
        }

        if (($scope.tab == 'default') && (_.indexOf(auth_groupes, user_group) >= 0)) {
          where.isDefault = 1;
          where.idGroupes = user_group;
        }

        if (($scope.tab == 'default') && (_.indexOf(auth_groupes, user_group) < 0)) {
          where.isDefault = 1;
          where.idGroupes = 0;
        }

        query.where = where;

        Api
          .get('/medias/findWithCount', { params: query })
          .success(function(data) {
            $scope.requestInProgress = false;
            console.log(data);
            $scope.medias = data.records;
            $scope.totalItems = data.count;
            console.log("currentPage " + $scope.currentPage);
            console.log("totalItems " + $scope.totalItems);
          })
          .error(function(err) {
            console.error(err);
            $scope.requestInProgress = false;
            $scope.errorMsg = 'Erreur lors de la récuperation des medias';
          });
    };



    /**
    * Update the thumbnail preview
    */
      $scope.updatePreview = function updatePreview($files, $e) {
          $scope.uploadErrorMsg = false;
          if ($e.type !== 'change') { return; }
          
          if (!$files || $files.length === 0) {
              $scope.$evalAsync(function() {
                                resetMediaToUpload();
                                });
              
              if ($e.type === 'change') {
                  $scope.uploadErrorMsg = true;
              }
              
              return;
          }
          
          resetMediaToUpload();
          
          angular.forEach($files, function (file, index) {
                          var fileType = _.find(TYPES, { mimeType: file.type });
                          
                          if (!fileType) {
                          $scope.uploadErrorMsg = true;
                          
                          return;
                          }
                          
                          if (fileType.type !== 'image') {
                          $scope.$evalAsync(function() {
                                            file.mimeType = file.type;
                                            
                                            });
                          }
                          else {
                          var reader = new FileReader();
                          reader.onload = function(e) {
                          $scope.$evalAsync(function() {
                                            file.mimeType = file.type;
                                            
                                            if ($scope.mode === 'create') {
                                            }
                                            else {
                                            
                                            if ($scope.mediaToEdit.alt) {
                                           		file.alt = $scope.mediaToEdit.alt;
                                            }
                                            if ($scope.mediaToEdit.credit) {
                                           		file.credit = $scope.mediaToEdit.credit;
                                            }
                                            
                                            if ($scope.mediaToEdit.keywords)
                                           		file.keywords = $scope.mediaToEdit.keywords;
                                            }
                                            
                                            file.src = e.target.result;
                                            });
                          };
                          
                          reader.readAsDataURL(file);
                          }
                          
                          $scope.mediaToUpload.files[index] = file;
                          });
      };
      
      
      /**
       * Upload a new media to the server
       */
      $scope.upload = function upload() {
          if (!$scope.mediaToUpload.files) {
              return;
          }
          
          
          var metadatas =[];
          
          if ($scope.mode === 'replace' && $scope.mediaToEdit.id) {
              metadatas.id = $scope.mediaToEdit.id;
          }
          
          angular.forEach($scope.mediaToUpload.files, function (file, index) {
          
          

          
          	var t={
                                                      fileName: file.name,
                                                      keywords: _.map(file.keywords,'text').join(','),
                                                      credit: file.credit,
                                                      alt: file.alt,
                                                      mimeType: file.mimeType,
                                                      createdBy: uid
                                                      };
            
            
          
                          metadatas.push(_.omitBy(t, _.isNil));
                          });
          
          
          console.log($scope.mediaToUpload.files);
          console.log(metadatas);
          
          Upload
          .upload({
                  url: window.qfapBO.env.api.url + '/Medias',
                  arrayKey:'',//Tips
                  objectKey:'.k',
                  method:'POST',
                  data:{
                  	token: token,
                  	fields: metadatas,
                  	file: $scope.mediaToUpload.files,                  	
                  	}
                  })
          .success(function() {
                   $scope.medias = [];
                   $scope.mode = 'search';
                   
                   $scope.searchCache = new Date().getTime();
                   resetMediaToUpload();
                   })
          .error(function(err) {
                 console.error(err);
                 $scope.errorMsg = 'Erreur lors du téléchargement du média.';
                 });
      };

    /**
	* Edit media
	*/
	$scope.edit = function edit(media) {
	
	
	var query = {
          populate: 'createdBy,updatedBy'
        };
	
        Api
          .get('/medias/loadMedia/' + media.id, { params: query })
          .success(function(data) {
          
          

            data.keywords=$filter('keywords')(data.keywords);//convert string to array
            $scope.mode = 'edit';
            $scope.mediaToEdit = data;
            $scope.editCache = new Date().getTime();
            
          })
          .error(function(err) {
            console.error(err);
            $scope.errorMsg = 'Erreur lors de la récuperation du media';
          });
	
	
	}  


  /**
   * Update edited media to the server
   */
  $scope.update = function update() {
  
    var data = _.pick($scope.mediaToEdit, 'alt', 'credit');
    data.keywords=_.map($scope.mediaToEdit.keywords, 'text').join(',');
    
    data.updatedAt = new Date();
    data.updatedBy = uid;

    Api
      .post('/medias/' + $scope.mediaToEdit.id, data)
      .success(function(media) {
        $scope.mediaToEdit.updatedAt = media.updatedAt;
        $scope.mediaToEdit.updatedBy = media.updatedBy;

        $scope.medias = [];
        $scope.mode = 'search';
      })
      .error(function(err) {
        console.error(err);
        $scope.errorMsg = 'Erreur lors de la mise a jour du media';
      });
  };

  /**
   * Remove a media from the database
   * @param media
   */

  $scope.remove = function remove(media) {
    if (window.confirm('Etes vous sur de vouloir supprimer ce media ?')) {
      Api
        .delete('/medias/' + media.id)
        .success(function() {
          $scope.medias = [];
          $scope.mode = 'search';
        })
        .error(function(err) {
          console.error(err);
          $scope.errorMsg = 'Erreur lors de la suppression du media';
        });
    }
  };


    /**
    * Select media
    */
 	$scope.select = function select(media) {
 		$uibModalInstance.close(media);
 	}


  };
    
    
  
    


}


////////////
// EXPORT //
////////////

export default MediaLibraryController;