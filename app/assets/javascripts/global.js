(function() {
    var readyFunc = function() {
        $(".input-container input").each(function() {
            var textInput = $(this);
            textInput.on('focus', function() {
                $(this).parent().addClass('input-container-active');
                $(this).removeAttr('placeholder');
            });

            textInput.on('blur', function() {
                if ($(this).val().length == 0) {
                    $(this).parent().removeClass('input-container-active');
                    $(this).attr('placeholder', textInput.parent().find('label').html());
                }
            });

            if (textInput.val().length != 0) {
                $(this).parent().addClass('input-container-active');
                $(this).removeAttr('placeholder');
            } else {
                $(this).parent().removeClass('input-container-active');
                $(this).attr('placeholder', textInput.parent().find('label').html());
            }
        });
    };
    $(document).ready(readyFunc);
    $(document).on('page:load', readyFunc);
})();
