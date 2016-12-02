var contingent = function () { };
contingent.is = function (value1, operator, value2, passOnNull) {
    if (passOnNull) {
        var isNullish = function (input) {
            return input == null || input == undefined || input == "";
        };

        var value1nullish = isNullish(value1);
        var value2nullish = isNullish(value2);

        if (value1nullish || value2nullish)
            return true;
    }

    var isNumeric = function (input) {
        return (input - 0) == input && input.length > 0;
    };

    var isTime = function (input) {
        //var timeTest = new RegExp(/(20|21|22|23|[01]\d|\d)(([:.][0-5]\d){1,2})$/);
        var timeTest = new RegExp(/^((([0]?[1-9]|1[0-2])(:|\.)[0-5][0-9]((:|\.)[0-5][0-9])?( )?(AM|am|aM|Am|PM|pm|pM|Pm))|(([0]?[0-9]|1[0-9]|2[0-3])(:|\.)[0-5][0-9]((:|\.)[0-5][0-9])?))$/);
        return timeTest.test(input);
    };

    var isDate = function (input) {
        //var dateTest = new RegExp(/(?=\d)^(?:(?!(?:10\D(?:0?[5-9]|1[0-4])\D(?:1582))|(?:0?9\D(?:0?[3-9]|1[0-3])\D(?:1752)))((?:0?[13578]|1[02])|(?:0?[469]|11)(?!\/31)(?!-31)(?!\.31)|(?:0?2(?=.?(?:(?:29.(?!000[04]|(?:(?:1[^0-6]|[2468][^048]|[3579][^26])00))(?:(?:(?:\d\d)(?:[02468][048]|[13579][26])(?!\x20BC))|(?:00(?:42|3[0369]|2[147]|1[258]|09)\x20BC))))))|(?:0?2(?=.(?:(?:\d\D)|(?:[01]\d)|(?:2[0-8])))))([-.\/])(0?[1-9]|[12]\d|3[01])\2(?!0000)((?=(?:00(?:4[0-5]|[0-3]?\d)\x20BC)|(?:\d{4}(?!\x20BC)))\d{4}(?:\x20BC)?)(?:$|(?=\x20\d)\x20))?((?:(?:0?[1-9]|1[012])(?::[0-5]\d){0,2}(?:\x20[aApP][mM]))|(?:[01]\d|2[0-3])(?::[0-5]\d){1,2})?$/);
        //return dateTest.test(input);
        return (new Date(input) !== "Invalid Date" && !isNaN(new Date(input))) ? true : false;
    };

    var isBool = function (input) {
        //return input === true || input === false || input.toLowerCase() === "true" || input.toLowerCase() === "false";
        return typeof input == "boolean" || input.toLowerCase() === "true" || input.toLowerCase() === "false";
    };

    if (isNumeric(value1)) {
        value1 = parseFloat(value1);
    }
    else if (isTime(value1)) {
        value1 = new Date("1/1/0001 " + value1);
    }
    else if (isDate(value1)) {
        value1 = Date.parse(value1);
    }
    else if (isBool(value1)) {
        if (typeof value1 != "boolean")
            value1 = value1 === true || value1.toLowerCase() === "true";
        value1 = !!value1;
    }

    if (isNumeric(value2)) {
        value2 = parseFloat(value2);
    }
    else if (isTime(value2)) {
        value2 = new Date("1/1/0001 " + value2);
    }
    else if (isDate(value2)) {
        value2 = Date.parse(value2);
    }
    else if (isBool(value2)) {
        if (typeof value2 != "boolean")
            value2 = value2 === true || value2.toLowerCase() === "true";
        value2 = !!value2;
    }

    switch (operator) {
        case "EqualTo": if (value1 == value2) return true; break;
        case "NotEqualTo": if (value1 != value2) return true; break;
        case "GreaterThan": if (value1 > value2) return true; break;
        case "LessThan": if (value1 < value2) return true; break;
        case "GreaterThanOrEqualTo": if (value1 >= value2) return true; break;
        case "LessThanOrEqualTo": if (value1 <= value2) return true; break;
        case "RegExMatch": return (new RegExp(value2)).test(value1); break;
        case "NotRegExMatch": return !(new RegExp(value2)).test(value1); break;
    }

    return false;
};

contingent.getId = function (element, dependentPropety) {
    var pos = element.id.lastIndexOf("_") + 1;
    return element.id.substr(0, pos) + dependentPropety.replace(/\./g, "_");
};

contingent.getName = function (element, dependentPropety) {
    var pos = element.name.lastIndexOf(".") + 1;
    return element.name.substr(0, pos) + dependentPropety;
};

(function () {

    // "Is" Validation
    var isMethod = function (value, element, params) {
        var dependentProperty = contingent.getId(element, params["dependentproperty"]);
        var operator = params["operator"];
        var passOnNull = params["passonnull"];
        var dependentValue = document.getElementById(dependentProperty).value;

        if (contingent.is(value, operator, dependentValue, passOnNull))
            return true;

        return false;
    };

    jQuery.validator.addMethod("is", isMethod);
    jQuery.validator.addMethod("isequalto", isMethod);
    jQuery.validator.addMethod("notequalto", isMethod);
    jQuery.validator.addMethod("greaterthan", isMethod);
    jQuery.validator.addMethod("greaterthanorequalto", isMethod);
    jQuery.validator.addMethod("lessthan", isMethod);
    jQuery.validator.addMethod("lessthanorequalto", isMethod);

    // "RequiredIf" Validation
    var requiredIfMethod = function (value, element, params) {
        var dependentProperty = contingent.getName(element, params["dependentproperty"]);
        var dependentTestValue = params["dependentvalue"];
        var operator = params["operator"];
        var pattern = params["pattern"];
        var dependentPropertyElement = document.getElementsByName(dependentProperty);
        var dependentValue = null;

        if (dependentPropertyElement.length > 1) {
            for (var index = 0; index != dependentPropertyElement.length; index++)
                if (dependentPropertyElement[index]["checked"]) {
                    dependentValue = dependentPropertyElement[index].value;
                    break;
                }

            if (dependentValue == null)
                dependentValue = false
        }
        else
            dependentValue = dependentPropertyElement[0].value;

        if (contingent.is(dependentValue, operator, dependentTestValue)) {
            if (pattern == null) {
                if (value != null && value.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '') != "")
                    return true;
            }
            else
                return (new RegExp(pattern)).test(value);
        }
        else
            return true;

        return false;
    };

    jQuery.validator.addMethod("requiredif", requiredIfMethod);
    jQuery.validator.addMethod("requiredifnot", requiredIfMethod);
    jQuery.validator.addMethod("requirediftrue", requiredIfMethod);
    jQuery.validator.addMethod("requirediffalse", requiredIfMethod);
    jQuery.validator.addMethod("requiredifregexmatch", requiredIfMethod);
    jQuery.validator.addMethod("requiredifregexnotmatch", requiredIfMethod);

    // "RequiredIfEmpty" Validation
    var requiredIfEmptyMethod = function (value, element, params) {
        var dependentProperty = contingent.getId(element, params["dependentproperty"]);
        var dependentValue = document.getElementById(dependentProperty).value;

        if (dependentValue == null || dependentValue.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '') == "") {
            if (value != null && value.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '') != "")
                return true;
        }
        else
            return true;

        return false;
    };

    jQuery.validator.addMethod("requiredifempty", requiredIfEmptyMethod);

    // "RequiredIfEmpty" Validation
    var requiredIfNotEmptyMethod = function (value, element, params) {
        var dependentProperty = contingent.getId(element, params["dependentproperty"]);
        var dependentValue = document.getElementById(dependentProperty).value;

        if (dependentValue != null && dependentValue.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '') != "") {
            if (value != null && value.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '') != "")
                return true;
        }
        else
            return true;

        return false;
    };

    jQuery.validator.addMethod("requiredifnotempty", requiredIfNotEmptyMethod);

    // Set Validation Rules
    var setValidationValues = function (options, ruleName, value) {
        options.rules[ruleName] = value;
        if (options.message) {
            options.messages[ruleName] = options.message;
        }
    };

    // "RequiredIf" Unobtrusive
    var requiredIfUnobtrusiveMethod = function (options) {
        var value = {
            dependentproperty: options.params.dependentproperty,
            dependentvalue: options.params.dependentvalue,
            operator: options.params.operator,
            pattern: options.params.pattern
        };
        setValidationValues(options, "requiredif", value);
    };

    $.validator.unobtrusive.adapters.add("requiredif", ["dependentproperty", "dependentvalue", "operator", "pattern"], requiredIfUnobtrusiveMethod);
    $.validator.unobtrusive.adapters.add("requiredifnot", ["dependentproperty", "dependentvalue", "operator", "pattern"], requiredIfUnobtrusiveMethod);
    $.validator.unobtrusive.adapters.add("requirediftrue", ["dependentproperty", "dependentvalue", "operator", "pattern"], requiredIfUnobtrusiveMethod);
    $.validator.unobtrusive.adapters.add("requirediffalse", ["dependentproperty", "dependentvalue", "operator", "pattern"], requiredIfUnobtrusiveMethod);
    $.validator.unobtrusive.adapters.add("requiredifregexmatch", ["dependentproperty", "dependentvalue", "operator", "pattern"], requiredIfUnobtrusiveMethod);
    $.validator.unobtrusive.adapters.add("requiredifregexnotmatch", ["dependentproperty", "dependentvalue", "operator", "pattern"], requiredIfUnobtrusiveMethod);

    // "RequiredIfEmpty" Unobtrusive
    var requiredIfUnobtrusiveMethod = function (options) {
        setValidationValues(options, "requiredifempty", {
            dependentproperty: options.params.dependentproperty
        });
    };

    $.validator.unobtrusive.adapters.add("requiredifempty", ["dependentproperty"], requiredIfUnobtrusiveMethod);

    // "RequiredIfNotEmpty" Unobtrusive
    var requiredIfUnobtrusiveMethod = function (options) {
        setValidationValues(options, "requiredifnotempty", {
            dependentproperty: options.params.dependentproperty
        });
    };

    $.validator.unobtrusive.adapters.add("requiredifnotempty", ["dependentproperty"], requiredIfUnobtrusiveMethod);

    // "Is" Unobtrusive
    var isUnobtrusiveMethod = function (options) {
        setValidationValues(options, "is", {
            dependentproperty: options.params.dependentproperty,
            operator: options.params.operator,
            passonnull: options.params.passonnull
        });
    };

    $.validator.unobtrusive.adapters.add("is", ["dependentproperty", "operator", "passonnull"], isUnobtrusiveMethod);
    $.validator.unobtrusive.adapters.add("isequalto", ["dependentproperty", "operator", "passonnull"], isUnobtrusiveMethod);
    $.validator.unobtrusive.adapters.add("notequalto", ["dependentproperty", "operator", "passonnull"], isUnobtrusiveMethod);
    $.validator.unobtrusive.adapters.add("greaterthan", ["dependentproperty", "operator", "passonnull"], isUnobtrusiveMethod);
    $.validator.unobtrusive.adapters.add("greaterthanorequalto", ["dependentproperty", "operator", "passonnull"], isUnobtrusiveMethod);
    $.validator.unobtrusive.adapters.add("lessthan", ["dependentproperty", "operator", "passonnull"], isUnobtrusiveMethod);
    $.validator.unobtrusive.adapters.add("lessthanorequalto", ["dependentproperty", "operator", "passonnull"], isUnobtrusiveMethod);
})();
