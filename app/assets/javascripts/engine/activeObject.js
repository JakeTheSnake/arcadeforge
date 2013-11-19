GameCreator.activeObject = {
        
    New: function(image, args){
        var obj = Object.create(GameCreator.baseObject);
        GameCreator.addObjFunctions.activeObjectFunctions(obj);
        GameCreator.addObjFunctions.collidableObjectFunctions(obj);
        GameCreator.addObjFunctions.stoppableObjectFunctions(obj);
        GameCreator.addObjFunctions.bounceableObjectFunctions(obj);
        GameCreator.addObjFunctions.clickableObjectFunctions(obj);
        
        obj.image = image;
        obj.name = args.name;
        obj.width = args.width;
        obj.height = args.height;
        
        obj.speed = (!args.speed && args.speed != 0) ? 300 : args.speed;
        obj.accX = args.accX || 0;
        obj.accY = args.accY || 0;
        obj.speedX = args.speedX || 0;
        obj.speedY = args.speedY || 0;
        
        obj.isCollidable = true;
        obj.isMovable = true;
        obj.isRenderable = true;
        
        obj.objectType = "activeObject";
        
        obj.movementType = args.movementType ? args.movementType : "free";
        
        GameCreator.globalObjects[obj.name] = obj;
        return obj;
    },
    
    createFromSaved: function(savedObject){
        
        var obj = Object.create(GameCreator.baseObject);
        
        var image = new Image();
        image.src = savedObject.imageSrc;
        obj.image = image;    
        
        GameCreator.addObjFunctions.activeObjectFunctions(obj);
        GameCreator.addObjFunctions.collidableObjectFunctions(obj);
        GameCreator.addObjFunctions.stoppableObjectFunctions(obj);
        GameCreator.addObjFunctions.bounceableObjectFunctions(obj);
        
        obj.isCollidable = true;
        obj.isMovable = true;
        obj.isRenderable = true;
        
        image.onload = function() {
            obj.imageReady = true;
            GameCreator.render();
        };
        
        for(name in savedObject){
            if (savedObject.hasOwnProperty(name)) {
                obj[name] = savedObject[name];    
            }
        }
        
        GameCreator.globalObjects[obj.name] = obj;
        
        return obj;
    }
}

GameCreator.addObjFunctions.activeObjectFunctions = function(activeObject)
{    
    activeObject.initialize = function() {
        this.speedY = GameCreator.helperFunctions.getRandomFromRange(this.speedY);
        this.speedX = GameCreator.helperFunctions.getRandomFromRange(this.speedX);
        this.accY = GameCreator.helperFunctions.getRandomFromRange(this.accY);
        this.accX = GameCreator.helperFunctions.getRandomFromRange(this.accX);
        this.width = GameCreator.helperFunctions.getRandomFromRange(this.width);
        this.height = GameCreator.helperFunctions.getRandomFromRange(this.height);
    }
    activeObject.calculateSpeed = function(modifier){
        
        this.speedY += this.accY;
        this.speedX += this.accX;
    }
    
    activeObject.shoot = function(staticParameters){
        var projectileSpeed = GameCreator.helperFunctions.getRandomFromRange(staticParameters.projectileSpeed);
        var unitVector = GameCreator.helperFunctions.calcUnitVector(this.speedX, this.speedY);
        GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.objectToShoot], {x: this.x, y: this.y, speedX: unitVector.x * projectileSpeed, speedY: unitVector.y * projectileSpeed});
    }
    
    activeObject.move = function(modifier){
        switch(this.parent.movementType){
            
            case "free":
                this.x += this.speedX * modifier;
                this.y += this.speedY * modifier;
                break;
            
            case "route":
                if(this.route.length == 0)
                    return;
                var targetX = this.route[this.targetNode].x;
                var targetY = this.route[this.targetNode].y;
                var preDiffX = this.x - targetX;
                var preDiffY = this.y - targetY;
                var unitVector = GameCreator.helperFunctions.calcUnitVector(preDiffX, preDiffY);
                this.x -= unitVector.x * this.speed * modifier;
                this.y -= unitVector.y * this.speed * modifier;
                var postDiffX = this.x - targetX;
                var postDiffY = this.y - targetY;
                //Check if preDiff and postDiff have different "negativity" or are 0. If so we have reached (or moved past) our target.
                if(preDiffX * postDiffX <= 0 && preDiffY * postDiffY <= 0) {
                    if( this.route[this.targetNode].bounceNode) {
                        this.routeForward = !this.routeForward;
                    }
                    var nextIndexOffset = this.routeForward ? 1 : -1;
                    if (this.targetNode + nextIndexOffset >= this.route.length) {
                        this.targetNode = 0;
                    } else if (this.targetNode + nextIndexOffset < 0) {
                        this.targetNode = this.route.length - 1;
                    } else {
                        this.targetNode = this.targetNode + nextIndexOffset;
                    }
                }
                break;
        }
    }
}