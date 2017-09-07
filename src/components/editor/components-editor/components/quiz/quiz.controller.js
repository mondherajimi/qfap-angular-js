////////////
// IMPORT //
////////////

// load template in templateCache
import '!ngtemplate?relativeTo=/src/components/editor/components-editor/components/quiz/&prefix=component/!html!./quiz.html';


////////////////
// CONTROLLER //
////////////////

class QuizComponentController {

  /*@ngInject*/
  constructor($uibModalInstance, ModalService, params) {
	 this.$uibModalInstance = $uibModalInstance;
    this.ModalService = ModalService;

    this.type = 'quiz';
    this.jsonTpl = {
  "cookie": false,
  "form": {
    "action": "#",
    "method": "POST"
  },
  "button": {
    "href": "#",
    "text": "J'accepte"
  },
  "link": {
    "href": "#",
    "text": "Lire les CGU"
  },
  "text": "Validez votre participation au jeu en acceptant les CGU",
  "items": [
    {
      "title": "",
      "text": "",
      "options": [
        {
          "label": ""
        },
        {
          "label": ""
        },
		{
          "label": ""
        },
		{
          "label": ""
        },
		{
          "label": ""
        }
      ]
    }
  ],
  "login": {
    "text": "Pour jouer,<br />vous devez être connecté !",
    "button": {
      "href": "#",
      "text": "Se connecter"
    }
  }
};
    this.i=0;

    this.init(params);
  }

  // Initialize component
  init(params) {
    this.$cpnt = params.$element;
	this.data = params.structure ? angular.copy(params.structure.data) : angular.copy(this.jsonTpl);
    this.showDelete = !!params.structure;
	
	
  }
  
  deleteItem (index) {
    this.data.items.splice(index, 1);
  };
  
  addItem () {
	var newTpl = angular.copy(this.jsonTpl.items[0]);
	//alert(JSON.stringify(this.data));
    this.data.items.push(newTpl);
  };
  
    addOpt (index) {
	if(document.getElementById("thirdOpt"+index).style.display == "none"){document.getElementById("thirdOpt"+index).style.display = "block";}
    else if(document.getElementById("FourthOpt"+index).style.display == "none"){document.getElementById("FourthOpt"+index).style.display = "block";}
	else if(document.getElementById("FifthOpt"+index).style.display == "none"){document.getElementById("FifthOpt"+index).style.display = "block";document.getElementById("addOpt"+index).style.display = "none";}
  };
	
    initTitles(){
	for(this.i=0;this.i<=this.data.items.length-1;this.i++)
	{
    this.data.items[this.i].title=document.getElementById("quiz-title"+this.i).innerText;
	}
  };
  
/*	initOpt1(index){
		for(this.i=0;this.i<=this.data.items.length-1;this.i++)
	{  
		 if(this.data.items[index].options[2].label!=""){return("display:block;");}else{return("display:none;");}  
	}
  };
  
    initOpt2(index){
		for(this.i=0;this.i<=this.data.items.length-1;this.i++)
	{  
		 if(this.data.items[index].options[3].label!=""){return("display:block;");}else{return("display:none;");}  
	}
  };
  
    initOpt3(index){
		for(this.i=0;this.i<=this.data.items.length-1;this.i++)
	{  
		 if(this.data.items[index].options[4].label!=""){return("display:block;");}else{return("display:none;");}  
	}
  };
  
	initAddOpt(index){
		for(this.i=0;this.i<=this.data.items.length-1;this.i++)
	{  
		 if(this.data.items[index].options[4].label!=""){return("display:none;");}else{return("display:block;");}  
	}
  };
*/  

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
    this.initTitles();
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

export default QuizComponentController;
