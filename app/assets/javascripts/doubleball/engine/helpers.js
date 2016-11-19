/*global GameCreator*/
(function() {
    "use strict";
    GameCreator.helpers.determineQuadrant = function(base, obj) {
        var x = obj.attributes.x;
        var y = obj.attributes.y;
        var width = obj.attributes.width;
        var height = obj.attributes.height;
        var baseWidth = base.attributes.width;
        var baseHeight = base.attributes.height;
        var objMidX = x + width / 2;
        var objMidY = y + height / 2;
        var baseMidX = base.attributes.x + base.attributes.width / 2;
        var baseMidY = base.attributes.y + base.attributes.height / 2;
        var baseEdgeTLX = base.attributes.x;
        var baseEdgeTLY = base.attributes.y;

        var baseEdgeTRX = base.attributes.x + baseWidth;
        var baseEdgeTRY = base.attributes.y;

        var baseEdgeBLX = base.attributes.x + baseHeight;
        var baseEdgeBLY = base.attributes.y;

        var baseEdgeBRX = base.attributes.x + baseWidth;
        var baseEdgeBRY = base.attributes.y + baseHeight;
        //Top left quadrant
        if (objMidX - baseMidX <= 0 && objMidY - baseMidY <= 0) {
            if (objMidX - baseEdgeTLX > objMidY - baseEdgeTLY) {
                return 1;
            }
            return 4;
        }
        //Top right quadrant
        else if (objMidX - baseMidX >= 0 && objMidY - baseMidY <= 0) {
            if (objMidX - baseEdgeTRX < baseEdgeTRY - objMidY) {
                return 1;
            }
            return 2;
        }
        //Bottom right quadrant
        else if (objMidX - baseMidX >= 0 && objMidY - baseMidY >= 0) {
            if (objMidX - baseEdgeBRX < objMidY - baseEdgeBRY) {
                return 3;
            }
            return 2;
        }
        //Bottom left quadrant
        else if (objMidX - baseMidX <= 0 && objMidY - baseMidY >= 0) {
            if (baseEdgeBLX - objMidX < objMidY - baseEdgeBLY) {
                return 3;
            }
            return 4;
        }
    };

    GameCreator.helpers.doCollision = function(object, targetObject) {
        var event = GameCreator.helpers.getObjectById(object.parent.events.onCollideSets, targetObject.parent.id);
        var caSets = event ? event.caSets : undefined;
        var j, choosableActions, newSetsItem, currentSet;
        targetObject.invalidated = true;
        if (caSets !== undefined) {
            GameCreator.helpers.runEventActions(caSets, object, undefined, {collisionObject: targetObject});
            object.collidingWith.push(targetObject.attributes.instanceId);
        }
        else if (GameCreator.state !== 'playing') {
            choosableActions = GameCreator.helpers.getCollisionActions(object.parent.objectType);
            newSetsItem = {id: targetObject.parent.id, caSets: [new GameCreator.ConditionActionSet()]};
            object.parent.events.onCollideSets.push(newSetsItem);
            var titleString = "'" + object.parent.objectName + "' collided with '" + targetObject.objectName + "'";
            GameCreator.UI.openEditActionsWindow(
                GameCreator.htmlStrings.collisionEventInformationWindow(titleString, object.getCurrentImage().src, targetObject.getCurrentImage().src),
                newSetsItem.caSets[0], 'collision', object.parent.objectName
            );
        }
    };

    GameCreator.helpers.updateObjectCollisionArrays = function(object, instanceId) {
        var objectBeneathIndex = object.objectsBeneath.indexOf(instanceId);
        var objectAboveIndex = object.objectsAbove.indexOf(instanceId);
        var objectLeftIndex = object.objectsLeft.indexOf(instanceId);
        var objectRightIndex = object.objectsRight.indexOf(instanceId);
        if (objectBeneathIndex !== -1) {
            object.objectsBeneath.splice(objectBeneathIndex, 1);
        }
        if (objectAboveIndex !== -1) {
            object.objectsAbove.splice(objectAboveIndex, 1);
        }
        if (objectLeftIndex !== -1) {
            object.objectsLeft.splice(objectLeftIndex, 1);
        }
        if (objectRightIndex !== -1) {
            object.objectsRight.splice(objectRightIndex, 1);
        }
    };

    GameCreator.helpers.checkCollisions = function(object) {

        //Check for border collisions.
        var x = object.attributes.x;
        var y = object.attributes.y;
        var width = object.attributes.width;
        var height = object.attributes.height;
        var i, j, runtimeObjectsItem, targetObject, collisionItem, isColliding;

        var borderObjects = Object.keys(GameCreator.borderObjects);

        for (i = 0; i < borderObjects.length; i++) {
            var borderObject = GameCreator.borderObjects[borderObjects[i]];
            var isCollidingWithBorderObject = borderObject.collidesWith(object);
            if (isCollidingWithBorderObject && !object.alreadyCollidesWith(borderObject.objectName)) {
                GameCreator.helpers.doCollision(object, borderObject);
            } else if (!isCollidingWithBorderObject) {
                object.removeFromCollidingList(borderObject.objectName);
            }
        }

        //Check for collisions with other objects.
        if (GameCreator.state === 'directing') {
            for (j = 0; j < GameCreator.collidableObjects.length; j += 1) {
                runtimeObjectsItem = GameCreator.collidableObjects[j];
                for (i = 0; i < runtimeObjectsItem.runtimeObjects.length; i += 1) {
                    targetObject = runtimeObjectsItem.runtimeObjects[i];
                    isColliding = GameCreator.helpers.checkObjectCollision(object, targetObject);
                    if (isColliding && !object.alreadyCollidesWith(targetObject.attributes.instanceId)) {
                        GameCreator.helpers.doCollision(object, targetObject);
                    } else if (!isColliding) {
                        object.removeFromCollidingList(targetObject.attributes.instanceId);
                    }
                }
            }
        } else {
            for (j = 0; j < object.parent.events.onCollideSets.length; j += 1) {
                collisionItem = object.parent.events.onCollideSets[j];
                runtimeObjectsItem = GameCreator.helpers.getObjectById(GameCreator.collidableObjects, collisionItem.id);
                if (GameCreator.helpers.caSetsHaveActions(collisionItem) && runtimeObjectsItem) {
                    for (i = 0; i < runtimeObjectsItem.runtimeObjects.length; i += 1) {
                        targetObject = runtimeObjectsItem.runtimeObjects[i];
                        isColliding = GameCreator.helpers.checkObjectCollision(object, targetObject);
                        if (isColliding && !object.alreadyCollidesWith(targetObject.attributes.instanceId)) {
                            GameCreator.helpers.doCollision(object, targetObject);
                        } else if (!isColliding) {
                            object.removeFromCollidingList(targetObject.attributes.instanceId);
                        }
                    }
                }
            }
        }
    };

    /**
    * This function check if any Condition-Action-Set in this event contains actions.
    * If it does, we don't have to check for any collisions.
    */
    GameCreator.helpers.caSetsHaveActions = function(eventItem) {
        var i;
        for (i = 0; i < eventItem.caSets.length; i += 1) {
            if (eventItem.caSets[i].actions.length > 0) {
                return true;
            }
        }
        return false;
    }

    GameCreator.helpers.checkObjectCollision = function(object, targetObject) {
        if (!(object === targetObject)) {
            if ((Math.abs((object.attributes.x + object.attributes.width / 2) - (targetObject.attributes.x + targetObject.attributes.width / 2)) < object.attributes.width / 2 + targetObject.attributes.width / 2) &&
                    (Math.abs((object.attributes.y + object.attributes.height / 2) - (targetObject.attributes.y + targetObject.attributes.height / 2)) < object.attributes.height / 2 + targetObject.attributes.height / 2)) {
                return true;
            }
        }
        return false;
    };

    GameCreator.helpers.calcAngularSpeed = function(maxSpeed) {
        return Math.pow(Math.pow(maxSpeed, 2) / 2, 0.5);
    };

    GameCreator.helpers.toString = function(thing) {
        if (typeof (thing) === "object") {
            if (thing.objectName) {
                return thing.objectName;
            } else if (thing.name) {
                return thing.name;
            }
        }
        return String(thing);
    };

    GameCreator.helpers.parseBool = function(string) {
        return string === 'true' ? true : false;
    };

    GameCreator.helpers.parseRange = function(string) {
        var i, range;
        if (string.indexOf(':') > -1) {
            if (!(/^\-?\d+:\-?\d+$/.test(string)) ) {
                throw '"' + string + '" is not a valid range. Should be "&lt;num&gt;"" or "&lt;num&gt;:&lt;num&gt;"';
            } 
            range = string.split(":", 2);
            for (i = 0; i < range.length; i += 1) {
                range[i] = GameCreator.helpers.parseNumber(range[i]);
            }    
        } else {
            range = [];
            range.push(GameCreator.helpers.parseNumber(string));
        }
        
        return range;
    };

    GameCreator.helpers.calcUnitVector = function(x, y) {
        var magnitude = Math.sqrt((x * x) + (y * y));
        if (magnitude === 0) {
            return {x: 0, y: 0};
        }
        return {x: x / magnitude, y: y / magnitude};
    };

    GameCreator.helpers.findGlobalObjectByName = function(name) {
        var object = GameCreator.globalObjects[name];
        if (!object) {
            object = GameCreator.borderObjects[name];
        }
        return object;
    };

    GameCreator.helpers.getGlobalObjectById = function(argId) {
        var id = Number(argId);
        var objects = Object.keys(GameCreator.globalObjects);
        var i;
        for (i = 0; i < objects.length; i += 1) {
            if (GameCreator.globalObjects[objects[i]].id === id) {
                return GameCreator.globalObjects[objects[i]];
            }
        }
        objects = Object.keys(GameCreator.borderObjects);
        for (i = 0; i < objects.length; i += 1) {
            if (GameCreator.borderObjects[objects[i]].id === id) {
                return GameCreator.borderObjects[objects[i]];
            }
        }
    };

    GameCreator.helpers.getValue = function(input) {
        input = $(input);
        var i, range, value;
        if (input.attr("data-type") === "string") {
            return input.val() ? input.val().replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
        } else if (input.attr("data-type") === "number") {
            return GameCreator.helpers.parseNumber(input.val());           
        } else if (input.attr("data-type") === "image") {
            return GameCreator.helpers.parseImage(input.val());
        } else if (input.attr("data-type") === "bool") {
            return GameCreator.helpers.parseBool(input.val());
        } else if (input.attr("data-type") === "range") {
            return GameCreator.helpers.parseRange(input.val());
        } else if (input.attr("data-type") === "checkbox") {
            return input.is(":checked");
        } else {
            return input.val() ? input.val().replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
        }
    };

    GameCreator.helpers.parseNumber = function(value) {
        if (!(/^\-?\d+$/.test(value))) {
            throw "'" + value + "' is not a number";
        }
        return parseInt(value);
    };

    GameCreator.helpers.parseImage = function(imgSrc) {
        var image = new Image();
        //TODO: Disabled this check. Need to allow empty image i think. Show some kind of "?" image as default then.
        //if (!(/(jpg|png|gif)$/.test(imgSrc))) throw '"' + imgSrc + '" is not a valid image URL';
        image.src = imgSrc;
        image.onload = function() {
            $(image).data('loaded', true);
            if (GameCreator.state === 'editing') {
                GameCreator.render();
            }
        };
        return image;
    };

    GameCreator.helpers.getRandomFromRange = function(range) {
        var value;
        if (Array.isArray(range)) {
            if (range.length === 2) {
                var max = parseInt(range[1], 10);
                var min = parseInt(range[0], 10);
                value = Math.floor((Math.random() * (max - min)) + min);
            } else {
                value = parseInt(range[0], 10);
            }
        } else {
            value = parseInt(range, 10);
        }
        return value || 0;
    };

    GameCreator.helpers.getObjectById = function(array, id) {
        var i;
        for (i = 0; i < array.length; i += 1) {
            if (array[i].id === id) {
                return array[i];
            }
        }
    };

    GameCreator.helpers.removeObjectFromArrayByInstanceId = function(array, id) {
        var found = false;
        var i;
        for (i = 0; i < array.length; i += 1) {
            if (array[i].attributes.instanceId === id) {
                found = true;
                break;
            }
        }
        if (found) {
            array.splice(i, 1);
        }
    };

    GameCreator.helpers.removeObjectFromArrayById = function(array, id) {
        var found = false;
        var i;
        for (i = 0; i < array.length; i += 1) {
            if (array[i].id === id) {
                found = true;
                break;
            }
        }
        if (found) {
            array.splice(i, 1);
        }
    };

    GameCreator.helpers.setStandardProperties = function(globalObj, args) {
        args = args ? args : {};
        globalObj.objectName = args.objectName;
        globalObj.attributes = {
            unique: args.unique != undefined ? args.unique : false
        };
        globalObj.parentCounters = {};
        globalObj.counters = {};
        globalObj.currentState = 0;
        globalObj.events = {};
        globalObj.events.onDestroySets = [];
        globalObj.events.onCreateSets = [];
        globalObj.states = [{
            name: "Default",
            id: 0,
            attributes: {
                image: args.image != undefined ? args.image : '',
                width: args.width != undefined ? args.width : [50],
                height: args.height != undefined ? args.height : [50],
            }
        }];
    };

    GameCreator.helpers.getCollidableObjectNames = function(globalObj) {
        var result = [];
        var selectableObjects = {};
        var objName, objId;
        $.extend(selectableObjects, GameCreator.globalObjects, GameCreator.borderObjects);
        for (objName in selectableObjects) {
            objId = GameCreator.helpers.findGlobalObjectByName(objName).id;
            if (selectableObjects.hasOwnProperty(objName) && 
                !GameCreator.helpers.getObjectById(globalObj.events.onCollideSets, objId) && 
                selectableObjects[objName].isCollidable) {
                    result.push(objName);
            }
        }

        return result;
    };

    GameCreator.helpers.getStandardAttributes = function() {
        return {"image": GameCreator.htmlStrings.imageInput,
          "width": GameCreator.htmlStrings.rangeInput,
          "height": GameCreator.htmlStrings.rangeInput};
    };

    GameCreator.helpers.getStandardNonStateAttributes = function() {
        return {"unique": GameCreator.htmlStrings.checkboxInput};
    };

    GameCreator.helpers.getNonCollisionActions = function(objectType) {
        if (objectType === "MouseObject") {
            return GameCreator.actionGroups.mouseNonCollisionActions;
        } else {
            return GameCreator.actionGroups.nonCollisionActions;
        }
    };

    GameCreator.helpers.getCollisionActions = function(objectType) {
        if (objectType === "MouseObject") {
            return GameCreator.actionGroups.mouseCollisionActions;
        } else {
            return GameCreator.actionGroups.collisionActions;
        }
    };

    GameCreator.helpers.getSelectableConditions = function() {
        if (GameCreator.UI.state.selectedItemType === 'globalObject') {
            return GameCreator.conditionGroups.objectConditions;
        } else if (GameCreator.UI.state.selectedItemType === 'globalCounter') {
            return GameCreator.conditionGroups.globalCounterConditions;
        }
    };

    GameCreator.helpers.getSelectableActions = function(eventType, objectType) {
        if (eventType === 'collision') {
            return GameCreator.helpers.getCollisionActions(objectType);
        } else if (eventType === 'globalcounter' || eventType === 'scenestart') {
            return GameCreator.actionGroups.nonObjectActions;
        } else {
            return GameCreator.helpers.getNonCollisionActions(objectType);
        }
    }

    GameCreator.helpers.labelize = function(name) {
        var segments = name.match(/([A-Z0-9]?[a-z0-9]*)/g);
        for (var i = 0; i < segments.length; i++) {
            segments[i] = segments[i].charAt(0).toUpperCase() + segments[i].slice(1);
        }
        return segments.join(" ");
    };

    GameCreator.helpers.populateGlobalObjectPropertiesForm = function(attributes, attrToInputMap, containerId, globalObj) {
        var i, keys = attributes ? Object.keys(attributes) : [];

        for (i = 0; i < keys.length; i += 1) {
            var attributeName = keys[i];
            if (attrToInputMap[attributeName]) {
                $("#object-property-" + attributeName + "-container").html(
                    attrToInputMap[attributeName](attributeName, attributes[attributeName]) + 
                    GameCreator.htmlStrings.inputLabel(GameCreator.helpers.getPrettyName(attributeName))
                );
            }
        }
        $('#' + containerId + ' input').on('change', function() {
            try {
                GameCreator.saveInputValueToObject($(this), attributes);
                //If global object is unique, mirror change to instances
                if (globalObj.attributes.unique) {
                    var instances = GameCreator.helpers.getAllInstancesOfObject(globalObj);
                    for (var i = 0; i < instances.length; i += 1) {
                        instances[i].attributes[$(this).data('attrname')] = attributes[$(this).data('attrname')];
                        instances[i].setDisplayValues();
                        GameCreator.render();
                    }
                }

                //If unique is set, need to reset counters and mirror all current properties to instances.
                if ($(this).data('attrname') === 'unique') {
                    GameCreator.getActiveScene().objects.forEach(function(sceneObj){
                        if(sceneObj.parent === globalObj) {
                            GameCreator.resetCounters(sceneObj, sceneObj.parent.parentCounters);
                        }
                    });
                    if (attributes.unique) {
                        var instances = GameCreator.helpers.getAllInstancesOfObject(globalObj);
                        for (var i = 0; i < instances.length; i += 1) {
                            GameCreator.helpers.mirrorAttributesToInstances(globalObj);
                        }
                    }
                }
            } catch (err) {}
        });
        $('#' + containerId + ' input').blur(function() {
            try {
                GameCreator.saveInputValueToObject($(this), attributes);
            } catch (err) {
                $(this).addClass('properties-validation-flash'); // ANIMATION
                var that = $(this);
                setTimeout(function() { that.removeClass('properties-validation-flash'); }, 700);
                GameCreator.UI.createValidationBox(this, err);
            }
        });
    };

    GameCreator.helpers.mirrorAttributesToParent = function(sceneObject, globalObject) {
        var i;
        var parentAttrs = globalObject.getDefaultState().attributes;
        var parentAttrNames = Object.keys(parentAttrs);
        for(i = 0; i < parentAttrNames.length; i += 1) {
            if (sceneObject.attributes[parentAttrNames[i]] !== undefined) {
                //Set default state properties of global object
                if (sceneObject.attributes[parentAttrNames[i]].constructor === Array) {
                    parentAttrs[parentAttrNames[i]] = sceneObject.attributes[parentAttrNames[i]].slice();
                } else {
                    parentAttrs[parentAttrNames[i]] = sceneObject.attributes[parentAttrNames[i]];
                }
            }
        }
    };

    GameCreator.helpers.mirrorAttributesToInstances = function(globalObject) {
        var i, j;
        var parentAttrs = globalObject.getDefaultState().attributes;
        var parentAttrNames = Object.keys(parentAttrs);
        var sceneObjectInstances = GameCreator.helpers.getAllInstancesOfObject(globalObject);
        for(i = 0; i < parentAttrNames.length; i += 1) {
            if (sceneObjectInstances[0] && sceneObjectInstances[0].attributes[parentAttrNames[i]] !== undefined) {
                for (j = 0; j < sceneObjectInstances.length; j += 1) {
                    if (globalObject.getDefaultState().attributes[parentAttrNames[i]].constructor === Array) {
                        sceneObjectInstances[j].attributes[parentAttrNames[i]] = globalObject.getDefaultState().attributes[parentAttrNames[i]].slice();
                    } else {
                        sceneObjectInstances[j].attributes[parentAttrNames[i]] = globalObject.getDefaultState().attributes[parentAttrNames[i]];
                    }
                    sceneObjectInstances[j].setDisplayValues();
                }
            }
        }
    }

    GameCreator.helpers.populateSidePropertiesForm = function(sideObject, onChangeCallback) {
        var i;
        var attributes = sideObject.attributes;
        for (i = 0; i < Object.keys(attributes).length; i += 1) {
            var attributeName = Object.keys(attributes)[i];
            GameCreator.UI.setupValuePresenter($("#side-property-" + attributeName), attributes, attributeName, sideObject, onChangeCallback);
        }
    };

    GameCreator.helpers.startsWith = function(baseString, comparator) {
        return baseString.substring(0, comparator.length) === comparator;
    };



    GameCreator.helpers.setMouseCursor = function(dragFunc) {
        var cursor = "auto";
        switch (dragFunc) {
            case GameCreator.SceneObject.prototype.resizeNW:
            case GameCreator.SceneObject.prototype.resizeSE:
            case GameCreator.SceneObject.prototype.resizeMouseAreaNW:
            case GameCreator.SceneObject.prototype.resizeMouseAreaSE:
                cursor = "nw-resize"
                break;
            case GameCreator.SceneObject.prototype.resizeNE:
            case GameCreator.SceneObject.prototype.resizeSW:
            case GameCreator.SceneObject.prototype.resizeMouseAreaNE:
            case GameCreator.SceneObject.prototype.resizeMouseAreaSW:
                cursor = "ne-resize"
                break;
            case GameCreator.SceneObject.prototype.resizeW:
            case GameCreator.SceneObject.prototype.resizeE:
            case GameCreator.SceneObject.prototype.resizeMouseAreaW:
            case GameCreator.SceneObject.prototype.resizeMouseAreaE:
                cursor = "w-resize";
                break;
            case GameCreator.SceneObject.prototype.resizeN:
            case GameCreator.SceneObject.prototype.resizeS:
            case GameCreator.SceneObject.prototype.resizeMouseAreaN:
            case GameCreator.SceneObject.prototype.resizeMouseAreaS:
                cursor = "n-resize";
                break;
            case GameCreator.SceneObject.prototype.moveObject:
                cursor = "move";
                break;
            default:
                cursor = "auto";
                break;
        }
        $(GameCreator.mainCanvas).css("cursor", cursor);
    };

    GameCreator.helpers.getPresentationForInputValue = function(attributes, attrName, type, obj) {
        var scene, value = attributes[attrName];
        if (value !== undefined && value !== null && value !== '') {
            switch (type) {
                case "rangeInput":
                    if (value.length == 1) {
                        return value[0];
                    } else if (value.length == 2) {
                        return (value[0] + " to " + value[1]);
                    } else {
                        return value;
                    }
                case "globalObjectInput":
                case "shootableObjectInput":
                    if (value === 'this') {
                        return value;
                    }
                    return GameCreator.helpers.getGlobalObjectById(Number(value)).objectName;
                case "stateInput":
                    if (attributes.objectId && attributes.objectId !== 'this') {
                        obj = GameCreator.helpers.getGlobalObjectById(Number(attributes.objectId));
                    }
                    return GameCreator.helpers.getObjectById(obj.states, Number(value)).name;
                case "counterTypeInput":
                    return GameCreator.helpers.getPrettyName(value);
                case "sceneInput":
                    scene = GameCreator.getSceneById(Number(value));
                    return scene ? scene.attributes.name : '*Scene removed*';
                case "imageInput":
                    return '<img src="' + value.src + '" width="40" height="40"/>';
                case 'checkboxInput':
                    return value ? 'Yes' : 'No';
                default:
                    return value;
            }
        }
        return '&lt;Edit&gt;';
    };

    GameCreator.helpers.getPrettyName = function(databaseName) {
        var prettyNames = {
            objectToCreate: 'Object',
            objectToShoot: 'Object',
            projectileSpeed: 'Speed',
            projectileDirection: 'Direction',
            objectState: 'State',
            objId: 'Object',
            counterDisplay: 'Counter',
            change: 'Add',
            set: 'Set to',
            accY: 'Gravity',
        }
        return prettyNames[databaseName] ? prettyNames[databaseName] : GameCreator.helpers.labelize(databaseName);
    };

    GameCreator.helpers.getShootableObjectIds = function(){
        var i, result = {};
        var objectNames = Object.keys(GameCreator.globalObjects);
        for(i = 0; i < objectNames.length; i += 1) {
            if(GameCreator.globalObjects[objectNames[i]].isShootable()) {
                result[objectNames[i]] = GameCreator.globalObjects[objectNames[i]].id;
            }
        }
        return result;
    };

    GameCreator.helpers.getSelectableScenes = function() {
        var result = {};
        GameCreator.scenes.forEach(function(scene){
            result[scene.attributes.name] = scene.id;
        });
        return result;
    };

    GameCreator.helpers.getGlobalObjectIds = function(includeThis) {
        var i, result = {};
        var objectNames = Object.keys(GameCreator.globalObjects);
        for (i = 0; i < objectNames.length; i += 1) {
            result[objectNames[i]] = GameCreator.globalObjects[objectNames[i]].id;
        }
        if (includeThis) {
            result.this = 'this';
        }
        return result;
    };

    GameCreator.helpers.getSelectableTimings = function(actionName) {
        var timings = GameCreator.actions[actionName].timing;
        var selectableTimings = {'Now': 'now'};
        var timingKeys = Object.keys(timings);
        for (var i = 0; i < timingKeys.length; i+=1) {
            if (timings[timingKeys[i]]) {
                selectableTimings[GameCreator.helpers.getPrettyName(timingKeys[i])] = timingKeys[i];
            }
        }
        return selectableTimings;
    };

    GameCreator.helpers.getIndexOfSceneWithId = function(targetId) {
        var i;
        for (i = 0; i < GameCreator.scenes.length; i++) {
            if (GameCreator.scenes[i].id === targetId) return i;
        }
    };

    GameCreator.helpers.getValidXCoordinate = function(x) {
        var offsetLeft = $("#main-canvas").offset().left;

        if (x < offsetLeft) x = offsetLeft;
        if (x > offsetLeft + GameCreator.props.width) x = offsetLeft + GameCreator.props.width;
        return x;
    };

    GameCreator.helpers.getValidYCoordinate = function(y) {
        var offsetTop = $("#main-canvas").offset().top;

        if (y < offsetTop) y = offsetTop;
        if (y > offsetTop + GameCreator.props.height) y = offsetTop + GameCreator.props.height;
        return y;
    };

    GameCreator.helpers.getActiveInstancesOfGlobalObject = function(objectId) {
        var i, activeObjects = GameCreator.renderableObjects;
        var result = [];
        for (i = 0; i < activeObjects.length; i += 1) {
            if (activeObjects[i].parent.id === objectId) {
                result.push(activeObjects[i]);
            }
        }
        return result;
    };

    GameCreator.helpers.runEventActions = function(eventCaSets, runtimeObj, passedCallback, runtimeParameters) {
        var currentSet, i, passingSets = [];
        for (i = 0; i < eventCaSets.length; i++) {
            currentSet = eventCaSets[i];
            if (currentSet.checkConditions(runtimeObj)) {
                passingSets.push(currentSet);
                if (passedCallback) {
                    passedCallback();
                }
            }
        }
        for(i = 0; i < passingSets.length; i += 1) {
            passingSets[i].runActions(runtimeObj, runtimeParameters);
        }
    };

    GameCreator.helpers.getAllInstancesOfObject = function(globalObject) {
        var i, j;
        var result = [];
        for (i = 0; i < GameCreator.scenes.length; i += 1) {
            for (j = 0; j < GameCreator.scenes[i].objects.length; j += 1) {
                if (GameCreator.scenes[i].objects[j].parent.id === globalObject.id) {
                    result.push(GameCreator.scenes[i].objects[j]);
                }
            }
        }
        return result;
    };

    Array.prototype.collect = function(collectFunc) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            var collectedValue = collectFunc(this[i]);
            if (collectedValue !== undefined) {
                result.push(collectedValue);
            }
        }
        return result;
    };

    GameCreator.helpers.clone = function(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = GameCreator.helpers.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    };

    GameCreator.helpers.getSelectableKeys = function(globalObj) {
        var selectableKeys = Object.keys(GameCreator.keys.keyPressed);
        selectableKeys = selectableKeys.filter(function(key) {
            return globalObj.events.onKeySets[key].length === 0;
        });
        return selectableKeys;
    };


}());