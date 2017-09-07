////////////////
// CONTROLLER //
////////////////

class MessagesmoderationController {

    /*@ngInject*/
  constructor(Api, NgTableParams, $templateCache) {
    this.Api = Api;

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
          title: addRow.title,
          text: addRow.text
        };

        return Api
          .post('/messagesmoderation', query)
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
      dataType: "readonly"
    },{
      field: "title",
      title: "Titre",
      filter: { title: { id: "text", placeholder: "filtrer par titre" } },
      sortable: "title",
      dataType: "text",
      required: true
    },{
      field: "text",
      title: "Texte",
      dataType: "text",
      required: true
    },{
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
      .get('/messagesmoderation')
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
    if (window.confirm("Confirmez-vous la suppression de " + row.title + " ?")) {
      this.Api
        .delete('/messagesmoderation/' + row.id)
        .then(
          (success) => {
            this.reloadTable();
          });
    }
  }


  //////////
  // SAVE //
  //////////

  saveRow(row) {
    let eRow = row.eRow;

    let query = {
      title: eRow.title,
      text: eRow.text
    };
    query.populate = [];

    this.Api
      .put('/messagesmoderation/' + eRow.id, query)
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

export default MessagesmoderationController;
