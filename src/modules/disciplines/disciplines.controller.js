////////////////
// CONTROLLER //
////////////////

class DisciplinesController {

  /*@ngInject*/
  constructor(Api, NgTableParams, ModalService) {
    this.Api = Api;
    this.ModalService = ModalService;

    // TABLE

    // parameters
    let parameters = {
      page: 1,
      sorting: { id: "asc" },
    };

    // settings
    let settings = {
      counts: [],
      addData: (params) => {
        let addRow = params.parameters().addRow;
        let query = {
          title: addRow.title
        };

        return Api
          .post('/disciplines', query)
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
      field: "id",
      title: "ID",
      sortable: "id",
      filter: { id: { id: "number", placeholder: "filtrer par ID" } },
      dataType: "readonly"
    }, {
      field: "title",
      title: "Titre",
      sortable: "title",
      filter: { title: { id: "text", placeholder: "filtrer par titre" } },
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
      .get('/disciplines')
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
      text: "Êtes-vous sûr de vouloir supprimer la discipline : <em>" + row.title + "</em> ?"
    })
    .result.then((success) => {
      this.Api
        .delete('/disciplines/' + row.id)
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
      title: eRow.title,
    };
    query.populate = [];

    this.Api
      .put('/disciplines/' + eRow.id, query)
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

export default DisciplinesController;
