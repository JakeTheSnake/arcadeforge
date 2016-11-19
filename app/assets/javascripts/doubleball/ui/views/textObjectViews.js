(function() {
  "use strict";

  GameCreator.TextObject.prototype.getNonStatePropertiesForm = function() {
    return '';
  };

  GameCreator.TextObject.prototype.getEvents = function() {
    return '';
  };

  GameCreator.TextObject.prototype.getTabs = function() {
    return '<a class="btn tab" data-uifunction="setupPropertiesForm">Properties</a> \
            <a class="btn tab" data-uifunction="setupStatesColumn">States</a>'
  };

  GameCreator.TextObject.prototype.getDescription = function() {
    return "A Text Object shows a text on the screen. It cannot interact with other objects.";
  };

  GameCreator.TextObject.prototype.getPropertiesForm = function() {
    var result = ' \
    <article> \
    <fieldset class="sequenced"> \
      <div id="object-property-font-container" class="input-container"> \
      </div> \
      <div id="object-property-size-container" class="input-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-color-container" class="input-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-text-container" class="input-container"> \
      </div> \
    </fieldset>';

    return result;
  };

  GameCreator.TextObject.prototype.getSceneObjectForm = function() {
    var result = ' \
    <ul class="parameter-groups"> \
      <li> \
        <div class="parameter"> \
          <div class="parameter-header"> \
            <span>Size and Position</span> \
          </div> \
          <table> \
            <tr> \
              <td><label>Position X:</label></td> \
              <td id="side-property-x" data-inputtype="numberInput"></td> \
            </tr> \
            <tr> \
              <td><label>Position Y:</label></td> \
              <td id="side-property-y" data-inputtype="numberInput"></td> \
            </tr> \
          </table> \
        </div> \
      </li> \
      <li> \
        <div class="parameter"> \
          <div class="parameter-header"> \
            <span>Appearance</span> \
          </div> \
          <table> \
            <tr> \
              <td><label>Text:</label></td> \
              <td id="side-property-text" data-inputtype="stringInput"></td> \
            </tr> \
            <tr> \
              <td><label>Font:</label></td> \
              <td id="side-property-font" data-inputtype="stringInput"></td> \
            </tr> \
            <tr> \
              <td><label>Font Size:</label></td> \
              <td id="side-property-size" data-inputtype="numberInput"></td> \
            </tr> \
            <tr> \
              <td><label>Color:</label></td> \
              <td id="side-property-color" data-inputtype="stringInput"></td> \
            </tr> \
          </table> \
        </div> \
      </li> \
    </ul>';

    return result;
  };
}());
