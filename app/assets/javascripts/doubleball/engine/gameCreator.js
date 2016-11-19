/*global GameCreator, $, Image, window, requestAnimationFrame, document*/
(function() {
    "use strict";
    window.isMobile = function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    window.GameCreator = {
        paused: false,
        windowActive: true, //Whether the browser window is active or not
        state: 'editing', //State can be editing, directing or playing. 
        then: undefined, // The time before last frame

        globalObjects: {}, //Contains key value pairs where key is the (unique)name of the object.
        globalCounters: {},
        globalCounterCarriers: {},

        vpOffsetX: 0,
        vpOffsetY: 0,

        //Scene contains all objects that initially exist in one scene. It is used as a blueprint to create the runtime arrays of objects.
        scenes: [],
        activeSceneId: 0,

        sounds: {}, //All sounds within the current game
        canvasSizeFactor: 1,

        //The runtime arrays contain the current state of the game.
        collidableObjects: [],
        movableObjects: [],
        renderableObjects: [],
        eventableObjects: [],
        
        objectsToDestroy: [],
        newlyCreatedObjects: [],
        currentEffects: [],
        bufferedActions: [],

        props: {},
        touch: {
            isActive: false,
            x: 0, y: 0
        },

        addObjFunctions: {},
        commonObjectFunctions: {},
        helpers: {},
        keys: {
            keyPressed: {
                shift: false,
                ctrl: false,
                alt: false,
                space: false,
                leftMouse: false,
                rightMouse: false
            },
            latestMouseX: 0,
            latestMouseY: 0
        },

        selectedObject: undefined, //The currently selected scene object.
        hoveredObject: undefined,
        draggedNode: undefined,
        globalIdCounter: 0, // Counter used for global objects ID

        gameAudio: [],

        initialize: function() {
            var borderKeys = Object.keys(GameCreator.borderObjects);
            GameCreator.initializeBorderObjects();

            for (var i = 0; i < borderKeys.length; i += 1 ) {
                var borderObj = GameCreator.borderObjects[borderKeys[i]];
                GameCreator.addObjFunctions.commonObjectFunctions(borderObj);
                borderObj.getDefaultState = function() {
                    return {attributes: this.attributes};
                };
                borderObj.getCurrentState = function() {
                    return {attributes: this.attributes};
                };
                borderObj.getCurrentImage = function() {
                    return this.attributes.image;
                };
                borderObj.states = [];
                GameCreator.commonObjectFunctions.createState.call(borderObj, 'default', {});
            }

            document.addEventListener("visibilitychange", GameCreator.listeners.visibilityChange);
    },

        initializeBorderObjects: function() {
            GameCreator.borderObjects.borderL.attributes.height = GameCreator.props.height + 1000;
            GameCreator.borderObjects.borderR.attributes.x = GameCreator.props.width;
            GameCreator.borderObjects.borderR.attributes.height = GameCreator.props.height + 1000;
            GameCreator.borderObjects.borderT.attributes.width = GameCreator.props.width + 1000;
            GameCreator.borderObjects.borderB.attributes.width = GameCreator.props.width + 1000;
            GameCreator.borderObjects.borderB.attributes.y = GameCreator.props.height;
        },

        gameLoop: function() {
            var now = Date.now();
            var delta = now - GameCreator.then;

            if (!GameCreator.paused && GameCreator.windowActive) {
                GameCreator.runFrame(delta);
                GameCreator.render(false);
                if (GameCreator.state !== 'editing') {
                    requestAnimationFrame(GameCreator.gameLoop);
                }
            }
            
            GameCreator.then = now;
        },

        render: function(forceRender) {
            var i, obj;
            if (GameCreator.uiContext) {
                GameCreator.uiContext.clearRect(0, 0, GameCreator.props.width, GameCreator.props.height);
                GameCreator.drawObjectSelectedUI();
            }
            GameCreator.mainContext.clearRect(0, 0, GameCreator.props.width, GameCreator.props.height);
            for (i = 0; i < GameCreator.renderableObjects.length; i += 1) {
                obj = GameCreator.renderableObjects[i];
                // TODO: Deactivated invalidation
                //if (true || obj.invalidated || forceRender) {
                //    obj.parent.draw(this.mainContext, obj);
                //}
                obj.parent.draw(this.mainContext, obj);
            }
            GameCreator.getActiveScene().drawBackground();
            GameCreator.drawEffects(this.mainContext);
        },

        drawImage: function(context, image, x, y, width, height, isControllingCamera) {
            try {
                if (isControllingCamera) {
                    var vpWidth = GameCreator.props.viewportWidth,
                        vpHeight = GameCreator.props.viewportHeight,
                        gameWidth = GameCreator.props.width,
                        gameHeight = GameCreator.props.height;

                    GameCreator.vpOffsetX = Math.max(0, ((x + width / 2) - vpWidth / 2));
                    GameCreator.vpOffsetY = Math.max(0, ((y + height / 2) - vpHeight / 2));

                    GameCreator.vpOffsetX = Math.min(GameCreator.vpOffsetX, (GameCreator.props.width - vpWidth));
                    GameCreator.vpOffsetY = Math.min(GameCreator.vpOffsetY, (GameCreator.props.height - vpHeight));
                } 
                context.drawImage(image, x - GameCreator.vpOffsetX, y - GameCreator.vpOffsetY, width, height);
            } catch (e) {
                console.log(e);
            }
        },

        drawEffects: function(context) {
            GameCreator.currentEffects.forEach(function(effect, index) {
                if (!effect.draw(context)) {
                    GameCreator.currentEffects.splice(index, 1);
                }
            });
        },

        runFrame: function(deltaTime) {
            GameCreator.runBufferedActions();
            GameCreator.updateSpeedForAllObjects(deltaTime);
            GameCreator.checkCollisions();
            GameCreator.moveAllObjects(deltaTime);
            GameCreator.checkKeyEvents();
            GameCreator.timerHandler.update(deltaTime);
            GameCreator.updateEffects(deltaTime);
            GameCreator.cleanupDestroyedObjects();
            GameCreator.callOnCreateForNewObjects();
            if (GameCreator.debug) {
                GameCreator.debug.calculateDebugInfo(deltaTime);
            }
        },

        runBufferedActions: function() {
            var i, item, j;
            for (i = 0; i < GameCreator.bufferedActions.length; i++) {
                item = GameCreator.bufferedActions[i];
                for (j = 0; j < item.actionArray.length; j++) {
                    item.actionArray[j].runAction(item.runtimeObj);
                }
            }
            GameCreator.bufferedActions.length = 0;
        },

        updateEffects: function(deltaTime) {
            var i;
            for (i = 0; i < GameCreator.currentEffects.length; i++) {
                GameCreator.currentEffects[i].update(deltaTime);
            }
        },

        updateSpeedForAllObjects: function(deltaTime) {
            var i, runtimeObj;
            for (i = 0; i < GameCreator.movableObjects.length; i += 1) {
                if (!GameCreator.paused) {
                    runtimeObj = GameCreator.movableObjects[i];
                    if(runtimeObj.parent.calculateSpeed) {
                        runtimeObj.parent.calculateSpeed.call(runtimeObj, deltaTime / 1000);
                    }
                }
            }
        },

        checkCollisions: function() {
            var j, i, runtimeObjects;
            for (j = 0; j < GameCreator.collidableObjects.length; j += 1) {
                runtimeObjects = GameCreator.collidableObjects[j].runtimeObjects;
                for (i = 0; i < runtimeObjects.length; i += 1) {
                    if(!GameCreator.paused) {
                        GameCreator.helpers.checkCollisions(runtimeObjects[i]);
                    }
                }
            }
        },

        moveAllObjects: function(deltaTime) {
            var i, runtimeObj;
            for (i = 0; i < GameCreator.movableObjects.length; i += 1) {
                if (!GameCreator.paused) {
                    runtimeObj = GameCreator.movableObjects[i];
                    runtimeObj.parent.move.call(runtimeObj, deltaTime / 1000);
                }
            }
        },

        checkKeyEvents: function() {
            var i, runtimeObj;
            for (i = 0; i < GameCreator.eventableObjects.length; i += 1) {
                if (!GameCreator.paused) {
                    runtimeObj = GameCreator.eventableObjects[i];
                    runtimeObj.parent.checkEvents.call(runtimeObj);
                }
            }
            GameCreator.releasePendingKeys();
        },

        releasePendingKeys: function() {
            var keys = Object.keys(GameCreator.keys.keyPressed);
            keys.forEach(function(key) {
                if (GameCreator.keys.pendingRelease[key]) {
                    GameCreator.keys.keyPressed[key] = false;
                    GameCreator.keys.pendingRelease[key] = false;
                }
            });
        },

        cleanupDestroyedObjects: function() {
            var i, runtimeObj;
            for (i = 0; i < GameCreator.objectsToDestroy.length; i += 1) {
                runtimeObj = GameCreator.objectsToDestroy[i];
                runtimeObj.parent.removeFromGame.call(runtimeObj);
            }
        },

        callOnCreateForNewObjects: function() {
            var i, runtimeObj;
            for (i = 0; i < GameCreator.newlyCreatedObjects.length; i += 1) {
                runtimeObj = GameCreator.newlyCreatedObjects[i];
                runtimeObj.parent.onCreate.call(runtimeObj);
            }
        },

        invalidate: function(obj) {
            /*var width, height;
            var x = parseInt(obj.attributes.x, 10);
            var y = parseInt(obj.attributes.y, 10);
            var xCorr = 0;
            var yCorr = 0;
            if (obj.attributes.x < 0) {
                xCorr = x;
                x = 0;
            }
            if (obj.attributes.y < 0) {
                yCorr = y;
                y = 0;
            }
            if (GameCreator.state == 'editing') {
                width = obj.displayWidth;
                height = obj.displayHeight;
            } else {
                width = parseInt(obj.attributes.width, 10);
                height = parseInt(obj.attributes.height, 10);
            }
            GameCreator.mainContext.clearRect(x, y,
                width + xCorr + 1,
                height + yCorr + 1);
            obj.invalidated = true;*/
        },

        reset: function() {
            if (GameCreator.uiContext) {
                GameCreator.uiContext.clearRect(0, 0, GameCreator.props.width, GameCreator.props.height);
            }
            GameCreator.mainContext.clearRect(0, 0, GameCreator.props.width, GameCreator.props.height);
            GameCreator.bgContext.clearRect(0, 0, GameCreator.props.width, GameCreator.props.height);
            GameCreator.timerHandler.clear();
            this.collidableObjects = [];
            this.movableObjects = [];
            this.renderableObjects = [];
            this.objectsToDestroy = [];
            this.eventableObjects = [];
            this.currentEffects = [];
            GameCreator.removeKeyListeners();
            $(GameCreator.mainCanvas).off(".runningScene");
            $(GameCreator.mainCanvas).css("cursor", "default");
            GameCreator.resetKeys();
            GameCreator.vpOffsetY = 0;
            GameCreator.vpOffsetX = 0;            
        },

        removeKeyListeners: function() {
            window.onkeydown = null;
            window.onkeyup = null;
            window.onmousedown = null;
            window.onmouseup = null;
            window.ontouchstart = null;
            window.ontouchmove = null;
            window.ontouchend = null;
            window.onmousemove = null;
        },

        pauseGame: function() {
            var objectName, obj, keyName;
            GameCreator.paused = true;
            GameCreator.removeKeyListeners();
            $(GameCreator.mainCanvas).css("cursor", "default");
            //Set all keypresses to false here since we turn off keyUp.
            GameCreator.resetKeys();
        },

        restartGame: function() {
            if (GameCreator.state === 'directing') {
                GameCreator.resetScene(GameCreator.scenes[0]);
            } else if (GameCreator.state === 'playing') {
                GameCreator.resetScene(GameCreator.scenes[0]);
            }
        },

        resumeGame: function() {
            GameCreator.paused = false;
            GameCreator.initializeKeyListeners();
            Object.keys(GameCreator.globalObjects).forEach(function(objectName) {
                GameCreator.globalObjects[objectName].onGameStarted();
            });

            GameCreator.renderableObjects.forEach(function(runtimeObject) {
                runtimeObject.parent.objectEnteredGame();
            });
            GameCreator.then = Date.now();
            GameCreator.gameLoop();
        },
        
        createRuntimeObject: function(globalObj, args) {
            var runtimeObj = new GameCreator.SceneObject();
            if (globalObj.hasOwnProperty("objectToCreate")) {
                args.x = globalObj.x;
                args.y = globalObj.y;
                globalObj = GameCreator.globalObjects[globalObj.objectToCreate];
            }
            runtimeObj.instantiate(globalObj, args);
            runtimeObj.reset();
            GameCreator.addToRuntime(runtimeObj);
            globalObj.objectEnteredGame();
            return runtimeObj;
        },

        addToRuntime: function(runtimeObj) {
            if (runtimeObj.parent.isCollidable) {
                if (!GameCreator.helpers.getObjectById(GameCreator.collidableObjects, runtimeObj.parent.id)) {
                    GameCreator.collidableObjects.push({id: runtimeObj.parent.id, runtimeObjects: []});
                }
                GameCreator.helpers.getObjectById(GameCreator.collidableObjects, runtimeObj.parent.id).runtimeObjects.push(runtimeObj);
            }
            if (runtimeObj.parent.isMovable) {
                GameCreator.movableObjects.push(runtimeObj);
            }
            if (runtimeObj.parent.isRenderable) {
                GameCreator.renderableObjects.push(runtimeObj);
            }
            if (runtimeObj.parent.isEventable) {
                GameCreator.eventableObjects.push(runtimeObj);
            }
            runtimeObj.parent.initialize.call(runtimeObj);
            GameCreator.newlyCreatedObjects.push(runtimeObj);
        },

        getGlobalObjects: function() {
            var globalObj;
            var allGlobalObjects = {};
            for (globalObj in GameCreator.globalObjects) {
                if (GameCreator.globalObjects.hasOwnProperty(globalObj)) {
                    allGlobalObjects[globalObj] = globalObj;
                }
            }
            return allGlobalObjects;
        },

        getUniqueInstanceId: function(globalObj) {
            var runtimeObjects = GameCreator.helpers.getActiveInstancesOfGlobalObject(globalObj.id);
            var minimumId = 1;
            var parentName = globalObj.objectName;
            for (var i = 0; i < runtimeObjects.length; i += 1) {
                if (runtimeObjects[i].attributes.instanceId.indexOf(parentName) === 0) {
                    var instanceNo = Number(runtimeObjects[i].attributes.instanceId.substring(parentName.length));
                    if (minimumId <= instanceNo) {
                        minimumId = instanceNo + 1;
                    }
                }
            }
            return parentName + minimumId;
        },


        changeCounter: function(runtimeObj, params) {
            var selectedObjectId = params.counter.carrier;
            var counterName = params.counter.name;
            var counterCarrier, runtimeObjects;

            var changeValue = function(counter) {
                if (params.type === 'set') {
                    counter.setValue(params.value);
                } else if (params.type === 'add') {
                    counter.changeValue(params.value);
                } else {
                    counter.changeValue(-params.value);
                }
            };

            if (selectedObjectId === 'globalCounters') {
                changeValue(GameCreator.globalCounterCarriers[counterName]);
            } else {
                if (selectedObjectId && selectedObjectId !== 'this') {
                    runtimeObjects = GameCreator.helpers.getActiveInstancesOfGlobalObject(Number(selectedObjectId));
                } else {
                    runtimeObjects = [runtimeObj];
                }
                for (var i = 0; i < runtimeObjects.length; i += 1) {
                    if (runtimeObjects[i].parent.attributes.unique) {
                        counterCarrier = runtimeObjects[i].parent;
                    } else {
                        counterCarrier = runtimeObjects[i];
                    }
                    changeValue(counterCarrier.counters[counterName]);
                }
            }
        },

        changeState: function(runtimeObj, params) {
            var i, 
                selectedObjectId = params.state.objId,
                selectedStateId = Number(params.state.stateId);

            if (selectedObjectId && selectedObjectId !== 'this') {
                var globalObj = GameCreator.helpers.getGlobalObjectById(selectedObjectId);
                if (globalObj.attributes && globalObj.attributes.unique) {
                    globalObj.currentState = selectedStateId;
                }
                var runtimeObjects = GameCreator.helpers.getActiveInstancesOfGlobalObject(Number(selectedObjectId));
                for (i = 0; i < runtimeObjects.length; i += 1) {
                    runtimeObjects[i].setState(selectedStateId);
                }
            } else if (selectedObjectId === 'this') {
                runtimeObj.setState(selectedStateId);
            }
        },
        
        getClickedObject: function(x, y) {
            x = (x + GameCreator.vpOffsetX) / GameCreator.canvasSizeFactor;
            y = (y + GameCreator.vpOffsetY) / GameCreator.canvasSizeFactor;
            var i, runtimeObj;
            for (i = GameCreator.renderableObjects.length - 1; i >= 0; i -= 1) {
                runtimeObj = GameCreator.renderableObjects[i];
                // If in edit mode, this should look for displayWidth instead.
                if (x >= runtimeObj.attributes.x &&
                    x <= runtimeObj.attributes.x + runtimeObj.attributes.width &&
                    y >= runtimeObj.attributes.y &&
                    y <= runtimeObj.attributes.y + runtimeObj.attributes.height && runtimeObj.parent.isClickable)
                {
                    runtimeObj.clickOffsetX = x - runtimeObj.attributes.x;
                    runtimeObj.clickOffsetY = y - runtimeObj.attributes.y;
                    return runtimeObj;
                }
            }
            return null;
        },
        getRuntimeObject: function(instanceId) {
            var i, collidableObj, movableObj, renderableObj, eventableObj;
            for (i = 0; i < GameCreator.collidableObjects.length; i += 1) {
                collidableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.collidableObjects[i].runtimeObjects, instanceId);
                if (collidableObj) {
                    return collidableObj;
                }
            }
            movableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.movableObjects, instanceId);
            if (movableObj) {
                return movableObj;
            }
            renderableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.renderableObjects, instanceId);
            if (renderableObj) {
                return renderableObj;
            }
            eventableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.eventableObjects, instanceId);
            if (eventableObj) {
                return eventableObj;
            }
            return null;
        },
        getRuntimeObjectFromCollection: function(collection, instanceId) {
            var i;
            for (i = 0; i < collection.length; i += 1) {
                if (collection[i].attributes.instanceId === instanceId) {
                    return collection[i];
                }
            }
        },

        resetGlobalObjectCounters: function() {
            Object.keys(GameCreator.globalObjects).forEach(function(key) {
                if (GameCreator.globalObjects[key].counters) {
                    Object.keys(GameCreator.globalObjects[key].counters).forEach(function(counterKey) {
                        GameCreator.globalObjects[key].counters[counterKey].reset();
                    });
                }
            });
        },

        resetGlobalCounters: function() {
            var counterNames = Object.keys(GameCreator.globalCounters);
            for (var i = 0; i < counterNames.length; i += 1) {
                var globalCounterCarrier = GameCreator.globalCounterCarriers[counterNames[i]];
                if (!globalCounterCarrier) {
                    var globalCounter = GameCreator.globalCounters[counterNames[i]];
                    GameCreator.globalCounterCarriers[counterNames[i]] = GameCreator.CounterCarrier.New(null, globalCounter);
                } else {
                    globalCounterCarrier.reset();
                }
            }
        },

        resetGlobalObjects: function() {
            var objectNames = Object.keys(GameCreator.globalObjects);
            objectNames.forEach(function(objectName) {
                GameCreator.globalObjects[objectName].currentState = 0;
            })
        },

        playGame: function() {
            GameCreator.audioHandler.stopMusic();
            GameCreator.playScene(GameCreator.scenes[0]);
        },

        resetKeys: function() {
            GameCreator.keys.keyLeftPressed = false;
            GameCreator.keys.keyRightPressed = false;
            GameCreator.keys.keyUpPressed = false;
            GameCreator.keys.keyDownPressed = false;
            GameCreator.keys.pendingRelease = {};
            var keys = Object.keys(GameCreator.keys.keyPressed);
            keys.forEach(function(key) {
                GameCreator.keys.keyPressed[key] = false;
                GameCreator.keys.pendingRelease[key] = false;
            });
        },

        initializeKeyListeners: function() {
            GameCreator.resetKeys();
            window.onkeydown = GameCreator.listeners.keyDown;
            window.onkeyup = GameCreator.listeners.keyUp;
            window.onmousedown = GameCreator.listeners.mouseDown;
            window.onmouseup = GameCreator.listeners.mouseUp;
            window.onmousemove = GameCreator.listeners.mouseMove;
            window.ontouchstart = GameCreator.listeners.updateTouch;
            window.ontouchmove = GameCreator.listeners.updateTouch;
            window.ontouchend = GameCreator.listeners.touchEnd;
        },

    };
    
}());
