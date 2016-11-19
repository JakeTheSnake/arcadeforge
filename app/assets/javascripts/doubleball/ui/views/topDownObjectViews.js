GameCreator.TopDownObject.prototype.getEvents = function() {
  return '<a class="btn tab" data-uifunction="setupOnClickActionsForm" title="Actions that will be run when the player\n clicks this object.">On Click</a> \
          <a class="btn tab" data-uifunction="setupKeyEventsForm" title="Actions that will be run on this object\n when the player presses a certain key.">On Keypress</a>';
};

GameCreator.TopDownObject.prototype.getDescription = function() {
  return "A Top Down Object is a player controlled object that can move\
    freely in eight directions. It is steered with the arrow keys.";
};

GameCreator.TopDownObject.prototype.getPropertiesForm = function() {
  var result = ' \
  <article> \
    <fieldset class="sequenced"> \
      <div id="object-property-width-container" class="input-container"> \
      </div> \
      <div id="object-property-height-container" class="input-container"> \
      </div> \
    </fieldset> \
    <fieldset class="sequenced"> \
      <div id="object-property-maxSpeed-container" class="input-container"> \
      </div> \
    </fieldset> \
  </article> \
  <article> \
    <h2>Set default graphic</h2> \
    <div id="object-property-image-container" class="input-container hidden"> \
    </div> \
    <div id="global-object-image-upload-controls"> \
    </div>';

  return result;
};

GameCreator.TopDownObject.prototype.getSceneObjectForm = function() {
  var result = ' \
  <ul class="parameter-groups"> \
    <li> \
      <div class="parameter"> \
        <div class="parameter-header"> \
          <span>Size and Position</span> \
        </div> \
        <table> \
          <tr> \
            <td><label>Width:</label></td> \
            <td id="side-property-width" data-inputtype="rangeInput"></td> \
          </tr> \
          <tr> \
            <td><label>Height:</label></td> \
            <td id="side-property-height" data-inputtype="rangeInput"></td> \
          </tr> \
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
          <span>Speed</span> \
        </div> \
        <table> \
          <tr> \
            <td><label>Speed Limit:</label></td> \
            <td id="side-property-maxSpeed" data-inputtype="rangeInput"></td> \
          </tr> \
        </table> \
      </div> \
    </li> \
    <li> \
      <div class="parameter"> \
        <div class="parameter-header"> \
          <span>Camera</span> \
        </div> \
        <table> \
          <tr> \
            <td><label>Controls Camera:</label></td> \
            <td id="side-property-isControllingCamera" data-inputtype="checkboxInput"></td> \
          </tr> \
        </table> \
      </div> \
    </li> \
  </ul>';

  return result;
};
