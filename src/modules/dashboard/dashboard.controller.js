////////////
// IMPORT //
////////////

import actionsTemplate from './dashboard.actions.tpl.html';
import filtersTemplate from './dashboard.filters.tpl.html';
import tableTemplate from './dashboard.table.tpl.html';
import messagesmodalTemplate from './messagesmodal.html';
import choisirmodalTemplate from './choisirmodal.html';


////////////////
// CONTROLLER //
////////////////


class DashboardController {

  /*@ngInject*/
  constructor(Api, $scope, $state, $window, $uibModal, ENV, USER_ACCESS, UserService, pagesTypes, pagesStatus, groups, NgTableParams, algolia) {
    this.ENV = ENV;
    this.currentUser = UserService;
    this.USER_ACCESS = USER_ACCESS;
    this.$state = $state;
    this.$window = $window;
    this.$uibModal = $uibModal;

    // TEMPLATES
    this.actionsTpl = actionsTemplate;
    this.filtersTpl = filtersTemplate;
    this.tableTpl = tableTemplate;

    // STATIC DATA
    this.pagesTypes = pagesTypes;
    this.pagesStatus = pagesStatus;
    this.groups = groups;

    // ALGOLIA
    let client = algolia.Client(ENV.algolia.id, ENV.algolia.api_key);
    let index = client.initIndex(ENV.algolia.index);


    /////////////
    // FILTERS //
    /////////////

    this.filters = {};

    // More
    this.filtersCollapsed = true;

    // Weight
    this.maxWeight = 3;

    // Datepicker
    this.datepickerOptions = {
      format: 'yyyy-MM-dd',
      autoclose: true,
      weekStart: 0
    };
    this.datepickerFrom = false;
    this.datepickerTo = false;

    // Deep watch filters
    $scope.$watch('dashboard.filters', () => {
      if (!this.filters.text) delete this.filters.text;
      if (!this.filters.type) delete this.filters.type;
      if (!this.filters.status) delete this.filters.status;
      if (!this.filters.group) delete this.filters.group;
      if (!this.filters.my) delete this.filters.my;
      if (!this.filters.dateFrom) delete this.filters.dateFrom;
      if (!this.filters.dateTo) delete this.filters.dateTo;
      if (!this.filters.envueMonth) delete this.filters.envueMonth;
      if (!this.filters.envueTheme) delete this.filters.envueTheme;

      this.tableParams.reload();
    }, true);

    // Les internautes et les contributeurs ne voient que leurs publications
    if (this.currentUser.isContributor() || this.currentUser.isUser()) {
      this.filters.my = true;
    }

    // Les modérateurs peuvent voir uniquement les publications de leur groupe
    // et ne peuvent pas changer le filtre "groupes"
    if (this.currentUser.isModerator()) {
      this.filters.group = this.currentUser.getGroup();
    }

    ///////////
    // TABLE //
    ///////////

    // Parameters
    let parameters = {
      page: 1,
      count: 25,
    };

    // Settings
    let settings = {
      getData: (params) => {
        let filters = {};

        // déclaration des facetFilters
        var facetFilters = [];
        if (this.filters.type) {
          facetFilters.push('idPagesTypes:' + this.filters.type);
        }
        if (this.filters.status) {
          facetFilters.push('idPagesStatuts:' + this.filters.status);
        }
        if (this.filters.group) {
          facetFilters.push('idGroupes:' + this.filters.group);
        }
        if (this.filters.weight) {
          facetFilters.push('weight:' + this.filters.weight);
        }
        // 'Bibliothèques' filter on
        if (this.filters.group === 11) {
          if (this.filters.envueMonth) {
            facetFilters.push('envueMonth:' + this.filters.envueMonth);
          }
          if (this.filters.envueTheme) {
            facetFilters.push('envueTheme:' + this.filters.envueTheme);
          }
        }

        if (facetFilters.length > 0) {
          filters = angular.extend(filters, { facetFilters: facetFilters });
        }

        // déclaration des numericFilters
        var numericFilters = [];
        if (this.filters.dateFrom) {
          let timestampFrom = Moment(this.filters.dateFrom).format('X');
          numericFilters.push('createdAt>=' + timestampFrom);
        }
        if (this.filters.dateTo) {
          let timestampTo = Moment(this.filters.dateTo).format('X');
          numericFilters.push('createdAt<=' + timestampTo);
        }
        if (this.filters.my) {
          numericFilters.push('idUtilisateurs=' + this.currentUser.getId());
        }

        if (numericFilters.length > 0) {
          filters = angular.extend(filters, { numericFilters: numericFilters });
        }

        // déclaration des filtres de pagination
        filters = angular.extend(
          filters,
          { hitsPerPage: params.count() },
          { page: params.page() - 1 }
        );

        return index
          .search(this.filters.text, filters)
          .then(
            (content) => {
              params.total(content.nbHits);

              return content.hits;
            },
            (error) => {
              console.error(error)
            });
      }
    };

    // Columns
    let columns = [{
      field: "createdAt",
      title: "Date de création",
      dataType: "date"
    }, {
      field: "idPagesTypes",
      title: "Type",
      dataType: "type"
    }, {
      field: "objectID",
      title: "ID",
      dataType: "text"
    }, {
      field: "title",
      title: "Titre",
      dataType: "text"
    }, {
      field: "place",
      title: "Lieu",
      dataType: "text"
    }, {
      field: "updatedAt",
      title: "Dernière modification",
      dataType: "datetime"
    }, {
      field: "author",
      title: "Auteur",
      dataType: "text"
    }, {
      field: "idPagesStatuts",
      title: "Statut",
      dataType: "status"
    }];
    // On ajoute à Columns le champ weight uniquement pour les rédacteurs et les administrateurs 
    if (this.currentUser.hasAccess(this.USER_ACCESS.redactor)) {
      columns.unshift({field: "weight",
                       title: "Poids",
                       dataType: "weight"
                      });
    }


    // Init table
    this.tableParams = new NgTableParams(parameters, settings);
    this.tableColumns = columns;

    // Recupere la date du dernier message des bureaux
    var queryMB = {
      group: this.currentUser.getGroup()
    };

    Api
     .get('/messagesbureaux/get_last_message_date', { params: queryMB })
     .then((data) => {
      this.last_message_date = data.data[0].maxdate;
      });

  }

  canCreateProgram() {
    const currentUserGroup = this.currentUser.getGroup();

    // 1: internautes; 7: associations; 11: bibliothèques
    return this.currentUser.hasAccess(this.USER_ACCESS.contributor) &&
           !_.isUndefined(currentUserGroup) &&
           !((currentUserGroup === 1) || (currentUserGroup === 7) || (currentUserGroup === 11));
  }

  edit(row) {
    const isArticle = _.result(_.find(this.pagesTypes, { id: row.idPagesTypes }), 'isArticle');
    const state = isArticle ? 'article' : 'fiches.edit';

    this.$state.go(state, { id: row.objectID });
  }

  exportEnvue() {
    const ids = _.map(this.tableParams.data, 'objectID').join(',');
    const exportUrl = this.ENV.api.url + '/EnVue/generate_envue?s_idPages=' + ids;
    this.$window.open(exportUrl);
  }


  ////////////////////
  // MESSAGES MODAL //
  ////////////////////

  openMessages() {

    const currentUserGroup = this.currentUser.getGroup();

    var modalInstance = this.$uibModal.open({
      animation: true,
      template: messagesmodalTemplate,
      controller: 'MessagesmodalController',
      controllerAs: 'messagesmodal',
      size: 'lg',
      resolve: {
        group: function () {
          return currentUserGroup;
        }
      }
    });
  }


  ///////////////////
  // CHOISIR MODAL //
  ///////////////////

  openChoisir() {

    var modalInstance = this.$uibModal.open({
      animation: true,
      template: choisirmodalTemplate,
      controller: 'ChoisirmodalController',
      controllerAs: 'choisirmodal',
      size: 'lg',
      resolve: {    
      }
    });
  }


}



////////////
// EXPORT //
////////////

export default DashboardController;
