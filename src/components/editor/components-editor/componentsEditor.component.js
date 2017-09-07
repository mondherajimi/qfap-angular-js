////////////////
// CONTROLLER //
////////////////

class ComponentsEditorController {

  /*@ngInject*/
  constructor($log, $compile, $scope, $element, $attrs, INSERT_PLUGIN_CONFIG, EditorService, StyleguideService, ModalService) {
    this.$log = $log;
    this.$compile = $compile;
    this.$scope = $scope;
    this.$element = $element;
    this.INSERT_PLUGIN_CONFIG = INSERT_PLUGIN_CONFIG;
    this.Styleguide = StyleguideService;
    this.ModalService = ModalService;

    // console.log('STRUCTURE', this.structure)
    // console.log('CONFIG', this.config)

    this.controlsSelector = '.medium-insert-active, .medium-insert-buttons, .controls';
    this.emptyTextStruct = { type: 'text', data: { block: '' } };
    this.controlsConfig = {
      show: false,
      buttons: [
        {
          icon: 'fa-times',
          label: 'Enlever',
          class: 'btn-danger',
          action: ($elem) => {
            ModalService.confirm({
              text: 'Êtes-vous sûr de vouloir supprimer ce composant ?'
            })
            .result.then((success) => {
              this.removeCpnt($elem);
            });
          }
        }
      ]
    };
    this.anchorParseIds = [];
    // this.anchorIds;

    // force editor type
    this.config.type = EditorService.EDITOR_TYPE.components;
    this.editorOptions = EditorService.parseOptions(this.config);
    this.editorElements = [];

    this.$onInit = function() {
      // console.log('INIT')

      // this.renderCpnts(this.structure);
      // this.parseText();
    };

    this.$onChanges = function(changesObj) {
      console.log('CHANGES', changesObj)

      if (_.has(changesObj, 'config')) {
        this.editorOptions = EditorService.parseOptions(changesObj.config.currentValue);
      }

      if (_.has(changesObj, 'structure')) {
        this.renderCpnts(changesObj.structure.currentValue);
        this.parseText();
      }
    };

    this.$onDestroy = function() {
      console.log('DESTROY CPNTS EDITOR')
      this.cpntEditor.destroy();
    };

    this.$postLink = function() {
      // console.log('POST LINK')
    };

    // debounce parseText method
    this.parseText = _.debounce(this._parseText, 300);

    // listen to click on editor
    $element.on('click', '.component', (e) => {
      e.stopPropagation();
      this.triggerCpntModal(e.target, e.offsetY);
    });
  }


  /**
   * Compile component template to inject data
   * @param  {object} cpntStruct component json structure object
   * @param  {function} insertFn   function to insert html into the DOM
   * @return {object} jQuery element of the injected component
   */
  compileCpnt(cpntStruct, insertFn) {
    const type = cpntStruct.type;
    let $cpnt;
    let $cpntTpl, cpntScope;

    if (type === 'text') {
      $cpntTpl = angular.element(this.Styleguide.component(type)(cpntStruct.data));
      $cpntTpl.attr('ng-model', 'data.block');
      $cpntTpl.attr('controls', 'controls');

      // Isolate scope
      cpntScope = this.$scope.$new(true);
      cpntScope.data = cpntStruct.data;
      cpntScope.controls = this.controlsConfig;

      return this.$compile($cpntTpl)(cpntScope, insertFn);
    }
    else if (type === 'gallery') {
      $cpntTpl = angular.element(this.Styleguide.component(type)(cpntStruct.data));
      $cpntTpl.attr('ng-model', 'data');

      //Isolate scope
      cpntScope = this.$scope.$new(true);
      cpntScope.data = cpntStruct.data;

      return this.$compile($cpntTpl)(cpntScope, function($cpnt) {
        $cpnt.data('structure', cpntStruct);
        insertFn($cpnt);
      });
    }
    else {
      $cpnt = $(this.Styleguide.component(type)(cpntStruct.data));
      $cpnt.data('structure', cpntStruct);
      insertFn($cpnt);

      return $cpnt;
    }
  }

  /**
   * Retrive or generate the anchor id
   * @return {integer} anchor unique id
   */
  anchorId(slug) {

    // list all anchor ids if not yet listed
    if (!this.anchorIds) {
      this.anchorIds = this.$element.find('.component-text h2.anchor').map((index, elem) => {
        return parseInt($(elem).attr('id').split('_')[1]);
      }).get();
      this.anchorIds = _.compact(this.anchorIds);
    }

    // has slug
    if (slug) {
      const slugParts = slug.split('_');
      // slug with potential id
      if (slugParts.length > 1) {
        const aid = parseInt(slugParts[slugParts.length-1]);
        // valid id and not yet present
        if (aid && _.indexOf(this.anchorParseIds, aid) === -1) {
          this.anchorParseIds.push(aid);
          return aid;
        }
      }
    }

    const newId = (this.anchorIds.length > 0) ? _.max(this.anchorIds)+1 : 1;
    this.anchorIds.push(newId);

    return newId;
  }


  /**
   * Render the whole structure
   * It's the only method to insert in the DOM as it's trigerred every time you
   * modify the structure array.
   * @param  {object} structure json array of components structure
   */
  renderCpnts(structure) {
    // Show spinner if not defined
    if (_.isUndefined(structure)) {
      this.$element.html('<i class=\'fa fa-spinner fa-pulse fa-2x\'></i>');
      return;
    }

    // log error and stop if structure isn't an array
    if (!_.isArray(structure)) {
      this.$log.error('Components editor directive: `structure` must be an array');
      return;
    }

    // Clean DOM
    this.$element.find('.component').each((el) => {
      this.removeCpntDOM($(this));
    });
    this.$element.html('');

    // Always have at least one text component
    if (structure.length === 0) {
      structure.push(angular.copy(this.emptyTextStruct));
    }

    // Display and compile editor components
    angular.forEach(structure, (cpntStruct) => {
      // Compile each component and append it to editor
      this.compileCpnt(cpntStruct, ($cpntClone) => {
        this.$element.append($cpntClone);
      });
    });

  }


  /**
   * Parse content to :
   * - update anchors
   * - split/merge text component
   *
   * N.B.: this method is debounced in constructor
   */
  _parseText() {
    console.log('PARSE')

    const anchors = [];

    // Split text to anchors
    this.$element.find('.component-text h2').each((i, elem) => {
      let $title = $(elem);
      let $titleParent = $title.parent('.component-text');

      // Parse anchor
      const anchor = {};
      anchor.id = this.anchorId($title.attr('id'));
      anchor.text = $.trim($title.text());
      anchor.href = S.slugify(anchor.text) + '_' + anchor.id;
      anchors.push(anchor);
      $title
        .attr('id', anchor.href)
        .addClass('anchor');

      // Failed to retrieve correct parent: FUCKING WEIRDNESS !!!
      if (!$titleParent.hasClass('component-text')) {
        console.error('Missing component-text parent...');
        return;

        // old attempt to retrieve correct parent
        // $titleParent.before($titleParent.html());
        // $titleParent.remove();
        // $titleParent = $title.parent();
      }

      // Split to new text component if not starting with an anchor
      const $prevs = $title.prevAll();
      const index = $titleParent.index();
      if ($prevs.length > 0) {
        const $nexts = $title.nextUntil(this.controlsSelector).addBack('.anchor');
        const cpntTextJson = angular.copy(this.emptyTextStruct);
        cpntTextJson.data.block = $('<div>').html($nexts).html();

        // Structure
        this.structure.splice(index + 1, 0, cpntTextJson);
        // DOM
        this.compileCpnt(cpntTextJson, function($cpntClone) {
          $cpntClone.insertAfter($titleParent).append($nexts);
        });
      }

      // Update structure of text component where title originally was
      // DOM was already updated then use read to not trigger directive's $render
      $titleParent.scope().updateModel($titleParent);
    });
    this.anchors = anchors;
    // reset anchor ids listed in the page
    this.anchorParseIds = [];


    // Merge text component if not starting with anchor
    // and previous component is also a text component
    this.$element.find('.component-text').each((index, elem) => {
      const $current = $(elem);
      const $prev = $current.prev('.component-text');
      const $first = $current.children().first();

      // Don't merge
      if ($prev.length === 0 || $first.is('h2')) {
        return;
      }

      let html = '';
      html += this.cleanContent($prev);
      html += this.cleanContent($current);

      // Update fist text component content
      this.structure[$prev.index()].data.block = html;
      // Force to update model changes
      $prev.scope().$digest();

      // Remove second text component without triggering another parseText
      this.removeCpnt($current, true);
    });

    // // Preview synchronization
    // previewLive();

    // Trigger component output
    this.onParse({
      structure: this.structure,
      anchors: this.anchors
    });
  }


  /**
   * Remove unwanted divs from element
   * @param  {object} $elem jQuery element
   */
  cleanContent($elem) {
    const $elemClone = $elem.clone();
    $elemClone.find(this.controlsSelector).remove();

    return $elemClone.html();
  }


  /**
   * Insert a new component
   * @param  {object} $current jQuery element from where a component is inserted
   * @param  {object} json     component data structure
   * @return {boolean}         whether the insertion succeded or not
   */
  insertCpnt($current, json) {

    const $insert = $current.find('.medium-insert-active');
    // Make sure insert parent is component div
    if (!$insert.parent().hasClass('component-text')) {
      $insert.insertBefore($insert.parent());
    }

    const index = $current.index();
    const $prevs = $insert.prevAll();
    const $nexts = $insert.nextUntil(this.controlsSelector);

    // Insertion at the begining of the text component
    if ($prevs.length === 0) {
      // Structure
      this.structure.splice(index, 0, json);
      // DOM
      this.compileCpnt(json, function($cpntClone) {
        $cpntClone.insertBefore($insert.parent());
      });

    }
    // Insertion at the end of the text component
    else if ($nexts.length === 0) {
      // Structure
      this.structure.splice(index + 1, 0, json);
      // DOM
      this.compileCpnt(json, function($cpntClone) {
        $cpntClone.insertAfter($insert.parent());
      });

      // Hide insert buttons
      $current.data('plugin_mediumInsert').hideButtons();

    // Insertion in the middle of a text component
    }
    else {
      const $insertParent = $insert.parent();
      const cpntTextJson = angular.copy(this.emptyTextStruct);
      cpntTextJson.data.block = $('<div>').html($nexts).html();

      // Structure
      this.structure.splice(index + 1, 0, json, cpntTextJson);
      // DOM
      const $cpnt = this.compileCpnt(json, function($cpntClone) {
        $cpntClone.insertAfter($insertParent);
      });
      this.compileCpnt(cpntTextJson, function($cpntClone) {
        $cpntClone.insertAfter($cpnt).append($nexts);
      });

      // Update structure of insert text component
      this.structure[index].data.block = this.cleanContent($insertParent);
    }

    // Preview synchronization
    // previewLive();

    return true;
  }


  /**
   * Update component data
   * @param  {object} $cpnt jQuery DOM element
   * @param  {object} data  json component data
   */
  updateCpnt($cpnt, data) {
    // Update structure
    this.structure[$cpnt.index()].data = data;

    // Update DOM
    var cpntType = $cpnt.data('structure').type;
    var $updateCpnt;
    $updateCpnt = $(this.Styleguide.component(cpntType)(data));
    $cpnt.html($updateCpnt.contents());
    $cpnt.data('structure').data = data;

    // // toggle class on component node
    // if (cpntType === 'image') {
    //   $cpnt.toggleClass('full-height', !!data.modifiers);
    // }
    // // re-render flickity gallery component
    // else if (cpntType === 'gallery') {
    //   $cpnt.scope().render();
    // }
    // // update thanks for form component
    // else if (cpntType === 'form') {
    //   $cpnt.data('thanks', data.thanks);
    //   $cpnt.data('error', data.error);
    // }

    // // Preview synchronization
    // previewLive();
  }


  /**
   * Remove a component
   * @param  {object} $cpnt jQuery DOM element
   * @param  {boolean} noParse reparse text or not
   */
  removeCpnt($cpnt, noParse) {
    let index = $cpnt.index();

    this.structure.splice(index, 1);
    this.removeCpntDOM($cpnt);

    // Make sure you always have at least one component
    if (_.isEmpty(this.structure)) {
      this.renderCpnts(this.structure);
    }

    if (!noParse) {
      this.parseText();
    }
  }

  removeCpntDOM($cpnt) {
    // Clean destroy of text component scope
    if ($cpnt.hasClass('component-text')) {
      $cpnt.scope().$destroy();
    }
    $cpnt.remove();
  }


  /**
   * Open component edit modal
   * @param  {String} type      component type
   * @param  {object} $element  component jQuery element
   * @param  {object} structure component data
   */
  editComponent(type, $element, structure) {

    // modal params are resolved in modal controller as params
    const modalParams = {
      $element: $element,
      structure: structure
    };

    const defaultConfig = this.INSERT_PLUGIN_CONFIG[type] ? this.INSERT_PLUGIN_CONFIG[type].modal : {};
    // allow to override modal config for specific components
    const customConfig = {};

    const modalConfig = _.extend({}, defaultConfig, customConfig);

    // init component modal
    const modalInstance = this.ModalService.component(modalParams, modalConfig);

    modalInstance.result.then(
      (success) => {
        switch (success.method) {
          case 'create':
            this.insertCpnt(success.$element, success.structure);
            break;
          case 'update':
            this.updateCpnt(success.$element, success.structure);
            break;
          case 'destroy':
            this.removeCpnt(success.$element);
            break;
          default:
            this.$log.error("Unknown modal return value");
        }
      },
      (error) => { }
    );
  }


  /**
   * Trigger event according to where you click on the editor
   * @param  {object} e event object
   */
  triggerCpntModal(target, offsetY) {
    const $cpnt = angular.element(target);
    const cpntStruct = $cpnt.data('structure');
    const cpntType = cpntStruct ? cpntStruct.type : 'text';

    if (cpntType === 'text') { return; }

    var cpntTextJson;

    // Add empty component
    // click on :before
    if (offsetY < 0) {
      cpntTextJson = angular.copy(this.emptyTextStruct);
      // Structure
      this.structure.splice($cpnt.index(), 0, cpntTextJson);
      // DOM
      this.compileCpnt(cpntTextJson, function($cpntClone) {
        $cpntClone.insertBefore($cpnt);
      });

      // this.$scope.$digest();
    }
    // click on :after
    else if (offsetY > $cpnt.height()) {
      cpntTextJson = angular.copy(this.emptyTextStruct);
      // Structure - after is always at the end of the document
      this.structure.push(cpntTextJson);
      // DOM
      this.compileCpnt(cpntTextJson, function($cpntClone) {
        $cpntClone.insertAfter($cpnt);
      });

      // this.$scope.$digest();
    }
    // trigger edit modal
    else {
      this.editComponent(cpntType, $cpnt, cpntStruct);
    }
  }

}


////////////
// EXPORT //
////////////

export default {
  bindings: {
    // input
    structure: '<',
    config: '<',
    // output
    onParse: '&'
  },
  controller: ComponentsEditorController,
  controllerAs: 'cpntEditor'
};