/**=========================================================
 * Module: Sidebar
 * Wraps the sidebar. Handles collapsed state and slide
 =========================================================*/

(function() {
    'use strict';

    $(function(){

      uiSidebar( $('[data-ui-sidebar]') );

      $('.sidebar-nav > .nav a[href^="' + location.pathname.split('/').slice(-1)[0] + '"]').parents('li').addClass('active');

    });

    function uiSidebar (element) {
        var $body = $('body');

        element.find('a').on('click', function (event) {
          var ele = $(this),
              par = ele.parent()[0];

          // remove active class (ul > li > a)
          var lis = ele.parent().parent().children();
          $.each(lis, function(li){
            if(li !== par)
              $(li).removeClass('active');
          });

          var next = ele.next();
          if ( next.length && next[0].tagName === 'UL' ) {
            ele.parent().toggleClass('active');
            event.preventDefault();
          }
        });

        $('.sidebar-toggle, .sidebar-toggle-off').on('click', function(e){
          e.preventDefault();
          $body.toggleClass('aside-offscreen');
        });

        // on mobiles, sidebar starts off-screen
        if ( onMobile() )
          $body.addClass('aside-offscreen');

        var lastWidth = window.innerWidth;
        $(window).resize(function(){
            // resize from desktop to mobile, hide sidebar
            if ( window.innerWidth < lastWidth && onMobile() ) {
              $body.addClass('aside-offscreen');
            }
            // resize from mobile to desktop, show again sidebar
            if ( window.innerWidth > lastWidth && !onMobile() ) {
              $body.removeClass('aside-offscreen');
            }
            lastWidth = window.innerWidth;
        });

        function onMobile() {
          return window.innerWidth < MEDIA_QUERY.tablet;
        }

    }
})();
