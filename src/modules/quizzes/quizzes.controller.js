////////////////
// CONTROLLER //
////////////////

class QuizzesController {

  /*@ngInject*/
  constructor(Api, NgTableParams, ModalService) {
    this.Api = Api;
    this.ModalService = ModalService;


    // parameters
    let parameters = {
      page: 1,
      //count: 25,
      sorting: { date: "desc" },
    };

    // settings
    let settings = {
      counts: [],
      addData: (params) => {
        let addRow = params.parameters().addRow;
        let query = {
          date: addRow.date,
		  idJeux: addRow.idJeux,
		  title: addRow.title,
		  update: addRow.update,
		  author: addRow.author,
		  status: addRow.status,
		  nbrPlayers: addRow.nbrPlayers
        };

        return Api
          .post('/questionnaires', query)
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
      field: "date",
      title: "Date de création",
      sortable: "date",
      filter: { date: { id: "text", placeholder: "filtrer par date de création" } },
      dataType: "text",
      required: true
    },
    {
      field: "idJeux",
      title: "ID",
      sortable: "idJeux",
      filter: { idJeux: { id: "number", placeholder: "filtrer par ID" } },
      dataType: "readonly",
    },
    {
      field: "title",
      title: "Titre",
      sortable: "title",
      filter: { title: { id: "text", placeholder: "filtrer par titre" } },
      dataType: "text",
	  required: true
    },
    {
      field: "update",
      title: "Dernière modification",
      sortable: "update",
      filter: { update: { id: "text", placeholder: "filtrer par date de mise à jour" } },
      dataType: "text",
      required: true
    },
    {
      field: "author",
      title: "auteur",
      sortable: "author",
      filter: { author: { id: "text", placeholder: "filtrer par auteur" } },
      dataType: "text",
      required: true
    },
	{
      field: "status",
      title: "statut",
      sortable: "status",
      filter: { status: { id: "text", placeholder: "filtrer par statut" } },
      dataType: "text",
      required: true
    },
	{
      field: "nbrPlayers",
      title: "nbre joueurs",
      sortable: "nbrPlayers",
      filter: { nbrPlayers: { id: "number", placeholder: "filtrer par nbre joueurs" } },
      dataType: "readonly",
      required: true
    },
    {
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
      .get('/questionnaires')
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

  cancelRow(row) {
    delete row.eRow;
  }

  cancelEditRow(row) {
    delete row.eRow;
  }
  ////////////
  // DELETE //
  ////////////

  deleteRow(row) {
    this.ModalService.confirm({
      text: "Êtes-vous sûr de vouloir supprimer le quiz : <em>" + row.title + "</em> ?"
    })
    .result.then((success) => {
      this.Api
        .delete('/questionnaires/' + row.id)
        .then((success) => {
          //this.tableParams.reload();
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
	  date: eRow.date,
      idJeux: eRow.idJeux,
	  title: eRow.title,
      update: eRow.update,
	  author: eRow.author,
	  status: eRow.status,
	  nbrPlayers: eRow.nbrPlayers
    };
    query.populate = [];

    this.Api
      .put('/questionnaires/' + eRow.id, query)
      .then((success) => {
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

export default QuizzesController;