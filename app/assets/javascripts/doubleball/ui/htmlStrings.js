GameCreator.htmlStrings = {
  singleSelector: function(collection, attrName, selectedValue, dataType) {
      dataType = dataType || 'string';
      var result = '<select class="selectorField" data-type="' + dataType +'"';
      if (attrName) {
      	result += ' data-attrName="' + attrName + '">'
      } else {
      	result += '>'
      }
      for (var key in collection) {
          if (collection.hasOwnProperty(key)) {
              result += "<option value='" + GameCreator.helpers.toString(collection[key]) + "'" + (collection[key] + '' === selectedValue + '' ? " selected" : "") + ">" + key + "</option>";
          }
      };
      result += "</select>";
      return result;
  },

  numberInput: function(attrName, value) {
      return '<input type="text" class="numberField" data-type="number" data-attrName="' + attrName + '" value="' + (value === undefined ? '' : value) + '"/>'
  },

  globalObjectInput: function(attrName, value, globalObj) {
      var ids = GameCreator.helpers.getGlobalObjectIds();
      if (globalObj) {
        ids['this'] = 'this';
      }
      return GameCreator.htmlStrings.singleSelector(ids, attrName, value);
  },
  sceneObjectInput: function(attrName, value) {
      var ids = GameCreator.getUniqueIDsInActiveScene();
      ids['this'] = 'this';
      return GameCreator.htmlStrings.singleSelector(ids, attrName, value);
  },

  counterCarrierInput: function(attrName, value) {
      var ids = GameCreator.getUniqueIDsWithCountersInActiveScene();
      ids['Global Counters'] = 'globalCounters';
      return GameCreator.htmlStrings.singleSelector(ids, attrName, value);
  },

  shootableObjectInput: function(attrName, value) {
      return GameCreator.htmlStrings.singleSelector(GameCreator.helpers.getShootableObjectIds(), attrName, value);
  },

  destroyEffectInput: function(attrName, value) {
      return GameCreator.htmlStrings.singleSelector(GameCreator.effects.destroyEffects, attrName, value);
  },

  stateInput: function(attrName, value, globalObj) {
      var selectableStates = {};
      globalObj.states.forEach(function(state){
          selectableStates[state.name] = state.id;
      });
      return GameCreator.htmlStrings.singleSelector(selectableStates, attrName, value);
  },

  comparatorInput: function(attrName, value) {
      var selectableComparators = { 'Equals': 'equals', 'Greater than': 'greaterThan', 'Less than': 'lessThan'};
      return GameCreator.htmlStrings.singleSelector(selectableComparators, attrName, value);
  },

  counterInput: function(attrName, value, globalObj) {
      var counters = {};
      var counterNames = Object.keys(globalObj.parentCounters);
      counters['Global Counters'] = 'globalCounters';
      for (var i = 0; i < counterNames.length; i += 1) {
          counters[counterNames[i]] = counterNames[i];
      }
      return GameCreator.htmlStrings.singleSelector(counters, attrName, value)
  },

  sceneObjectCounterInput: function(attrName, value, globalObj, dependancy) {
      var counterNames = [], counters = {};
      var selectedCounterCarrier = GameCreator.getSceneObjectById(dependancy);
      if (dependancy === 'globalCounters') {
          counterNames = Object.keys(GameCreator.globalCounters);
      } else if (selectedCounterCarrier) {
          if(selectedCounterCarrier.parent.attributes && selectedCounterCarrier.parent.attributes.unique) {
              counterNames = Object.keys(selectedCounterCarrier.parent.counters);
          } else {
              counterNames = Object.keys(selectedCounterCarrier.counters);
          }
      }
      for (var i = 0; i < counterNames.length; i += 1) {
            counters[counterNames[i]] = counterNames[i];
        }
      return GameCreator.htmlStrings.singleSelector(counters, attrName, value);
  },

  counterTypeInput: function(attrName, value) {
      return GameCreator.htmlStrings.singleSelector({'Add': 'add', 'Reduce': 'reduce', 'Set to': 'set'}, attrName, value);
  },

  movementTypeInput: function(attrName, value) {
      return GameCreator.htmlStrings.singleSelector({'Relative': 'relative', 'Absolute': 'absolute'}, attrName, value);
  },

  sceneInput: function(attrName, value) {
      return GameCreator.htmlStrings.singleSelector(GameCreator.helpers.getSelectableScenes(), attrName, value, 'number');
  },

  stringInput: function(attrName, value) {
      return '<input type="text" class="textField" data-type="string" data-attrName="' + attrName + '" value="' + (value === undefined ? '' : value) + '"/>'
  },

  directionInput: function(attrName, value) {
      return GameCreator.htmlStrings.singleSelector(GameCreator.directions, attrName, value);
  },

  rangeInput: function(attrName, value) {
      var valueString;
      if (Array.isArray(value)) {
          if (value.length === 1) {
              valueString = value[0];
          }
          else {
              valueString = value[0] + ":" + value[1];
          }
      } else {
          valueString = value;
      }
      return '<input type="text" class="rangeField" data-type="range" data-attrName="' + attrName + '" value="' + (valueString === undefined ? '' : valueString) + '"/>'
  },

  checkboxInput: function(attrName, checked) {
      return '<input type="checkbox" class="checkboxField" data-type="checkbox" data-attrName="' +
          attrName + '" ' + (checked ? 'checked' : '') + ' />'
  },

  imageInput: function(attrName, value) {
      return '<input type="text" class="textField" data-type="image" data-attrName="' + attrName + '" value="' + (value ? value.src : '') + '"/>'
  },

  inputLabel: function(labelText) {
      return '<label>' + labelText + '</label>';
  },

  parameterGroup: function(parameterInput) {
      return '<div class="actionParameter">' + parameterInput + '</div>'
  },

  actionRow: function(name, action) {
      var result = '<div class="actionRow headingNormalBlack"><div class="headingNormalBlack removeActionBox"><a class="removeActionButton" href="">X</a></div>\
      <span class="actionText">' + name;
      for (var key in action.parameters) {
          if (action.parameters.hasOwnProperty(key)) {
              result += '<br/><span style="font-size: 12px">' + key + ': ' + action.parameters[key] + ' ';
          }
      }
      result += ' \
      </span> \
      </span> \
      </div> \
      <br style="clear:both;"/>';

      return result;
  },

  defaultMenuElement: function(text) {
      return '<a class="btn tab defaultMenuElement headingNormalBlack" data-name="' + text + '">' + text + '</a>';
  },

  keyMenuElement: function(text) {
      return '<a class="btn tab defaultMenuElement headingNormalBlack" data-name="' + text + '">' + text + '</a>';
  },

  stateMenuElement: function(id, name) {
    return '<a class="btn tab defaultMenuElement headingNormalBlack" data-id="' + id + '">' + name + '</a>';
  },

  counterEventMenuElement: function(value, type) {
  	return '<a class="btn tab counterEventMenuElement headingNormalBlack" data-value="' + value + '" data-type="' + type + '">' + type + " " + value+ '</a>';
  },

  globalObjectElement: function(object) {
    var image = object.getDefaultState().image;
    $(image).css("width","65");
    var imgDiv = $(document.createElement("div"));
    imgDiv.append(image);
    imgDiv.addClass("global-object-element-image");

    var div = $(document.createElement("div")).append(imgDiv);
    $(div).attr("id", "object-library-element-" + object.objectName);

      return div;
  },

  globalObjectLibraryItem: function(object) {
    var libraryItem = document.createElement("li");
    $(libraryItem).append(object.objectName);
    $(libraryItem).addClass("library-global-object-button");

    return libraryItem;
  },

  sceneObjectLibraryItem: function(object) {
    var libraryItem = document.createElement("li");
    $(libraryItem).append(object.attributes.instanceId);
    $(libraryItem).addClass("library-scene-object-button");
    $(libraryItem).attr('data-instanceId', object.attributes.instanceId)

    return libraryItem;
  },

  routeNode: function(node, index) {
    var result = ' \
    <div class="route-node-container" style="position:absolute; top:' + node.y + 'px;left:' + node.x + 'px;"> \
    <div class="route-node" data-index="' + index + '"> \
    <span class="route-node-arrow"></span> \
    <span class="route-node-label">' + (index + 1) + '</span> \
    </div> \
    <div class="btn-group sequenced route-node-actions"> \
    <a class="btn success grow add-node-button" data-index="' + index + '">+</a>';

    if (index != 0) {
      result += '<a class="btn warning grow remove-node-button" data-index="' + index + '">x</a>';
    }

    if(node.bounceNode) {
      result += '<a class="btn toggle-bounce-node-button" data-index="' + index + '">Turn</a>';
    } else {
      result += '<a class="btn toggle-bounce-node-button" data-index="' + index + '">Continue</a>';
    }

    result += ' \
    </div> \
    </div>';

    return result;
  },

  defaultEventInformationWindow: function(title, imageSrc) {
    var result = ' \
    <div class="panel wide"> \
    <div class="panel-header"> \
    <span class="panel-title">' + title + '</span> \
    </div>';

    result += ' \
    <div class="panel-body"> \
    <div id="event-information-window"> \
    <div class="image-preview image-preview-large"> \
    <img src="' + imageSrc + '" /> \
    </div> \
    </div> \
    </div> \
    </div>';

    return result;
  },

  sceneStartedEventInformationWindow: function() {
    var result = ' \
    <div id="event-information-window"> \
    </div>';

    return result;
  },

  collisionEventInformationWindow: function(title, image1Src, image2Src) {
    var result = ' \
    <div class="panel wide"> \
    <div class="panel-header"> \
    <span class="panel-title">' + title + '</span> \
    </div>';

    result += ' \
    <div class="panel-body"> \
    <div id="event-information-window"> \
    <div class="image-preview"> \
    <img src="' + image1Src + '" /> \
    </div> \
    <div class="image-preview"> \
    <img src="' + image2Src + '" /> \
    </div> \
    </div> \
    </div> \
    </div>';

    return result;
  },

  editActionsWindow: function(infoWindowHtml) {
    var result = ' \
    <div class="dialogue right"> \
    <div id="select-action-window">'
    result += infoWindowHtml;
    result += '<div class="panel-group sequenced clearfix">\
    <div id="dialogue-right-action-column" class="panel tall"></div>\
    <div id="dialogue-right-select-column" class="panel tall"></div>\
    </div> \
    </div> \
    </div>';

    return result;
  },

  addGlobalObjectWindow: function() {
    var result = ' \
    <div class="dialogue bottom"> \
    <div id="add-global-object-window"> \
    <div class="panel-group sequenced clearfix"> \
    <div class="panel-header"> \
    <span>Add global object</span> \
    <a id="close-dialogue-button" class="btn warning">x</a> \
    </div>';

    result += GameCreator.htmlStrings.getColumn('Type of object', 'dialogue-panel-object-type-group');
    result += GameCreator.htmlStrings.getColumn('Object', 'dialogue-panel-object-type');
    result += ' \
    <div id="add-global-object-form-content" class="panel tall large"> \
    </div> \
    </div> \
    </div>';

    return result;
  },
  
  selectGlobalObjectPresentation: function(globalObjectId) {
    var globalObject = GameCreator.helpers.getGlobalObjectById(globalObjectId);
    return '<img width="25" height="25" src="' + globalObject.getDefaultState().attributes.image.src + '"/><span>' + globalObject.objectName + '</span>';
  },

  createNameSelectionForm: function(placeholder, id, saveCallback, cancelCallback) {
    var result = document.createElement('div');
    $(result).attr('id', id);

    var nameInput = document.createElement('input');
    $(nameInput).attr('type', 'text');
    $(nameInput).attr('placeholder', placeholder);
    $(result).append(nameInput);

    var btnGroup = document.createElement('div');
    $(btnGroup).addClass('btn-group sequenced');
    $(result).append(btnGroup);


    var saveButton = document.createElement('a');
    $(saveButton).addClass('btn success');
    $(saveButton).click(saveCallback);
    $(saveButton).html('Save');
    $(btnGroup).append(saveButton);

    var cancelButton = document.createElement('a');
    $(cancelButton).addClass('btn warning');
    $(cancelButton).click(cancelCallback);
    $(cancelButton).html('Cancel');
    $(btnGroup).append(cancelButton);

    return result;
  },

  getCounterEventForm: function(formId) {
    var result = '<div id="' + formId + '">' + GameCreator.htmlStrings.inputLabel("Type:");
    result += GameCreator.htmlStrings.singleSelector({atValue: "atValue", aboveValue: "aboveValue", belowValue: "belowValue"});
    result += GameCreator.htmlStrings.inputLabel("Value:");
    result += GameCreator.htmlStrings.numberInput("value");
    result += '<button class="saveButton regularButton">Save</button>';
    result += '</div>';

    return result;
  },
  
  debugInformation: function(info) {
    var result = '';

    for (var key in info) {
      if (info.hasOwnProperty(key)) {
        result += '<span>' + key + ': ' + info[key] + '</span><br/>';
      }
    }

    return result;
  },

  sceneTab: function(scene, sceneActive) {
    return '<a class="btn tab ' + (sceneActive ? 'active' : '')  + '" data-sceneid="' + scene.id + '" draggable="true">' + scene.attributes.name + '</a>';
  },

  addSceneTab: function() {
    return '<a id="add-scene-tab" class="btn tab small">+</a>';
  },

  imageSelectControls: function() {
    return  '<img class="selected-image-preview"></img> \
            <a class="btn success grow upload-image-button">Set Image</a>'
  },

  getColumn: function(title, id) {
    var i;
    var result = ' \
    <div class="panel tall"> \
    <div class="panel-header"> \
    <span>' + title + '</span> \
    </div> \
    <div id="' + id + '" class="btn-group wide"> \
    </div> \
    </div>';

    return result;
  },

  getScenePropertiesForm: function() {
    var result = ' \
    <div class="panel-paragraph"> \
    <ul class="parameter-groups"> \
    <li> \
    <div class="parameter"> \
    <div class="parameter-header"> \
    <span>Scene</span> \
    </div> \
    <table> \
    <tr> \
    <td><label>Name:</label></td> \
    <td id="side-property-name" data-inputtype="stringInput"></td> \
    </tr> \
    <tr> \
    <td><label>Background Color:</label></td> \
    <td id="side-property-bgColor" data-inputtype="stringInput"></td> \
    </tr> \
    <tr> \
    <td><label>Background Image:</label></td> \
    <td id="side-property-bgImage" data-inputtype="imageInput"></td> \
    </tr> \
    </table> \
    </div> \
    </li> \
    </ul> \
    </div> \
    <div class="btn-group sequenced"> \
    <a id="setup-scene-actions" class="btn success grow">Scene Started Actions</a> \
    <a id="delete-scene-button" class="btn warning grow">Delete Scene</a> \
    </div>'

    return result;
  },

  sceneObjectDeleteButton: function() {
    return  '<a id="delete-sceneobject-button" class="btn warning grow">Delete</button>';
  },

  objectTypeGroupDescription: function(objectTypeGroup) {
    if (objectTypeGroup === 'playerObjectTypes') return GameCreator.htmlStrings.playerObjectDescription();
    if (objectTypeGroup === 'gameObjectTypes') return GameCreator.htmlStrings.gameObjectDescription();
    if (objectTypeGroup === 'counterDisplayTypes') return GameCreator.htmlStrings.counterDisplayDescription();
  },

  getDescriptionColumn: function(title, content) {
    var result = ' \
    <div class="panel-header"> \
    <span>' + title + '</span> \
    </div> \
    <div class="panel-body">';

    result += content;
    result += '</div>';
    
    return result;
  },

  playerObjectDescription: function() {
    var result = ' \
    <article> \
    <div id="global-object-image" class="player"></div> \
    <p class="global-object-description"><strong>Player Objects</strong> are objects controlled by the player.</p> \
    </article>';

    return GameCreator.htmlStrings.getDescriptionColumn('Player Objects', result);
  },

  gameObjectDescription: function() {
    var result = ' \
    <article> \
    <div id="global-object-image" class="game"></div> \
    <p class="global-object-description"><strong>Game Objects</strong> are static objects or objects controlled by the computer.</p> \
    </article>';

    return GameCreator.htmlStrings.getDescriptionColumn('Game Objects', result);
  },

  counterDisplayDescription: function() {
    var result = ' \
    <article> \
    <div id="global-object-image" class="counter"></div> \
    <p class="global-object-description"><strong>Counters</strong> are objects that contain and display a value. They can also have actions that can trigger when the counter changes or reaches a certain value.</p> \
    </article>';

    return GameCreator.htmlStrings.getDescriptionColumn('Counters', result);
  },
};