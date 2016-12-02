$(function () {
    function doSearch() {
        var ref = $('#customerSearchKey').val();
        var qbid = $.Querystring('qbid');
        if (ref != null && ref != '') {
            $.ajax({
                async: true,
                url: '/Customers/Search?ref=' + ref + '&qbid=' + qbid
            }).success(function (partialView) {
                $('#customerContainer').html(partialView);
                $("#step2AddCustomer")[0].style.display = 'block';
                $("#step1AddCustomer")[0].style.display = 'none';
            })
            .error(function (partialView) {

            });
        }
    }

    $(document).ajaxSend(function (event, request, settings) {
        $('#loading-indicator').show();
    });

    $(document).ajaxComplete(function (event, request, settings) {
        $('#loading-indicator').hide();
    });

    $('#customerSearchKey').keyup(function (e) {
        if (e.keyCode == 13) {
            $("#searchCustomerBtn").click();
        }
    });

    var q = $.Querystring('q');
    if (q && q != '') {
        $('#customerSearchKey').val(q);
        doSearch();
    }

    //Search Customer
    $("#searchCustomerBtn").on('click', function () {
        doSearch();
    });

    // Add Existing Customer
    $('#customerContainer').on('click', '.btn-add-existing', function () {
        $("#addDebtorKey").val($(this).attr("data-id"));
        $("#addDebtorName").val($(this).attr("data-name"));
        $('#customerName').html($(this).attr("data-name"));
        $('#addExistingCustomerModal').modal();
    });

    // Add New Customer
    $('#btnAddNewCustomer').on('click', function () {
        $("#Zip").blur();
        $("#PhoneNumber").blur();
        if ($('#formNewCustomer').valid()) {
            $('#addNewCustomerModal').modal();
        }


    });
    $("#btnConfirmNewCustomer").on('click', function () { $('#formNewCustomer').submit(); });

    $(':checkbox[readonly]').on('click', function (e) { e.preventDefault(); });

    // Edit Customer Button - Enable fields
    $("#editCustomerButton").on('click', function () {
        SelectUSA();
        var CheckMatchId = $('#EditCustomerQBO').val()
        if (CheckMatchId == '0') {
            $('#formEditCustomer').find('input[disabled]:not([readonly]), select[disabled]').attr('disabled', false);
        }
        else {
            $('#formEditCustomer').find('#processingOptions input[disabled]:not([readonly])').attr('disabled', false);
        }

        $('label.processingOption:not([readonly])').attr('disabled', false);
        $('#saveEditButton').attr('disabled', false);
        switch ($("#ClientProcessingTypeId").val()) {
            case "3":
                break;
            case "2":
                $('label[for="PaymentNow"]').attr('disabled', true);
                $('#PaymentNow').attr('disabled', true);
                break;
            default:
                $('label[for="PaymentGuarantee"]').attr('disabled', true);
                $('#PaymentGuarantee').attr('disabled', true);
                $('label[for="PaymentNow"]').attr('disabled', true);
                $('#PaymentNow').attr('disabled', true);
        }

        $('#p-save, #p-edit').toggle();
    });

    // Edit Customer - Confirm Save
    $('#btnSaveCustomer').click(function () {
        $('#formEditCustomer').submit();
    });

    //show customer full info   for mobile 
    $('#customerContainer').on('click', '.link-customer-popup', function () {
        $("#customerModel-customername").html($(this).attr("data-name"));
        $("#addModalPopupDebtorKey").val($(this).attr("data-id"));
        $("#addModalPopupDebtorName").val($(this).attr("data-name"));
        $("#customerModal-customerInfo").html($(this).attr("data-address1") + '&nbsp;' + $(this).attr("data-address2")
             + '<br/>' + $(this).attr("data-city") + '<br/>' + $(this).attr("data-state") + '&nbsp;' + $(this).attr("data-zip"));

        $('#customerInfoModal').modal();
    });

    // Add popup  Customer
    $('#btn-mobile-open-existing-popup').click(function () {
        $("#addDebtorKey").val($("#addModalPopupDebtorKey").val());
        $("#addDebtorName").val($("#addModalPopupDebtorName").val());
        $('#addExistingCustomerModal').modal();
    });

    // Check Country USA
    function SelectUSA() {
        var country = $('#Country').val();
        if (country == "US") {
            $("#Zip").rules("add", {
                required: true,
                regex: /(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/,
                messages: {
                    required: "The Zip field is required.",
                    regex: "Invalid Zip.",
                }
            });           
            $('span[data-valmsg-for="Zip"]').addClass("field-validation-error");
            $('span[data-valmsg-for="Zip"]').removeClass("field-validation-valid")
            $("#PhoneNumber").mask('(000) 000-0000');
            $('#labelEmail').removeClass('required');
            $("#EmailAddress").rules("add",
                {
                    required: false,
                });
        }
        else {
            $("#Zip").rules("remove", "regex");
            $('#Zip').removeClass("input-validation-error");
            $('#Zip').addClass("input-validation-valid");
            $('span[data-valmsg-for="Zip"]').removeClass("field-validation-error");
            $('span[data-valmsg-for="Zip"]').addClass("field-validation-valid");
            $('#labelEmail').addClass('required');
            $("#EmailAddress").rules("add", {
                required: true,
                messages: {
                    required: "Customer Email required",
                }
            });
            $("#PhoneNumber").rules("remove", "regex");
            $("#PhoneNumber").unmask();
            $("#PhoneNumber").mask('00000000000000000000');
            $('#PhoneNumber').removeClass("input-validation-error");
            $('#PhoneNumber').addClass("input-validation-valid");
            $('span[data-valmsg-for="PhoneNumber"]').removeClass("field-validation-error");
            $('span[data-valmsg-for="PhoneNumber"]').addClass("field-validation-valid");
        }
    }
    $('#Country').change(function () {
        SelectUSA();
    });

    //  Add Zip Validation on Customer
    $("#Zip").blur(function () {
        debugger;
        if ($('#Country').val() == "US") {
            $("#Zip").rules("add", {
                required: true,
                regex: /(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/,
                messages: {
                    required: "The Zip field is required.",
                    regex: "Invalid Zip.",
                }
            });
            $('span[data-valmsg-for="Zip"]').addClass("field-validation-error");
            $('span[data-valmsg-for="Zip"]').removeClass("field-validation-valid");
        }
        else {
            $("#Zip").rules("remove", "regex");
            $('#Zip').removeClass("input-validation-error");
            $('#Zip').addClass("input-validation-valid");
            $('span[data-valmsg-for="Zip"]').removeClass("field-validation-error");
            $('span[data-valmsg-for="Zip"]').addClass("field-validation-valid");
        }
    });

    $("#PhoneNumber").blur(function () {
        debugger;
        if ($('#Country').val() == "US") {
            var IntNumber = $('#PhoneNumber').val().replace(/[^\d.]/g, '');
            if (IntNumber.length < 10) {
                // $("#PhoneNumber").rules("add", "regex");
                $("#PhoneNumber").rules("add", {
                    required: true,
                    regex: /^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/,
                    messages: {
                        required: "The Phone Number field is required.",
                        regex: "Phone number requires 10 digits.",
                    }
                });
                $('#PhoneNumber').addClass("input-validation-error");
                $('#PhoneNumber').removeClass("input-validation-valid");
                $('span[data-valmsg-for="PhoneNumber"]').addClass("field-validation-error");
                $('span[data-valmsg-for="PhoneNumber"]').removeClass("field-validation-valid");
            }
            else {
                $("#PhoneNumber").rules("remove", "regex");
                $('#PhoneNumber').removeClass("input-validation-error");
                $('#PhoneNumber').addClass("input-validation-valid");
                $('span[data-valmsg-for="PhoneNumber"]').removeClass("field-validation-error");
                $('span[data-valmsg-for="PhoneNumber"]').addClass("field-validation-valid");
            }
        }


    });

    // Add New Customer
    $('#btnConfirmAddNew').click(function () {
        $('#customerName').html($('#Name').val());
        $('#creditRequestModal').modal();
    });

    $('#saveCreditRequestNew').click(function () { $('#HasCreditRequest').val('true'); });
    $('#notNowCreditRequestNew').click(function () { $('#HasCreditRequest').val('false'); });

    // Add Existing Customer
    $('#btnConfirmAddExisting').click(function () {
        var ClientRefNo = $("#ClientRefNo").val();

        if (ClientRefNo.length == 0) {
            $('#ClientRefNo').after('<div class="text-danger">Customer ID is Required</div>');
        }
        else {
            $('#ClientRefNo').next(".text-danger").remove();
            $("#addClientRefNo").val($("#ClientRefNo").val());
            $('#addExistingCustomerModal').modal('toggle');
            $('#creditRequestModalExisting').modal();
        }
    });

    $('#saveCreditRequestExisting').click(function () { $('#HasCreditRequest').val('true'); });
    $('#notNowCreditRequestExisting').click(function () { $('#HasCreditRequest').val('false'); });

    // Processing Option  select Payment Administration    
    $("#PaymentAdministration").on('click', function () {
        $('#PaymentAdministration').prop('checked', true);
        $('#PaymentGuarantee').prop('checked', false);
        $('#PaymentNow').prop('checked', false);
    });

    // Processing Option  select PaymentGuarantee
    $("#PaymentGuarantee").on('click', function () {
        $('#PaymentGuarantee').prop('checked', true);
        $('#PaymentAdministration').prop('checked', false);
        $('#PaymentNow').prop('checked', false);
    });

    // Processing Option  select PaymentNow
    $("#PaymentNow").on('click', function () {
        $('#PaymentNow').prop('checked', true);
        $('#PaymentAdministration').prop('checked', false);
        $('#PaymentGuarantee').prop('checked', false);
    });

    //Dollar Formatting For CR
    Number.prototype.format = function (n, x, s, c) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
               num = this.toFixed(Math.max(0, ~~n));

        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    };


    $('#CreditRequestAmount2').blur(function () {

        var number = $('#CreditRequestAmount2').val();
        number = number.replace(/,/g, "");
        if (isNaN(number) != true && number != "") {
            number = parseFloat(number);
            $('#CreditRequestAmount2').val(number.format(2, 3, ',', '.'));
            $('#user-error').hide();
        }
        else {
            // show red mark and validation message  
            $('#user-error').show();

        }
    });

    $('#saveCreditRequestExisting').click(function () {

        var number = $('#CreditRequestAmount2').val();
        number = number.replace(/,/g, "");
        if (isNaN(number) == true || number == "") {

            return false;
        }
        else {
            $("#CreditRequestAmount").val(number);

            return true;
        }

    });

    $('#saveCreditRequestNew').click(function () {
        var number = $('#CreditRequestAmount2').val();
        number = number.replace(/,/g, "");
        if (isNaN(number) == true || number == "") {

            return false;
        }
        else {
            $("#CreditRequestAmount").val(number);

            return true;
        }
    });


    //validation PO
    $("[id*='Address1']").blur(function () {
        var pattern = /\bbox(?:\b$|([\s|\-]+)?[0-9]+)|(p[\-\.\s]?o.?[\-\s]?|post office\s)b(\.|ox)?/igm;
        // var pattern = new RegExp('[PO.]*\\s?B(ox)?.*\\d+', 'i');
        // var pattern = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)?\b/i;
        if (pattern.test($('#Address1').val())) {
            $('#PO-error').show();
        }
        else {
            $('#PO-error').hide();

        }

    });

});
