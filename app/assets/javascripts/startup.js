debugCounter = 0;
returnToGameCreator = function() {
    $("#gameArea").show();
    $("#saveForm").hide();
};
gotoGame = function() {
    $("#gameArea").show();
    $("#showArea").hide();
    $("#saveGameButton").hide();
};
window.onload = function() {
        GameCreator.canvas = document.createElement("canvas");
        GameCreator.context = GameCreator.canvas.getContext("2d");
        GameCreator.canvas.width = GameCreator.width;
        GameCreator.canvas.height = GameCreator.height;
        $("#mainCanvas").append(GameCreator.canvas);
        $("#saveGameButton").on("click", function(e) {
            $("#gameArea").hide();
            $("#saveForm").show();
            $("#game_saved_game").val(GameCreator.saveState());
        })
        
        GameCreator.scenes.push([]);
        GameCreator.activeScene = 0;
        
        
        
        GameCreator.editScene(GameCreator.scenes[0]);
        
        
        $("#dialogueOverlay").on("click", GameCreator.UI.closeDialogue);
        $("#addGlobalObjectButton").on("click", GameCreator.UI.openAddGlobalObjectDialogue)
        
        
        $(document).trigger("GameCreator.loaded");
    }
    
