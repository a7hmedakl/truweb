"use strict";

$(window).on('load', function() {
    $("#preloader")
        .delay(500)
        .fadeOut("slow");
    $("body")
        .delay(500).fadeIn("slow");
});

$(function() {

    // check rtl
    var rtl = true;
    var dir = $("html").attr("dir");
    if (dir == "rtl") {
        rtl = true;
    } else {
        rtl = false;
    }

    $(".navbar-toggler").click(function() {
        $('.header-top .top-menu').toggleClass('d-none');
    });

    // scrollTo
    $(window).on("scroll", function() {
        if ($(this).scrollTop() > 600) {
            $(".scroll-top").fadeIn(600);
        } else {
            $(".scroll-top").fadeOut(600);
        }
    });
    $(".scroll-top").on("click", function() {
        $("html,body").animate({
                scrollTop: 0
            },
            500
        );
        return false;
    });

    /*  parallex */
    $(window).scroll(function(e) {
        parallax();
    });
    $(window).resize(function() {
        // siteFooter();
        $('.slide .slide__content--headings h2').css('opacity', 1);
    });

    function parallax() {
        var scrolled = $(window).scrollTop();
        // $('.hero').css('top', -(scrolled * 0.0115) + 'rem');
        $('.hero > *').css('opacity', 1 - (scrolled * .0004));
        $(".hero-img img").css({
            width: (100 + scrolled * 0.02) + "%"
        })
    };

    $('.slider').slick({
        autoplay: true,
        speed: 400,
        // lazyLoad: 'progressive',
        arrows: false,
        mobileFirst: true,
        rtl: rtl,
        dots: false,
        infinite: true,
        // fade: true,
        cssEase: 'linear',
        autoplay: true,
        slidesToShow: 1,
    });

    if ($('.typed').length > 0) {
        var typed = new Typed('.typed', {
            stringsElement: '.typed-strings',
            loop: false,
            typeSpeed: 50,
            startDelay: 100,
            // loopCount: Infinity,
        });
    }

});