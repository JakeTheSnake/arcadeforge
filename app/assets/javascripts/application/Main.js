(function() {
    window.ArcadeForge = {

    	init: function() {
            console.log('ArcadeForge::Main: Initialized');

            ArcadeForge.MediaQueries.init();
            ArcadeForge.Navigation.init();

            // Event listeners
            window.addEventListener("resize", ArcadeForge.onResizeHandler);
            
            // Initiate
            ArcadeForge.onResizeHandler();
        },

        /* Event handlers
        ============================================================= */
        onResizeHandler: function(e) {
        	//ArcadeForge.MediaQueries.checkMediaQuery();
        },
    };
}());