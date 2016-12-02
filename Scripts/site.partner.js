$(function () {       
    $('#LogoFile').change(function () {
        $('#logoFileName').val(this.files[0].name);

    });
    $('#CssFile').change(function () {
        $('#cssFileName').val(this.files[0].name);
    });
});
