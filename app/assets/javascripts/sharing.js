//Setup FaceBook and link sharing buttons.

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
  fjs.parentNode.insertBefore(js, fjs);
  
  $(function() {$("#get-url-button").on("click", function(evt){
        var path = $(evt.target).data("href");
        prompt("Here is the direct link to the game:", path);
        });
    });

}(document, 'script', 'facebook-jssdk'));