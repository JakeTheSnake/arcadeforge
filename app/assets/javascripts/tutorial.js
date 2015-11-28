(function(){
    var step = 0,
        steps = [
            {
                "text": "Step1"
            },
            {
                "text": "Step2",
                "elementId": "library"
            },
            {
                "text": "Step3",
                "elementId": "main-canvas"
            }
        ],
        tutorialDialogue,
        nextButton,
        skipButton,
        prevButton,
        doneButton;

    $(function(){
        tutorialDialogue = $('#tutorial-dialogue');
        nextButton = tutorialDialogue.find('#tutorial-next-button');
        skipButton = tutorialDialogue.find('#tutorial-skip-button');
        prevButton = tutorialDialogue.find('#tutorial-prev-button');
        doneButton = tutorialDialogue.find('#tutorial-done-button');
        setupButtons();
    })

    GameCreator.launchTutorial = function(){
        step = 0;
        tutorialDialogue.show();
        runCurrentStep();
    };

    var endTutorial = function() {
        tutorialDialogue.hide();
    }

    var runCurrentStep = function() {
        var stepConfig = steps[step];

        tutorialDialogue.find('#tutorial-content').html(stepConfig.text);
        setButtonVisibility();

        var position = calculateDialoguePosition(stepConfig.elementId);

        tutorialDialogue.offset({
            left: position.x,
            top: position.y 
        })
    }

    var setButtonVisibility = function() {
        if(step === 0) {
            nextButton.show();
            skipButton.show();
            prevButton.hide();
            doneButton.hide();
        } else if (step === steps.length - 1) {
            nextButton.hide();
            skipButton.hide();
            prevButton.show();
            doneButton.show();
        } else {
            nextButton.show();
            skipButton.show();
            prevButton.show();
            doneButton.hide();
        }
    }

    var setupButtons = function() {
        nextButton.click(function(evt) {
            step += 1;
            runCurrentStep();
        }.bind(this));

        skipButton.click(function(evt) {
            endTutorial();
        }.bind(this));

        prevButton.click(function(evt) {
            step -= 1;
            runCurrentStep();
        }.bind(this));

        doneButton.click(function(evt) {
            endTutorial();
        }.bind(this));
    }

    var calculateDialoguePosition = function(targetId) {
        var dialogueWidth = tutorialDialogue.innerWidth(),
            dialogueHeight = tutorialDialogue.innerHeight(),
            targetX, targetY;

        if (targetId) {
            var targetElement = $('#' + targetId),
                onLeftHalf, onTopHalf, elementX, elementY;
            elementX = targetElement.offset().left;
            elementY = targetElement.offset().top;
            onLeftHalf = elementX < window.innerWidth / 2;
            onTopHalf = elementY < window.innerHeight / 2;
            targetX = elementX + (onLeftHalf ? (targetElement.innerWidth() + 10) : -(dialogueWidth + 10));
            targetY = elementY + (onTopHalf ? 0 : -dialogueHeight);
        } else {
            targetX = window.innerWidth / 2 - dialogueWidth / 2;
            targetY = window.innerHeight / 2 - dialogueHeight / 2;
        }

        return {
            x: targetX,
            y: targetY
        }
    }
}());