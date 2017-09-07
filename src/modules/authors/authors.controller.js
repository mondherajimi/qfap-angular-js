////////////////
// CONTROLLER //
////////////////

class AuthorsController {

  /*@ngInject*/
  constructor(Api, NgTableParams, ModalService) {
    this.Api = Api;
    this.ModalService = ModalService;

    // TABLE

    // parameters
    let parameters = {
      page: 1,
      sorting: { nickname: "asc" },
    };

    // settings
    let settings = {
      counts: [],
      addData: (params) => {
        let addRow = params.parameters().addRow;
        let query = {
          nickname: addRow.nickname,
          link: addRow.link
        };

        return Api
          .post('/auteurs', query)
          .then((success) => {
            // TODO - reload table or extend dataset ?
            this.reloadTable();
            this.tableParams.parameters({ addRow: undefined });

            return;
          });
      }
    };

    // columns
    let columns = [{
      field: "nickname",
      title: "Pseudo",
      sortable: "nickname",
      filter: { nickname: { id: "text", placeholder: "filtrer par pseudo" } },
      dataType: "text",
      required: true
    }, {
      field: "link",
      title: "Lien",
      sortable: "link",
      filter: { link: { id: "text", placeholder: "filtrer par lien" } },
      dataType: "text",
      required: true
    }, {
      field: "action",
      title: "",
      filter: { action: { id: "label", placeholder: "⇚ Filtres" } },
      dataType: "command"
    }];

    // Init table
    this.tableParams = new NgTableParams(parameters, settings);
    this.tableColumns = columns;
    this.reloadTable();
  }

  ///////////
  // TABLE //
  ///////////

  reloadTable() {
    return this.Api
      .get('/auteurs')
      .then((success) => {
        this.tableParams.total(success.data.length);
        this.tableParams.settings({ dataset: success.data });

        return;
      });
  }


  //////////
  // EDIT //
  //////////

  editRow(row) {
    row.eRow = angular.copy(row);
  }

  cancelEditRow(row) {
    delete row.eRow;
  }


  ////////////
  // DELETE //
  ////////////

  deleteRow(row) {
    this.ModalService.confirm({
      text: "Êtes-vous sûr de vouloir supprimer l'auteur : <em>" + row.nickname + "</em> ?"
    })
    .result.then((success) => {
      this.Api
        .delete('/auteurs/' + row.id)
        .then((success) => {
          this.reloadTable();
        });
    });
  }


  //////////
  // SAVE //
  //////////

  saveRow(row) {
    let eRow = row.eRow;

    let query = {
      nickname: eRow.nickname,
      link: eRow.link
    };
    query.populate = [];

    this.Api
      .put('/auteurs/' + eRow.id, query)
      .then(
        (success) => {
          // extend orginal row data with saved one
          _.extend(row, success.data);
          delete row.eRow;
        });
  }


  /////////
  // ADD //
  /////////

  addRow() {
    this.tableParams.parameters({ addRow: {} });
  }
}


////////////
// EXPORT //
////////////

export default AuthorsController;
