debugCounter = 0;

window.onload = function () {
        GameCreator.canvas = document.createElement("canvas");
        GameCreator.context = GameCreator.canvas.getContext("2d");
        GameCreator.canvas.width = GameCreator.width;
        GameCreator.canvas.height = GameCreator.height;
        $("#mainCanvas").append(GameCreator.canvas);
        
        GameCreator.scenes.push([]);
        GameCreator.activeScene = 0;
        
        //Create ActiveObjects
        
        var globalBall = GameCreator.addActiveObject({src: "assets/ball.png", name: "ball", width:[20], height:[20], speed: 300, movementType: "route"})
        var globalBall2 = GameCreator.addActiveObject({src: "assets/red_ball.gif", name: "red_ball", width:[20], height:[20]})
        
        //var sceneBall = GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:1, y:400, speedX: 340, speedY:240, speed: 200});
        //GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:200, y:400, speedX: -300, speedY:140});
        //GameCreator.createInstance(globalBall2, GameCreator.scenes[0], {x:200, y:100, speedX: -340, speedY:160});
        
        //Set route movement to sceneBall
        //sceneBall.route.push({x: 100, y: 100});
        //sceneBall.route.push({x: 100, y: 300});
        //sceneBall.route.push({x: 300, y: 300});
        //sceneBall.route.push({x: 300, y: 100, bounceNode: true});
        
        //Create Mouseobject
        
        var globalMousePlayer = GameCreator.addPlayerMouseObject({src: "assets/zealot.gif", name: "mouseZealot", width: [80], height: [80]})
        //GameCreator.createInstance(globalMousePlayer, GameCreator.scenes[0], {x:100, y:200})
        
        //Create Platformobject
        
        var globalPlatformPlayer = GameCreator.addPlayerPlatformObject({src: "assets/zealot.gif", name: "platformZealot", width: [80], height: [80]})
        //GameCreator.createInstance(globalPlatformPlayer, GameCreator.scenes[0], {x:150, y:400, accY: 5});
        
        //Create TopDownObject
        
        var globalTopDownPlayer = GameCreator.addPlayerTopDownObject({src: "assets/zergling.png", name: "topDownLing", width: [80], height: [80]})
        
        
        //GameCreator.loadScene(GameCreator.scenes[0]);
        
        GameCreator.editScene(GameCreator.scenes[0]);
        
        //Mass create objects for test!
        //for(var i = 0; i < 5 ; ++i)
        //{
        //    console.log("addActiveObject");
        //    var name = "obj" + i;
        //    var x = i * 5;
        //    var y = i * 5;
        //    var speedX = i * 5;
        //    var speedY = i * 5;
        //    var height = 10 + i/5;
        //    var width = 10 + i/5;
        //    console.log(i)
        //    GameCreator.addActiveObject({
        //        name: name,
        //        width: width,
        //        height: height,
        //        x: x,
        //        y: y,
        //        speedX: speedX,
        //        speedY: speedY,
        //        src: "red_ball.gif"
        //    });
        //}
        
        // UI
        
        $("#dialogueOverlay").on("click", GameCreator.UI.closeDialogue);
        $("#addGlobalObjectButton").on("click", GameCreator.UI.openAddGlobalObjectDialogue)
        
        //$(".ui-btn").button();
        //$("#mode").buttonset();
        
    }
    
