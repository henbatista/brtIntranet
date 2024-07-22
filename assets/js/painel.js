$(document).delegate(".block-sm .ttl .actns img", "click", function (event) {
    event.preventDefault();
    $(this).parent().toggleClass("active");
});

$(document).mouseup(function (e) {
    var actns = $(".block-sm .ttl .actns");
    if (!actns.is(e.target) && actns.has(e.target).length === 0) {
        actns.removeClass("active");
    }
});
