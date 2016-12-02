// MultipleOfAttribute unobtrusive
$.validator.addMethod("multipleof", function (value, element, params) {
    var multiple = params["multiple"];

    var isNumeric = (value - 0) == value && value.length > 0;

    if (isNumeric) {
        return multiple != 0 && value % multiple == 0;
    }

    return false;
});

$.validator.unobtrusive.adapters.add("multipleof", ['multiple'], function (options) {
    options.rules['multipleof'] = {
        other: options.params.other,
        multiple: options.params.multiple
    };
    options.messages['multipleof'] = options.message;
});

// RequiredCheckboxAttribute
$.validator.addMethod("requiredcheckbox", function (value, element, params) {
    var requirednumber = params.requirednumber;

    if ($('input[name="' + element.name + '"]:checked').length >= requirednumber)
        return true;

    return false;
});

$.validator.unobtrusive.adapters.add("requiredcheckbox", ["requirednumber"], function (options) {
    options.rules["requiredcheckbox"] = options.params;
    options.messages["requiredcheckbox"] = options.message;
});

// LuhnAttribute unobstrusive
$.validator.addMethod("luhn", function (value, element, params) {
    if (value.length < 1 && params.allowEmpty) {
        return true;
    }

    if (params.allowSpaces) {
        value = value.replace(/ /g, '');
    }

    if (!value.match(/^\d+$/)) {
        return false;
    }

    var checksum = 0;

    for (var i = 0; i < value.length; i++) {
        var n = (value.charAt(value.length - i - 1) - '0') << (i & 1);

        checksum += n > 9 ? n - 9 : n;
    }

    return (checksum % 10) == 0 && checksum > 0;
});

$.validator.unobtrusive.adapters.add("luhn", ["allowempty", "allowspaces"], function (options) {
    options.rules['luhn'] = {
        allowEmpty: options.params.allowempty == "True",
        allowSpaces: options.params.allowspaces == "True"
    };

    options.messages['luhn'] = options.message;
});

// SummerNoteRequired unobtrusive
$.validator.addMethod("summernoterequired", function (value, element, params) {
    return value != '' && value != '<p><br></p>';
});

$.validator.unobtrusive.adapters.add("summernoterequired", [], function (options) {
    options.rules['summernoterequired'] = {
        other: options.params.other
    };
    options.messages['summernoterequired'] = options.message;
});

// FutureDateAttribute unobtrusive
$.validator.addMethod("futuredate", function (value, element, params) {
    var isDate = (new Date(value) !== "Invalid Date" && !isNaN(new Date(value))) ? true : false;

    if (isDate) {
        return new Date(value) > new Date();
    }

    return false;
});

$.validator.unobtrusive.adapters.add("futuredate", [], function (options) {
    options.rules['futuredate'] = {
        other: options.params.other
    };
    options.messages['futuredate'] = options.message;
});



// PastDateAttribute unobtrusive
$.validator.addMethod("pastdate", function (value, element, params) {
    var isDate = (new Date(value) !== "Invalid Date" && !isNaN(new Date(value))) ? true : false;

    if (isDate) {
        return new Date() > new Date(value);
    }

    return false;
});

$.validator.unobtrusive.adapters.add("pastdate", [], function (options) {
    options.rules['pastdate'] = {
        other: options.params.other
    };
    options.messages['pastdate'] = options.message;
});

// FileExtensionsAttribute
function getFileExtension(fileName) {
    var extension = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;
    if (extension != undefined) {
        return extension[0];
    }
    return extension;
};

$.validator.addMethod("fileextensions", function (value, element, param) {
    var validExtension = true;

    if (value != '') {
        var extension = getFileExtension(value);
        validExtension = $.inArray(extension, param.fileextensions) !== -1;
    }

    return validExtension;
});

$.validator.unobtrusive.adapters.add('fileextensions', ['fileextensions'], function (options) {
    var params = {
        fileextensions: options.params.fileextensions.split(',')
    };

    options.rules['fileextensions'] = params;
    if (options.message) {
        options.messages['fileextensions'] = options.message;
    }
});
