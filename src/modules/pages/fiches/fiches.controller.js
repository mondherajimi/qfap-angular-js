// IMPORT
import '!ngtemplate?relativeTo=/src/modules/pages/fiches/!html!./fiches.controls.html';
import sticky from './fiches.sticky.tpl.html';
import sectionQuoi from './fiches.section.quoi.tpl.html';
import sectionOu from './fiches.section.ou.tpl.html';
import sectionQuandActivites from './fiches.section.quand.activites.tpl.html';
import sectionQuandEvenements from './fiches.section.quand.evenements.tpl.html';
import sectionQuandProgrammes from './fiches.section.quand.programmes.tpl.html';
import sectionModalites from './fiches.section.modalites.tpl.html';
import sectionContact from './fiches.section.contact.tpl.html';
import sectionFinaliser from './fiches.section.finaliser.tpl.html';

////////////////
// CONTROLLER //
////////////////


class FichesController {

    /*@ngInject*/
    constructor($window, $rootScope, $scope, $q, $state, $stateParams, $timeout, ENV, Api, AUTH_EVENTS, UserService, AuthService, ModalService, MediaLibraryService, pagesTypes, pagesStatus, toastr, categories, tags, infobulles, messages, algolia) {
        this.ENV = ENV;
        this.Api = Api;
        this.$state = $state;
        this.$scope = $scope;
        this.$q = $q;
        this.$timeout = $timeout;
        this.toastr = toastr;
        this.categories = categories;
        this.currentUser = UserService;
        this.tags = tags;
        this.infobulles = infobulles;
        this.messages = messages;
        this.pagesStatus = pagesStatus;
        this.ModalService = ModalService;
        this.MediaLibraryService = MediaLibraryService;
        this.ficheInit = {
            title:'',
            status:3,
            version:0,
            type: {
                id:0,
                title:''
            },
            weight:0,
            url:"",
            shortenedUrl:"",
            deleted:0,
            mainMedia:null,
            place:null,
            discipline:0,
            author:this.currentUser.user.id,
            components: [{
                  "type": "text",
                  "data": {
                    "block": ''
                  }
                }]
        };

        // ALGOLIA
        let client = algolia.Client(ENV.algolia.id, ENV.algolia.api_key);
        this.index = client.initIndex(ENV.algolia.index);

        this.editorConfigProgrammeEvenement = {
          insertPlugin: {
            // verbatim: false
          },
          toolbar: {
            buttons: [
                  {
                    name: 'h2',
                    action: 'append-h3',
                    aria: 'Titre de deuxième niveau',
                    tagNames: ['h3'],
                    contentFA: 'Titre 2',
                  },
                  {
                    name: 'h3',
                    action: 'append-h4',
                    aria: 'Titre de troisième niveau',
                    tagNames: ['h4'],
                    contentFA: 'Titre 3',
                  },
                  {
                    name: 'bold',
                    aria: 'Gras',
                    contentFA: 'G',
                  },
                  'italic',
                  'anchor',
                  'orderedlist',
                  'unorderedlist',
                  'removeFormat'
                ],

                static: true,
                sticky: true,
                stickyTopOffset: 110,
                updateOnEmptySelection: true
              }
        };

        this.editorConfigActivite = {
          insertPlugin: {
            // verbatim: false
          },
          toolbar: {
            buttons: [
                  {
                    name: 'h1',
                    action: 'append-h2',
                    aria: 'Titre de premier niveau',
                    tagNames: ['h2'],
                    contentFA: 'Titre 1',
                  },
                  {
                    name: 'h2',
                    action: 'append-h3',
                    aria: 'Titre de deuxième niveau',
                    tagNames: ['h3'],
                    contentFA: 'Titre 2',
                  },
                  {
                    name: 'h3',
                    action: 'append-h4',
                    aria: 'Titre de troisième niveau',
                    tagNames: ['h4'],
                    contentFA: 'Titre 3',
                  },
                  {
                    name: 'bold',
                    aria: 'Gras',
                    contentFA: 'G',
                  },
                  'italic',
                  'anchor',
                  'orderedlist',
                  'unorderedlist',
                  'removeFormat'
                ],

                static: true,
                sticky: true,
                stickyTopOffset: 110,
                updateOnEmptySelection: true
              }
        };


        this.events = {
          // saving: false,
          // saved: false,
          // publishing: false,
          // published: false
          // archiving: false
          // archived: false
        };

        this.STATUS = _.reduce(pagesStatus, (result, value, key) => {
          result[value.slug] = value.id;
          return result;
        }, {});


        // Edit
        if ($state.is('fiches.edit') && _.has($state.params, 'id')) {
            this.data = { id:$state.params.id};
            this.loadFiche($state.params.id);
        }
        // Create
        else {
            this.currentUser = UserService;
            this.isCreating = false;
            this.data = this.ficheInit;
            if($stateParams.type){
                this.data.type.id = $stateParams.type;
                this.getTypesFiches($stateParams.type);
            }
            if(this.data.type.id===2){
                this.data.activity = {
                        seances : [{
                            editable:true
                        }],
                    inscriptions:[{}]
                }
            }
            if(this.data.type.id===1 || this.data.type.id===3){
                this.data.event = {
                    periodes:[{
                        seances: [{
                            editable:true
                        }]
                    }],
                    exceptions:[{}]
                };
                this.data.tags = [];
                this.data.associe = [];
                this.data.pagesFriends = [];
            }
        }

        // Recherche lieux
        this.lieu = {
            q: '',
            results: [],
            newlieu:false
        };

        // Page friends, association d'un programme à une fiche
        this.associe = {q: '', results: [] };

        // Recherche discipline
        this.disciplines = this.getDisciplines();

        // Datepicker
        this.datepickerOptions = {
          format: 'yyyy-MM-dd',
          autoclose: true,
          weekStart: 0
        };
        this.datepickerFrom = false;
        this.datepickerTo = false;

        // Toast
        this.toastrOptions = {
            timeOut:0,
            closeButton:true
        };

        // Timepicker
        this.timepickerOptions = {
            hstep:1,
            mstep:1,
        };

        // Templates
        this.stickyTpl = sticky;
        this.sectionQuoiTpl = sectionQuoi;
        this.sectionOuTpl = sectionOu;
        this.sectionQuandActivitesTpl = sectionQuandActivites;
        this.sectionQuandEvenementsTpl = sectionQuandEvenements;
        this.sectionQuandProgrammesTpl = sectionQuandProgrammes;
        this.sectionModalitesTpl = sectionModalites;
        this.sectionContactTpl = sectionContact;
        this.sectionFinaliserTpl = sectionFinaliser;

        // Scroll sections
        this.scrollWindow($window);
    }


    loadFiche(idPages){
        this.data.id = idPages;
        let that = this;
        this.Api
            .get('/pages/loadFiche/'+idPages)
            .then((success) => {
                this.data = success.data;
                if(this.currentUser.user.role==1 || this.currentUser.user.role==2){
                    if(this.currentUser.user.id!=this.data.author.id){
                        that.$state.go('dashboard', {reload: true });
                    }
                }
                this.data.user = this.currentUser.user;
                this.data.tags =  _.map(this.data.tags,'id');
                console.log(this.data);
                if(!_.isUndefined(this.data.place) && this.data.place.id!==0){
                    this.lieu.q = this.data.place.name;
                    //this.metroBusVelibsLieux();
                }
                if(this.data.type.id==2){
                    this.data.activity.dateStart = this.data.activity.dateStart != '' && this.data.activity.dateStart !=null  ? new Date(this.data.activity.dateStart) : '';
                    this.data.activity.dateEnd = this.data.activity.dateEnd != '' && this.data.activity.dateEnd !=null ? new Date(this.data.activity.dateEnd) : '';
                     _.each(this.data.activity.inscriptions,function(inscription){
                        inscription.dateStart = new Date(inscription.dateStart);
                        inscription.dateEnd = new Date(inscription.dateEnd);
                    });
                    if(_.isEmpty(this.data.activity.seances)){
                        this.data.activity.seances.push({editable:true});
                    }
                    // Infobulles
                    if(this.currentUser.isUser() || this.currentUser.isContributor() || this.currentUser.isModerator() || this.currentUser.isRedactor() || this.currentUser.isAdmin()){
                        this.infobullesTitre = _.filter(this.infobulles, {'field':'titre','type':'fiche-activite'})[0].text;
                        this.infobullesImage = _.filter(this.infobulles, {'field':'image','type':'fiche-activite'})[0].text;
                        this.infobullesChapeau = _.filter(this.infobulles, {'field':'chapeau','type':'fiche-activite'})[0].text;
                        this.infobullesTexte = _.filter(this.infobulles, {'field':'texte','type':'fiche-activite'})[0].text;
                        this.infobullesOu = _.filter(this.infobulles, {'field':'où','type':'fiche-activite'})[0].text;
                        this.infobullesQuand = _.filter(this.infobulles, {'field':'quand','type':'fiche-activite'})[0].text;
                        this.infobullesModalites = _.filter(this.infobulles, {'field':'modalités','type':'fiche-activite'})[0].text;
                        this.infobullesContact = _.filter(this.infobulles, {'field':'contact','type':'fiche-activite'})[0].text;
                        this.infobullesDiscipline = _.filter(this.infobulles, {'field':'discipline','type':'fiche-activite'})[0].text;
                        this.infobullesPublication = _.filter(this.infobulles, {'field':'publication','type':'fiche-activite'})[0].text;
                    }
                }
                if(this.data.type.id==3){
                    this.data.event.realDateStart = this.data.event.realDateStart != '' && this.data.event.realDateStart != null ? new Date(this.data.event.realDateStart) : '';
                    this.data.event.realDateEnd = this.data.event.realDateEnd != '' && this.data.event.realDateEnd != null ? new Date(this.data.event.realDateEnd) : '';
                    // Infobulles
                    if(this.currentUser.isUser() || this.currentUser.isContributor() || this.currentUser.isModerator() || this.currentUser.isRedactor() || this.currentUser.isAdmin()){
                        this.infobullesTitre = _.filter(this.infobulles, {'field':'titre','type':'fiche-programme'})[0].text;
                        this.infobullesImage = _.filter(this.infobulles, {'field':'image','type':'fiche-programme'})[0].text;
                        this.infobullesChapeau = _.filter(this.infobulles, {'field':'chapeau','type':'fiche-programme'})[0].text;
                        this.infobullesTexte = _.filter(this.infobulles, {'field':'texte','type':'fiche-programme'})[0].text;
                        this.infobullesFinaliser = _.filter(this.infobulles, {'field':'finaliser','type':'fiche-programme'})[0].text;
                        this.infobullesAssocier = _.filter(this.infobulles, {'field':'associer','type':'fiche-programme'})[0].text;
                    }
                }
                if(this.data.type.id==1 || this.data.type.id ==3){
                    _.each(this.data.event.exceptions,function(exception){
                      exception.dateStart = exception.dateStart!==null && exception.dateStart!=='0000-00-00' ? new Date(exception.dateStart) : '';
                      exception.dateEnd = exception.dateEnd!==null && exception.dateEnd!=='0000-00-00' ? new Date(exception.dateEnd) : '';
                    });
                    if(_.isEmpty(this.data.event.periodes)){
                        this.data.event.periodes = [{}];
                    }
                    else {
                        _.each(this.data.event.periodes,function(periode){
                            periode.dateStart = new Date(periode.dateStart);
                            periode.dateEnd = new Date(periode.dateEnd);
                            _.each(periode.s,function(seance){
                                let hS = seance.hourStart.substr(0,2);
                                let mS = seance.hourStart.substr(3,2);
                                let hE = seance.hourEnd.substr(0,2);
                                let mE = seance.hourEnd.substr(3,2);
                                seance.hourStart = Moment().set({'hour':hS,'minutes':mS}).toDate();
                                seance.hourEnd = Moment().set({'hour':hE,'minutes':mE}).toDate();
                            });
                            periode.seances = periode.s;
                        });
                    }
                }
                // Infobulles Evenement Internaute
                if(this.data.type.id==1 && this.currentUser.isUser()){
                    this.infobullesTitre = _.filter(this.infobulles, {'field':'titre','type':'fiche-evenement-internautes'})[0].text;
                    this.infobullesImage = _.filter(this.infobulles, {'field':'image','type':'fiche-evenement-internautes'})[0].text;
                    this.infobullesChapeau = _.filter(this.infobulles, {'field':'chapeau','type':'fiche-evenement-internautes'})[0].text;
                    this.infobullesTexte = _.filter(this.infobulles, {'field':'texte','type':'fiche-evenement-internautes'})[0].text;
                    this.infobullesOu = _.filter(this.infobulles, {'field':'où','type':'fiche-evenement-internautes'})[0].text;
                    this.infobullesQuand = _.filter(this.infobulles, {'field':'quand','type':'fiche-evenement-internautes'})[0].text;
                    this.infobullesModalites = _.filter(this.infobulles, {'field':'modalités','type':'fiche-evenement-internautes'})[0].text;
                    this.infobullesContact = _.filter(this.infobulles, {'field':'contact','type':'fiche-evenement-internautes'})[0].text;
                    this.infobullesPublication = _.filter(this.infobulles, {'field':'publication','type':'fiche-evenement-internautes'})[0].text;
                    this.infobullesFinaliser = _.filter(this.infobulles, {'field':'finaliser','type':'fiche-evenement-internautes'})[0].text;
                    this.infobullesAssocier = _.filter(this.infobulles, {'field':'associer','type':'fiche-evenement-internautes'})[0].text;

                }
                // Infobulles Evenement
                if(this.data.type.id==1 && this.currentUser.isContributor()){
                    this.infobullesTitre = _.filter(this.infobulles, {'field':'titre','type':'fiche-evenement-pro'})[0].text;
                    this.infobullesImage = _.filter(this.infobulles, {'field':'image','type':'fiche-evenement-pro'})[0].text;
                    this.infobullesChapeau = _.filter(this.infobulles, {'field':'chapeau','type':'fiche-evenement-pro'})[0].text;
                    this.infobullesTexte = _.filter(this.infobulles, {'field':'texte','type':'fiche-evenement-pro'})[0].text;
                    this.infobullesOu = _.filter(this.infobulles, {'field':'où','type':'fiche-evenement-pro'})[0].text;
                    this.infobullesQuand = _.filter(this.infobulles, {'field':'quand','type':'fiche-evenement-pro'})[0].text;
                    this.infobullesModalites = _.filter(this.infobulles, {'field':'modalités','type':'fiche-evenement-pro'})[0].text;
                    this.infobullesContact = _.filter(this.infobulles, {'field':'contact','type':'fiche-evenement-pro'})[0].text;
                    //this.infobullesPublication = _.filter(this.infobulles, {'field':'publication','type':'fiche-evenement-pro'})[0].text;
                    this.infobullesFinaliser = _.filter(this.infobulles, {'field':'finaliser','type':'fiche-evenement-pro'})[0].text;
                    this.infobullesAssocier = _.filter(this.infobulles, {'field':'associer','type':'fiche-evenement-pro'})[0].text;

                }

                // Ecrire à l'admin si on est contrib ou à l'auteur de la fiche si on est admin
                if(this.currentUser.isContributor()){
                    this.ecrireA = {
                        mailto:'mailto:'+this.ENV.email.admin,
                        label:'Écrire à l\'admin'
                    };
                }
                if(this.currentUser.isModerator() || this.currentUser.isRedactor() || this.currentUser.isAdmin()){
                    this.ecrireA = {
                        mailto:'mailto:'+this.data.author.email,
                        label:'Écrire à l\'auteur'
                    };
                }


            },(reject) => {
                that.$state.go('dashboard', {reload: true });
            });
    }

    openMediaLib(_event, _target) {
        this.MediaLibraryService.getMedia({})
        .then((image) => {
            this.data.mainMedia = image;
        });
    };

    cpntEditorParse(structure, anchors) {
        this.data.components = structure;
        this.data.anchors = anchors;
        this.$scope.$digest();
    }

    /**
     * Get types fiches
     * @param  {int} idTypePages
     * 1 Evénement, 2 Activités, 3 Programme
     */
    getTypesFiches(id){
        this.Api
            .get('/pagestypes/'+id)
            .then((success) =>  {
              this.data.type = success.data;
            });
    }

    scrollWindow($window){
        $window.onscroll = function(){
            // Controls
            let scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
            let tags = ['quoi', 'ou', 'quand', 'modalites', 'contact', 'finaliser'];
            for (let i in tags) {
                let current_section_position = jQuery('#pages-section-' + tags[i]).offset().top-134;
                if (scrollPos > current_section_position) {
                  jQuery('.controls-panel-page a').removeClass('active');
                  jQuery('a[data-href=pages-section-' + tags[i] + ']').addClass('active');
                }
            }
        }
    }

    // Go to section
    navto(to){
        let speed = 750;
        let section = '#'+to;
        jQuery('html, body').animate( { scrollTop: jQuery(section).offset().top-124 }, speed );
    }


//ACTIVITES
    setAge(seance,type){
        switch(type){
            case 'adults':
                if(seance.adults==1){
                  seance.ageFrom = 18;
                  seance.ageTo = 100;
                }
                break;
            case 'ados':
                if(seance.teens==1){
                    seance.ageFrom = 11;
                    seance.ageTo = 18;
                }
                break;
            case 'enfants':
                if(seance.children==1){
                    seance.ageFrom = 0;
                    seance.ageTo = 12;
                }
                break
        }
        if(seance.adults==1 && seance.children==1 && seance.teens==1){
            seance.ageFrom = 0;
            seance.ageTo = 100;
        }
    }

    checkSeance(seance){
        let valid = true;
        if(_.isUndefined(seance.day) || _.isUndefined(seance.hourStart) || _.isUndefined(seance.hourEnd)){
            valid=false;
            let message = 'Veuillez choisir un ou plusieurs jours ainsi qu\'une heure de début et une heure de fin';
            this.toastr.error(message, this.toastrOptions);
        }
        return valid;
    }

    validSeance(seance){
        if(this.checkSeance(seance)){
            seance.editable = false;
        }
    }

    addSeance(){
        if(this.data.activity.seances.length===0){
            this.data.activity.seances.push({editable:true});
        }
        else if(this.checkSeance(_.last(this.data.activity.seances))) {
            this.validSeance(_.last(this.data.activity.seances));
            this.data.activity.seances.push({editable:true});
        }
        else {
            //
        }
    }

    deleteSeance(seance){
        if(confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')){
            let index = this.data.activity.seances.indexOf(seance);
            this.data.activity.seances.splice(index,1);
        }
    }

// EVENEMENT
    periodeMode(periode,type){
        if(type==='unique'){
            periode.isDateMultiples=1;
            // erase seances
            periode.seances = [{
                editable:true
            }];
            periode.dateEnd = periode.dateStart;
        }
        else {
            periode.isDateMultiples=2;
            periode.dateEnd = '';
            periode.seances = [{
                editable:true
            }];
        }
    }

    setDay(periode){
        // periode unique
        if(periode.isDateMultiples==1){
            periode.dateEnd = periode.dateStart;
            //let j = Moment(periode.dateStart).format('dddd');
            let d = Moment(periode.dateStart).day();
            console.log(periode);
            periode.seances[0].day = {

            };
        }
    }

    checkPeriode(periode){
        let valid = true;
        if(_.isUndefined(periode.dateStart) || _.isUndefined(periode.dateEnd)){
            valid=false;
            let message = 'Veuillez valider la période en cours avant d\'en ajouter une nouvelle';
            this.toastr.error(message, this.toastrOptions);
        }
        return valid;
    }

    addPeriode(){
        if(_.isUndefined(this.data.event.periodes) || _.isEmpty(this.data.event.periodes)){
            this.data.event.periodes = [{
                seances:[{editable:true}]
            }]
        }
        else if(this.checkPeriode(_.last(this.data.event.periodes))) {
            this.data.event.periodes.push({
                seances:[{editable:true}]
            });
        }
        else {

        }
    }

    deletePeriode(periode){
         if(confirm('Êtes-vous sûr de vouloir supprimer cette période?')){
            let index = this.data.event.periodes.indexOf(periode);
            this.data.event.periodes.splice(index,1);
        }
    }

    duplicatePeriode(periode){
        let clone = angular.copy(periode);
        delete clone.id;
        _.each(clone.seances,function(s){
            delete s.idEvenementsPeriodes;
            delete s.id;
        });
        this.data.event.periodes.push(clone);
    }

    checkSeanceEvenement(seance){
        let valid = true;
        if(_.isUndefined(seance.hourStart) || _.isUndefined(seance.hourEnd) || _.isUndefined(seance.day)){
            valid=false;
            let message = 'Veuillez compléter la séance';
            this.toastr.error(message, this.toastrOptions);
        }
        return valid;
    }

    validSeanceEvenement(seance){
        if(this.checkSeanceEvenement(seance)){
            seance.editable=false;
        }
    }

    addSeanceEvenement(periode){
        if(periode.seances.length===0){
            periode.seances.push({editable:true});
        }
        else if(this.checkSeanceEvenement(_.last(periode.seances))) {
            periode.seances.push({editable:true});
        }
        else {

        }
    }

    deleteSeanceEvenement(seance,periode){
        if(confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')){
            let index = periode.seances.indexOf(seance);
            periode.seances.splice(index,1);
        }
    }

    openException(){
        this.data.event.showExceptions = 1;
        this.addException();
    }

    addException(){
        this.data.event.exceptions.push({});
    }

    deleteException(exception){
         if(confirm('Êtes-vous sûr de vouloir supprimer cette fermeture ?')){
            let index = this.data.event.exceptions.indexOf(exception);
            this.data.event.exceptions.splice(index,1);
        }
    }

// ASSOCIE FICHE
    searchAssocieFiche(){
        let facetFilters = '(idPagesTypes:1,idPagesTypes:3)';
        // Algolia
        this.index
          .search(this.associe.q,{hitsPerPage:10,page:0,facetFilters})
          .then(
            (content) => {
              this.associe.results = content.hits;
            },
            (error) => {
              console.error(error)
            });
    }

    deleteAssocieFiche(fiche){
         if(confirm('Êtes-vous sûr de retirer cette fiche ?')){
            let index = this.data.pagesFriends.indexOf(fiche);
            this.data.pagesFriends.splice(index,1);
            let that = this;
            let f = [];
            this.Api
                .get('/pagesfriendsliaisons/',{idPages:this.data.id,idPagesFriends:fiche.id})
                .then((success) => {
                    if(!_.isEmpty(success.data)){
                        f.push(success.data[0].id);
                    }
                    that.Api
                        .get('/pagesfriendsliaisons/',{idPages:fiche.id,idPagesFriends:that.data.id})
                        .then((success) => {
                            if(!_.isEmpty(success.data)){
                                f.push(success.data[0].id);
                            }
                            if(!_.isEmpty(f)){
                               that.Api
                                .delete('/pagesfriendsliaisons/',{id:f})
                                .then((success) => {
                                    console.log(success);
                                });
                            }

                        });

                });
        }
    }

    selectAssocieFiche(fiche){
        let that = this;
        let insertFiche;
        if(_.map(this.data.pagesFriends,'id').indexOf(fiche.objectID) === -1){
          this.Api
            .get('/pages/'+fiche.objectID,{populate:['event','place']})
            .then((success) => {
                insertFiche = success.data;
                //this.data.pagesFriends.push(insertFiche);

                if(!_.isUndefined(success.data.event)){
                   insertFiche.event.realDateStart = success.data.event.realDateStart!=='0000-00-00' ? Moment(success.data.event.realDateStart).format("DD/MM/YYYY") : '';
                   insertFiche.event.realDateEnd = success.data.event.realDateEnd!=='0000-00-00' ? Moment(success.data.event.realDateEnd).format("DD/MM/YYYY") : '';
                }
                if(!_.isUndefined(success.data.event) && success.data.event.category!=0){
                  that.Api
                    .get('/categories/'+success.data.event.category)
                    .then((success) => {
                        insertFiche.event.category = success.data;
                        this.data.pagesFriends.push(insertFiche);
                    });
                }
                else {
                    this.data.pagesFriends.push(insertFiche);
                }
                this.associe.q = ''
                this.associe.results = '';
            });
        }
        else {
            let message = 'Cette fiche est déjà associée';
            this.toastr.error(message, this.toastrOptions);
        }
    }

    formatAssocieFiche(fiche){
        if(!_.isUndefined(success.data.event)){
           fiche.event.realDateStart = success.data.event.realDateStart!=='0000-00-00' ? Moment(success.data.event.realDateStart).format("DD/MM/YYYY") : '';
           fiche.event.realDateEnd = success.data.event.realDateEnd!=='0000-00-00' ? Moment(success.data.event.realDateEnd).format("DD/MM/YYYY") : '';
        }
        if(!_.isUndefined(success.data.event) && success.data.event.category!=0){
          this.Api
            .get('/categories/'+success.data.event.category)
            .then((success) => {
                fiche.event.category = success.data;
            });
        }
    }

// LIEUX
    searchLieux(){
        let query = {
          q: this.lieu.q
        };
        this.Api
            .get('/lieux/searchLieu/',query)
            .then((success) => {
                this.lieu.results = success.data;
            });
    }

    metroBusVelibsLieux(){
       let query = {
            address:this.data.place.address,
            idLieux:this.data.place.idLieux
        }

        this.Api
            .get('/lieux/getAdresseInformation/',query)
            .then((success) => {
                if(success.data.metros){
                    let metroInfo = '';
                    _.each(success.data.metros,function(metro){
                        metroInfo += metro.line+ ' '+metro.station+'\n';
                    })
                    this.data.place.metro = metroInfo;
                }
                if(success.data.bus){
                    let busInfo = '';
                    _.each(success.data.bus,function(bu){
                        busInfo += bu.value+'\n';
                    })
                    this.data.place.bus = busInfo;
                }
            });
    }

    getHandicaps(){
        console.log('test');
        this.Api
            .get('/lieux/getHandicapsInformation/',{eid:this.data.place.idEquipements})
            .then((success) => {
                this.data.place.pmr = success.data.pmr===true ? 1 : 0;
                this.data.place.blind = success.data.blind===true ? 1 : 0
                this.data.place.deaf = success.data.deaf===true ? 1 : 0
            });
    }

    selectLieux(lieu){
        this.data.place = lieu;
        this.data.place.idLieux = lieu.id;
        delete this.data.place.id;
        this.lieu.q = lieu.name;
        this.lieu.newlieu = false;
        this.metroBusVelibsLieux();
        if(this.data.place.idEquipements!=0){
            this.getHandicaps();
        }
    }

    changeLieux(){
        this.data.place = {};
        this.lieu.q = '';
        this.lieu.results = '';
        jQuery('#form-search-lieu').focus();
    }

    ajoutLieux(){
        this.data.place = {
            id:this.data.id
        };
        this.lieu.q = '';
        this.lieu.results = '';
        this.lieu.newlieu = true;
        this.data.place.offline = 1;
    }

    placerCarte(){
        let that = this;
        this.ModalService.mappicker({
          text: "Souhaitez-vous enregistrer la position de cette adresse ? ",
          place:this.data.place
        })
        .result.then((ret) => {
             
        },(reject) => {
            that.data.place.lat = reject.place.lat_ori;
            that.data.place.lon = reject.place.lon_ori;
        });

    }

// MODALITES
    addActivitesInscription(){
        this.data.activity.inscriptions.push({});
    }

    deleteActivitesInscription(inscription){
        if(confirm('Êtes-vous sûr de vouloir supprimer ces dates ?')){
            let index = this.data.activity.inscriptions.indexOf(inscription);
            this.data.activity.inscriptions.splice(index,1);
        }
    }

    setAccessLibre(){
        if(this.data.type.id == 2) this.data.activity.inscriptions=[{}];
        this.data.modality.accessLink='';
        this.data.modality.accessPhone='';
        this.data.modality.accessMail='';
    }

    formatTel(el){
        el = el.replace(/\s/g, '');
        return el;
    }

// DISCIPLINES
    getDisciplines(){
        this.Api
            .get('/disciplines/')
            .then((success) => {
                this.disciplines = success.data;
            });
    }

// TAGS
    toggleTags(idTag){
        let that = this;
        let rm = false;
        _.each(that.data.tags,function(tag){
            if(idTag===tag){
                // on enlève
                let i = that.data.tags.indexOf(tag);
                that.data.tags.splice(i,1);
                rm = true;
            }
        });
        if(!rm){
            that.data.tags.push(idTag);
        }
    }

// VALIDATOR
    checkRequired(data){
        
        let deferred = this.$q.defer();
        let message = '';

        // 1 Quoi
        if(_.isUndefined(data.title) || data.title===''){
            message += "Le titre de la fiche est obligatoire. ";
        }

        // Si publié, en attente ou archivé on teste la validité sur les champs suivants
        if(data.status.id == 1 || data.status.id == 5 || data.status.id == 2){
            if(_.isUndefined(data.leadText) || data.leadText===''){
                message += "Le chapeau de la fiche est obligatoire. ";
            }

            if(_.isUndefined(data.mainMedia)){
                message += "L'image' est obligatoire. ";
            }

            // Où
            if(data.type.id!==3){
                if(_.isUndefined(data.place.name) || data.place.name===''){
                    message += "Le lieu est obligatoire. ";
                }
            }

            // Quand Activités
            if(data.type.id===2){
                if(_.isUndefined(data.activity.dateStart) || _.isUndefined(data.activity.dateEnd)){
                    error=true;
                    message += "Le date de début et la date de fin sont obligatoires. ";
                }
                else {
                    if(data.activity.dateEnd < data.activity.dateStart){
                        error=true;
                        message += "Le date de début doit être inférieure à la date de fin. ";
                    }
                }
            }

            // Quand Evenements
            if(data.type.id===1){
                _.each(data.event.periodes,function(periode){
                    if(periode.isDateMultiples==2){
                        if(periode.dateStart >= periode.dateEnd){
                            message += "La date de début d'une période doit être inférieure à la date de fin ";
                        }
                    }
                }); 
                _.each(data.event.exceptions,function(exception){
                    if(exception.dateStart > exception.dateEnd){
                        message += "La date de début d'une fermeture doit être inférieure à la date de fin ";
                    }
                });
            }
            
            // Modalités
            if(data.type.id!==3){
                if(_.isUndefined(data.modality)){
                    message += "Le type de tarif est obligatoire. ";
                }
            }

            // Contact
            if (_.isUndefined(data.contact.name)) {
                message += "Le nom de l'organisation est obligatoire. ";
            }

            // ACTIVITES/Disciplines
            if(data.type.id===2){
                if (_.isUndefined(data.activity.discipline) || data.activity.discipline.id===0) {
                    message += "Veuillez choisir une discipline. ";
                }
            }

            // PROGRAMMES-EVENEMENT/Categories
            if(data.type.id===3 || data.type.id===1){
                 if (_.isUndefined(data.event.category)) {
                    message += "Veuillez choisir une catégorie. ";
                }
            }
        }

        if(message!==''){
            this.toastr.error(message, this.toastrOptions);
            deferred.reject();
            this.clearEvent();
            return deferred.promise;
        }
        //return data;
        deferred.resolve(data);
        return deferred.promise;
    }

// EVENTS
    setLoadingEvent(status) {
        this.events.saving = _.isUndefined(status);
        this.events.publishing = (status === this.STATUS.published);
        this.events.archiving = (status === this.STATUS.archived);
        this.events.rejecting = (status === this.STATUS.rejected);
        this.events.reviewing = (status === this.STATUS.review);
    }

    setDoneEvent(status) {
        if (_.isUndefined(status)) {
          this.events.saving = false;
          this.events.saved = true;
        }
        else if (status === this.STATUS.published) {
          this.events.publishing = false;
          this.events.published = true;
        }
        else if (status === this.STATUS.rejected) {
          this.events.rejected = false;
          this.events.rejected = true;
        }
        else if (status === this.STATUS.review) {
          this.events.reviewing = false;
          this.events.reviewed = true;
        }
        else if (status === this.STATUS.archived) {
          this.events.archiving = false;
          this.events.archived = true;
        }
    }

    abortEvent(status) {
        if (_.isUndefined(status)) {
          this.events.saving = false;
        }
        else if (status === this.STATUS.published) {
          this.events.publishing = false;
        }
        else if (status === this.STATUS.rejected) {
          this.events.rejecting = false;
        }
        else if (status === this.STATUS.review) {
          this.events.reviewing = false;
        }
        else if (status === this.STATUS.archived) {
          this.events.archiving = false;
        }
    }

    clearEvent() {
        this.events = {};
    }

// DUPLIQUER 
    dupliquer(){
        let clone = angular.copy(this.data);
        clone.status.id = this.ficheInit.status; // brouillon
        clone.status.title = 'brouillon';
        delete clone.id;
        delete clone.modality.id;
        delete clone.contact.id;
        delete clone.place.id;
        delete clone.activity.id;
        delete clone.event.id;
        _.each(clone.event.periodes,function(periode){ 
            delete periode.pages;
        });
        _.each(clone.event.exceptions,function(exception){
            delete exception.pages;
        });
        _.each(clone.activity.inscriptions,function(inscription){
            delete inscription.pages;
        });
        if(clone.type.id == 3 || clone.type.id == 1){
            clone.activity = null;
        }
        let data = this.ficheInit;
        data.title = 'Clone de '+this.data.title;
        clone.title = data.title;
        data.type = this.data.type;
        data.author = this.data.author;

        let that = this;
        data.updatedAt = new Date();
        data.clone = clone;
        this.Api
        .post('/pages/clonefiche/', data)
        .then((success) => {
            console.log(success);
            data.id = success.data.id;
            that.data = clone;
            console.log(that.data);
            that.data.id = success.data.id;
            that.data.modality.id = success.data.id;
            that.data.contact.id = success.data.id;
            that.data.place.id = success.data.id;
            if(clone.type.id == 3 || clone.type.id == 1) { 
                that.data.activity = success.data.id; 
                that.data.event.id = success.data.id;
            }
            else {
                that.data.activity.id = success.data.id; 
                that.data.event = success.data.id;
            }  
            that.$state.go('fiches.edit', {id: data.id}, {reload: false});
            document.body.scrollTop = 0;
            return;
        });
    }

// CHANGE STATUT
    changeStatut(idStatuts){
        let that = this;
        that.data.oldstatus = this.data.status;
        that.data.status = _.filter(this.pagesStatus,{id:idStatuts})[0];
        this.checkRequired(this.data)
        .then((success) => {
            that.setLoadingEvent(idStatuts);
            that.ModalService.confirm({
                text:'Ce document sera désormais '+_.filter(that.pagesStatus,{id:idStatuts})[0].title+'. Souhaitez-vous changer son statut ?'
            })
            .result.then((success) => {
                that.data.message = '';
                that.data.oldstatus = that.data.status;
                that.data.status = _.filter(that.pagesStatus,{id:idStatuts})[0];
                if((that.currentUser.isRedactor() || that.currentUser.isAdmin()) && (idStatuts==2 || idStatuts== 4 || idStatuts==5)){
                    that.ModalService.messages({
                      text: "Souhaitez-vous envoyer un message à l'auteur "+that.data.author.email+" ?",
                      messages:that.messages
                    })
                    .result.then((ret) => {
                        let messagepersonnalise = ret.messagepersonnalise;
                        let messages = _.keys(ret.messages.selected);
                        let m = '<ul>';
                        _.each(messages,function(message){
                            if(!_.isUndefined(_.filter(that.messages, {'id':parseInt(message)})[0].text) && !_.isUndefined(message) && message!='undefined'){
                               m += '<li>'+_.filter(that.messages, {'id':parseInt(message)})[0].text+'</li>';
                            }
                        });
                        if(!_.isUndefined(messagepersonnalise) && messagepersonnalise!==''){
                            m+= '<li>'+messagepersonnalise+'</li>';
                        }
                        m += '</ul>';
                        that.data.message = m;
                        that.save(that.data,idStatuts);
                    },() => {
                        that.save(that.data,idStatuts);
                    });
                }
                else {
                    that.save(that.data,idStatuts);
                }
            },(reject) => {
                that.clearEvent();
            });
        },(error)=>{
            that.data.status = this.data.oldstatus;
            that.clearEvent();
        });
    }

// CREATE
    createFiches(data){
        if(this.data.title.length>1){
            this.isCreating = true;
            let that = this;
            data.updatedAt = new Date();
            this.Api
            .post('/pages/createfiche/', data)
            .then((success) => {
                data.id = success.data.id;
                this.isCreating = false;
                if (!that.$state.is('fiches.edit')) {
                  that.$state.go('fiches.edit', {id: data.id}, {reload: true});
                  return;
                }
            });
        }
    }

// UPDATE
    updateFiche(data,status){
        let that = this;
        //this.data.oldstatus = this.data.status;
        this.setLoadingEvent(status);
        console.log(data);
        that.checkRequired(data)
        .then(function(data){
            let urlPages = '/pages/updatefiche/'+data.id;
            if(data.type.id==1){
                data.event.id = data.id;
            }
            data.place.id = data.id;
            data.updatedAt = new Date();
            that.Api
            .post(urlPages, data)
            .then(
            (success) => {
                console.log(success.data);
                that.setDoneEvent(status);
                that.$timeout(function() {
                    that.clearEvent();
                },1500)
            },
            (error) => {
                this.data.status = this.data.oldstatus;
                that.abortEvent(status);
            });
        },(error) => {
            this.data.status = this.data.oldstatus;
            that.abortEvent(status);
        });
    }

// SAVE
    save(data,status){
        this.updateFiche(data,status);
    }
}


////////////
// EXPORT //
////////////

export default FichesController;
