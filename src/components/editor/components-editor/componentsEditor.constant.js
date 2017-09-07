//////////////////////////
// INSERT PLUGIN ADDONS //
//////////////////////////

export const INSERT_PLUGIN_CONFIG = {
  // BUILT_IN ADDONS
  // force it to false as we don't import those 2 addons
  images: false,
  embeds: false,

  // CUSTOM ADDONS
  place: {
    label: '<i class="fa fa-map-marker"></i><span class="medium-insert-action-label">lieu</span>',
    modal: {
      controller: 'ComponentPlaceController',
      controllerAs: 'placeCpnt',
      templateUrl: 'component/place.html',
      size: 'lg',
      windowClass: 'cpnt-place'
    }
  },
  verbatim: {
    label: '<i class="fa fa-quote-right"></i><span class="medium-insert-action-label">verbatim</span>',
    modal: {
      controller: 'ComponentVerbatimController',
      controllerAs: 'verbatimCpnt',
      templateUrl: 'component/verbatim.html',
      size: 'md',
      windowClass: 'cpnt-verbatim'
    }
  },
  video: {
    label: '<i class="fa fa-youtube-play"></i><span class="medium-insert-action-label">vidéo</span>',
    modal: {
      controller: 'ComponentVideoController',
      controllerAs: 'videoCpnt',
      templateUrl: 'component/video.html',
      size: 'md',
      windowClass: 'cpnt-video'
    }
  },
  image: {
    label: '<i class="fa fa-camera"></i><span class="medium-insert-action-label">image</span>',
    modal: {
      controller: 'ComponentImageController',
      controllerAs: 'imageCpnt',
      templateUrl: 'component/image.html',
      size: 'md',
      windowClass: 'cpnt-image'
    }
  },
  html: {
    label: '<i class="fa fa-code"></i><span class="medium-insert-action-label">html</span>',
    modal: {
      controller: 'ComponentHtmlController',
      controllerAs: 'htmlCpnt',
      templateUrl: 'component/html.html',
      size: 'md',
      windowClass: 'cpnt-html'
    }
  },

  highlight: {
    label: '<i class="fa fa-square-o"></i><span class="medium-insert-action-label">encadré</span>',
    modal: {
      controller: 'ComponentHighlightController',
      controllerAs: 'highlightCpnt',
      templateUrl: 'component/highlight.html',
      size: 'lg',
      windowClass: 'cpnt-highlight'
    }
  },
  quiz: {
    label: '<i class="fa fa-gift"></i><span class="medium-insert-action-label">quiz</span>',
    modal: {
      controller: 'ComponentQuizController',
      controllerAs: 'quizCpnt',
      templateUrl: 'component/quiz.html',
      size: 'md',
      windowClass: 'cpnt-quiz'
    }
  },
  'place-parisien': {
    label: '<i class="fa fa-location-arrow"></i><span class="medium-insert-action-label">adresse de parisien</span>',
    modal: {
      controller: 'PlaceParisienComponentController',
      controllerAs: 'placeParisienCpnt',
      templateUrl: 'component/place-parisien.html',
      size: 'md',
      windowClass: 'cpnt-place-parisien'
    }
  },
};


///////////////////////
// COMPONENTS EDITOR //
///////////////////////

export const COMPONENTS_EDITOR_CONFIG = {
  // CORE

  // css class added to active buttons in the toolbar. ('medium-editor-button-active')
  // activeButtonClass: 'medium-editor-button-active',

  // type of labels on the buttons. Values: false | 'fontawesome'. (false)
  // buttonLabels: 'fontawesome',

  // time in milliseconds to show the toolbar or anchor tag preview. (0)
  // delay: 0,

  // enables/disables the use of the return-key.
  // You can also set specific element behavior by using setting a data-disable-return attribute. (false)
  // disableReturn: false,

  // allows/disallows two (or more) empty new lines.
  // You can also set specific element behavior by using setting a data-disable-double-return attribute. (false)
  // disableDoubleReturn: false,

  // when set to true, it disallows spaces at the beginning and end of the element.
  // Also it disallows entering 2 consecutive spaces between 2 words. (false)
  // disableExtraSpaces: false,

  // enables/disables adding the contenteditable behavior.
  // Useful for using the toolbar with customized buttons/actions.
  // You can also set specific element behavior by using setting a data-disable-editing attribute. (false)
  // disableEditing: false,

  // specifies a DOM node to contain MediumEditor's toolbar and anchor preview elements. (document.body)
  // elementsContainer: document.body,

  // extension to use (see Custom Buttons and Extensions) for more. ({})
  // extensions: {
  //   'imageDragging': {}
  // },

  // enable/disable native contentEditable automatic spellcheck. (true)
  // spellcheck: true,

  // enables/disables target="_blank" for anchor tags. (false)
  // targetBlank: false

  // TOOLBAR
  toolbar: {
    // enables/disables whether the toolbar should be displayed when selecting multiple paragraphs/block elements. (true)
    // allowMultiParagraphSelection: true,

    // the set of buttons to display on the toolbar. (['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'])
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

    // value in pixels to be added to the X axis positioning of the toolbar. (0)
    // diffLeft: 0,

    // value in pixels to be added to the Y axis positioning of the toolbar. (-10)
    // diffTop: -10,

    // css class added to the first button in the toolbar. ('medium-editor-button-first')
    // firstButtonClass: 'medium-editor-button-first',

    // css class added to the last button in the toolbar. ('medium-editor-button-last')
    // lastButtonClass: 'medium-editor-button-last',

    // enables/disables standardizing how the beginning of a range is decided between browsers
    // whenever the selected text is analyzed for updating toolbar buttons status. (false)
    // standardizeSelectionStart: false,

    // enable/disable the toolbar always displaying in the same location relative to the medium-editor element. (false)
    static: true,

    // Toolbar is appended relative to a given DOM-Node instead of appending it to the body and position it absolute. (null)
    // relativeContainer: null,

    /* options which only apply when static is true */

    // left|center|right
    // this aligns the static toolbar relative to the medium-editor element. (center)
    // align: 'center',

    // this enables/disables the toolbar "sticking" to the viewport and staying
    // visible on the screen while the page scrolls. (false)
    sticky: true,

    // value in pixel of the top offset above the toolbar. (0)
    stickyTopOffset: 110,

    // this enables/disables updating the state of the toolbar buttons
    // even when the selection is collapsed (there is no selection, just a cursor). (false)
    updateOnEmptySelection: true
  },

  // ANCHOR PREVIEW
  // anchorPreview: {
  //   // time in milliseconds to show the anchor tag preview after the mouse has left the anchor tag. (500)
  //   // hideDelay: 500,

  //   // the default selector to locate where to put the activeAnchor value in the preview.
  //   // You should only need to override this if you've modified the way in which the anchor-preview extension renders. ('a')
  //   previewValueSelector: 'a',

  //   // determines whether the anchor tag preview shows up when the toolbar is visible.
  //   // You should set this value to true if the static option for the toolbar is true and you want the preview to show at the same time. (false)
  //   // showWhenToolbarIsVisible: false
  // },

  // PLACEHOLDER
  // placeholder: {
  //   // Defines the default placeholder for empty contenteditables when placeholder is not set to false.
  //   // You can overwrite it by setting a data-placeholder attribute on the editor elements. ('Type your text')
  //   text: 'Tapez votre texte ici'

  //   // Causes the placeholder to disappear as soon as the field gains focus. (true)
  //   // To hide the placeholder only after starting to type, and to show it again as soon as field is empty, set this option to false.
  //   // hideOnClick: true
  // },

  // ANCHOR
  // anchor: {
  //   // custom class name the user can optionally have added to their created links (ie 'button').
  //   // If passed as a non-empty string, a checkbox will be displayed allowing the user to choose whether to have the class added to the created link or not. (null)
  //   // customClassOption: null

  //   // text to be shown in the checkbox when the customClassOption is being used. ('Button')
  //   // customClassOptionText: 'Button'

  //   // enables/disables check for common URL protocols on anchor links.
  //   // Converts invalid url characters (ie spaces) to valid characters using encodeURI. (false)
  //   // linkValidation: false

  //   // text to be shown as placeholder of the anchor input. ('Paste or type a link')
  //   // placeholderText: 'Paste or type a link'

  //   // enables/disables displaying a "Open in new window" checkbox,
  //   // which when checked changes the target attribute of the created link. (false)
  //   // targetCheckbox: false

  //   // text to be shown in the checkbox enabled via the targetCheckbox option. ('Open in new window')
  //   // targetCheckboxText: 'Open in new window'
  // },

  // PASTE
  // paste: {
  //   // Forces pasting as plain text. (true)
  //   // forcePlainText: true

  //   // cleans pasted content from different sources, like google docs etc. (false)
  //   // cleanPastedHTML: false

  //   // custom pairs (2 element arrays) of RegExp and replacement text to use during paste when forcePlainText
  //   // or cleanPastedHTML are true OR when calling cleanPaste(text) helper method.
  //   // These replacements are executed before builtin replacements. ([])
  //   // preCleanReplacements: []

  //   // custom pairs (2 element arrays) of RegExp and replacement text to use during paste when forcePlainText
  //   // or cleanPastedHTML are true OR when calling cleanPaste(text) helper method.
  //   // These replacements are executed after builtin replacements. ([])
  //   // cleanReplacements: []

  //   // list of element attributes to remove during paste when cleanPastedHTML is true or when calling cleanPaste(text)
  //   // or pasteHTML(html,options) helper methods. (['class', 'style', 'dir'])
  //   // cleanAttrs: ['class', 'style', 'dir']

  //   // list of element tag names to remove during paste when cleanPastedHTML is true or when calling cleanPaste(text)
  //   // or pasteHTML(html,options) helper methods. (['meta'])
  //   // cleanTags: ['meta']
  // },

  // KEYBORAD COMMANDS
  // keyboardCommands: {
  //   // commands: [{
  //   //   command: 'bold',
  //   //   key: 'B',
  //   //   meta: true,
  //   //   shift: false,
  //   //   alt: false
  //   // }]
  // },

  // AUTOLINK
  // autoLink: false,

  // IMAGE DRAGGING
  // imageDragging: false,


  ////////////
  // CUSTOM //
  ////////////

  // basic|components|inline
  // type of editor directive to enable.
  type: 'components',

  // INSERT PLUGIN (not part of medium-editor config)
  // enable/disable medium insert plugin.
  insertPlugin: INSERT_PLUGIN_CONFIG
};
