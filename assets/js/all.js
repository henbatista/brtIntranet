
$(document).delegate('.sidebar header button.close', 'click', function (event) {
    event.preventDefault();
    $('.sidebar').toggleClass('minify');
});

$(document).delegate('.sidebar header button.menu', 'click', function (event) {
    event.preventDefault();
    $('.sidebar aside').toggleClass('open');
});

$(".wrap-input input").change(function () {
    var input = $(this).val();
    if (input != "") {
        $(this).addClass('txt');
    } else {
        $(this).removeClass('txt');
    }
});

$(document).delegate('.sidebar  aside nav ul li .has-sub', 'click', function (event) {
    event.preventDefault();
    $(this).parent().siblings().find('a.has-sub').removeClass('open');
    $(this).toggleClass('open');
});

$(document).delegate('.tabs .btns .btn', 'click', function (event) {
    event.preventDefault();
    var href = $(this).attr('href');

    $(this).removeClass('outline');
    $(this).siblings().addClass('outline');

    $('.tabs .wrap-tab .single-tab').removeClass('active');
    $('.tabs .wrap-tab .single-tab' + href).addClass('active');
});

$(document).delegate('.accordeon .single-accord .head-accord', 'click', function (event) {
    event.preventDefault();


    $('.accordeon .single-accord').removeClass('active');
    $(this).parent().addClass('active');
});