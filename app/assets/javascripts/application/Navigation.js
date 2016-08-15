(function() {
    ArcadeForge.NavigationState = {
        COLLAPSED: "collapsed",
        EXPANDED: "expanded"
    };

    ArcadeForge.Navigation = {
    	navPrimary: $("#nav-primary"),
        navHeight: 36 * 5,
        state: ArcadeForge.NavigationState.COLLAPSED,

    	init: function() {
    		console.log('ArcadeForge::Navigation: Initialized');

    		$(".navbar-toggle").each(function() {
    			this.onclick = function() {
                    ArcadeForge.Navigation.onNavbarToggle();
    			};
    		});
    	},

        onNavbarToggle: function() {
            console.log(TweenMax);

            switch (this.state) {
                case ArcadeForge.NavigationState.COLLAPSED:
                    TweenMax.to(this.navPrimary, 0.6, {y: 0, height: this.navHeight, ease: Power2.easeInOut});
                    this.state = ArcadeForge.NavigationState.EXPANDED;
                break;

                case ArcadeForge.NavigationState.EXPANDED:
                    TweenMax.to(this.navPrimary, 0.5, {y: -this.navHeight, height: 0, ease: Power1.easeInOut});
                    this.state = ArcadeForge.NavigationState.COLLAPSED;
                break;
            }
        },

    	onMediaQueryChange: function(mql) {
    		switch (mql.media) {
    			case ArcadeForge.MediaQueryType.TO_MOBILE:
                    this.state = ArcadeForge.NavigationState.COLLAPSED;
                    TweenMax.set(this.navPrimary, {y: -this.navHeight, height: 0});
    			break;

    			case ArcadeForge.MediaQueryType.TO_DESKTOP:
                    TweenMax.set(this.navPrimary, {y: -83, height: 0});
                    TweenMax.to(this.navPrimary, 0.7, {y: 0, height: 83, ease: Power3.easeOut});
    			break;
    		}
    	}
    };
}());