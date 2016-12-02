$(function () {
    ValidationUSbased()
    var chkValue = false;
    var checkCompanyMakeChange = false;
    $("#btn-create-account").click(function () {
        CheckUserEmail();
        $("#Zip").blur();
        if (!$('#formFreeNowAccount').valid()) {
            return false;
        }
        else {
            /*Fill Confirm Form*/
            if (chkValue != true) {
                var form = $("#formFreeNowAccount")[0];
                $("#confirm-company-name").html(form.CompanyName.value);
                $("#confirm-Adddress").html(form.Address1.value + ", " + form.Address2.value + ", " + form.City.value + ", " + form.State.value + ", " + form.Zip.value);
                $("#confirm-business-name").html(form.LegalFormOfBusiness.value);
                $("#confirm-state-of-organization").html(form.StateOfOrganization.value);
                $("#confirm-phone").html(form.PhoneNumber.value);

                $("#confirm-first-name").html(form.FirstName.value);
                $("#confirm-last-name").html(form.LastName.value);
                $("#confirm-email").html(form.Email.value);
                $('#makeChanges').show();

                //    ProcessConfirmationSubmitWithData()
                if (checkCompanyMakeChange == true) {
                    $("#DNB-search-result").hide();
                    $("#conform-account-form").show();
                    $("#DNB-Create-account").hide();
                    $('#makeChanges').hide();
                    $('#IsMakeChanges').val(true);
                    checkCompanyMakeChange = false;
                    ProcessConfirmationSubmitWithData(4)
                }
                else {
                    ProcessConfirmationSubmitWithData(2)
                    SearchCompanyResult()
                    $("#DNB-search-result").show();
                    $("#conform-account-form").hide();
                    $("#DNB-Create-account").hide();
                }

            }
        }
    });

    $("#back-btn-confirm").click(function () {
        if ($("#conform-account-form").is(":visible")) {
            $("#PhoneNumber").unmask();
            $("#PhoneNumber").mask("(999) 999-9999");
            $("#DNB-search-result").hide();
            $("#conform-account-form").hide();
            $("#DNB-Create-account").show();
            return false;
        }
        else { return true; }
    });
    $("#submit-create-account-btn").click(function () {
        $("#PhoneNumber").unmask();        
        ProcessConfirmationSubmitWithData(6);
        $('#formFreeNowAccount').submit();
    });


    $(".checkValidForm").keyup(function () {
        formValidate();
    });
    $("select[name=Country]").change(function () {
        formValidate();
    });

    function formValidate() {
        if ($('#IsNOTUSbased').is(":checked")) {
            if ($('#Address1').val() != "" && $('#Country').val() != "" && $('#Email').val() != "" && $('#City').val() != "" && $('#CompanyName').val() != "") {
                $('#btn-create-account').addClass('btn-CR-success');
                $("#btn-create-account").text('PROCEED TO CONFIRMATION');
            }
            else {
                $('#btn-create-account').removeClass('btn-CR-success');
                $("#btn-create-account").text('Please complete all fields...');
            }
            return;
        }

        if ($('#CompanyName').val() != "" && $('#Address1').val() != "" && $('#City').val() != "" && $('#State').val() != "" && $('#Zip').val() != "" && $('#StateOfOrganization').val() != "" && $('#LegalFormOfBusiness').val() != "" && $('#FirstName').val() != "" && $('#LastName').val() != "" && $('#Email').val() != "" && $('#PhoneNumber').val() != "" && chkValue != true) {
            if (($('#formFreeNowAccount').valid())) {
                $('#btn-create-account').addClass('btn-CR-success');
                $("#btn-create-account").text('PROCEED TO CONFIRMATION');
            }
            else {
                $('#btn-create-account').removeClass('btn-CR-success');
                $("#btn-create-account").text('Please complete all fields...');
            }
        }
        else {
            $('#btn-create-account').removeClass('btn-CR-success');
            $("#btn-create-account").text('Please complete all fields...');
        }
    }


    $(".checkValidForm_old").keyup(function () {
        if ($('#formFreeNowAccount').valid() && chkValue != true) {
            $('#btn-create-account').addClass('btn-CR-success');
            $("#btn-create-account").text('PROCEED TO CONFIRMATION');
        }
        else {
            $('#btn-create-account').removeClass('btn-CR-success');
            $("#btn-create-account").text('Please complete all fields...');
        }
    });


    $("#Email").blur(function () {
        CheckUserEmail();
    });

    // check alredy used email address
    function CheckUserEmail() {
        var email = $('#Email').val();

        if (email != null && email != '') {
            $.ajax({
                async: false,
                url: '/ClientRegistration/CheckUsedEmail?email=' + email,
                error: function (xhr, status, err) {
                    var message = "Server error has occurred.";
                    if (xhr.status == 400) {
                        message = xhr.statusText;
                    }
                },
                success: function (check) {
                    if (check == "True") {
                        chkValue = true;
                        $('#user-error').show();
                        return false;
                    }
                    else {
                        chkValue = false;
                        $('#user-error').hide();
                        formValidate();
                        return true;
                    }
                }
            });
        }
    }

    $("#Zip").blur(function () {
        usZipPattern = /^\d{5}(-\d{4})?(?!-)$/;
        if ($('#IsNOTUSbased').is(":checked")) {
            $('#Zip').rules("remove");
            $('#Zip').removeClass("input-validation-error");
            $('#Zip').addClass("input-validation-valid");
            $("#Zip").rules("add", {
                required: false,
                messages: {
                    required: "",
                    regex: "",
                }
            });
        }
        else {
            if (usZipPattern.test(this.value)) {
                $('#Zip').rules("remove");
                $('#Zip').removeClass("input-validation-error");
                $('#Zip').addClass("input-validation-valid");
            }
            else {

                $("#Zip").rules("add", {
                    required: true,
                    regex: usZipPattern,
                    messages: {
                        required: "The Zip  field is required.",
                        regex: "Invalid Zip.",
                    }
                });
            }
        }

    });

    //check Company US based
    $("input[name='i-radio']").click(function () {

        if ($('#IsNOTUSbased').is(":checked")) {
            removeRequiredClass();
            $('#CountryBox').show();
            $('#StateOfOrganization').rules("remove");
            $('#FirstName').rules("remove");
            $('#LastName').rules("remove");
            $('#LegalFormOfBusiness').rules("remove");
            $('#State').rules("remove");
            $('#Zip').rules("remove");
            $('#Zip').removeClass("input-validation-error");
            $('#Zip').addClass("input-validation-valid");
            //$("#Zip").rules("add",
            //    {
            //        required: false,
            //    });  
            $('#PhoneNumber').rules("remove");
            $("#PhoneNumber").unmask();
            $(':input').removeClass("input-validation-error");
            $(':input').addClass("input-validation-valid");
            $('span').removeClass("field-validation-error");
            $('span').addClass("field-validation-valid");
            $("#Country").rules("add", {
                required: true,
                messages: {
                    required: "The Country field is required.",
                }
            });

        }
        else {
            addRequiredClass();
            $('#CountryBox').hide();
            $('#Country').rules("remove");
            $("#PhoneNumber").mask('(000) 000-0000');
            $('#Country').removeClass("input-validation-error");
            $('#Country').addClass("input-validation-valid");
            $('#Country').val('');
            ValidationUSbased();
        }

    });

    function ValidationUSbased() {
        $("#StateOfOrganization").rules("add", {
            required: true,
            messages: {
                required: "The State Of Organization field is required.",
            }
        });
        $("#FirstName").rules("add", {
            required: true,
            messages: {
                required: "The First Name field is required.",
            }
        });
        $("#LastName").rules("add", {
            required: true,
            messages: {
                required: "The Last Name field is required.",
            }
        });
        $("#State").rules("add", {
            required: true,
            messages: {
                required: "The State field is required.",
            }
        });
        $("#LegalFormOfBusiness").rules("add", {
            required: true,
            messages: {
                required: "The Form Of Business field is required.",
            }
        });

        //$("#Zip").rules("add", {
        //    required: true,
        //    messages: {
        //        required: "The ZIP field is required.",
        //    }
        //});

        $("#Zip").rules("add", {
            required: true,
            regex: /(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/,
            messages: {
                required: "The Zip field is required.",
                regex: "Invalid Zip.",
            }
        });
        $("#PhoneNumber").rules("add", {
            required: true,
            regex: /^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/,
            messages: {
                required: "The Phone Number field is required.",
                regex: "Phone number requires 10 digits.",
            }
        });
        $("#PhoneNumber").mask('(000) 000-0000');

    }

    function removeRequiredClass() {
        $("label[for=State]").removeClass("required");
        $("label[for=Zip]").removeClass("required");
        $("label[for=StateOfOrganization]").removeClass("required");
        $("label[for=LegalFormOfBusiness]").removeClass("required");
        $("label[for=FirstName]").removeClass("required");
        $("label[for=LastName]").removeClass("required");
        $("label[for=PhoneNumber]").removeClass("required");
    }

    function addRequiredClass() {
        $("label[for=State]").addClass("required");
        $("label[for=Zip]").addClass("required");
        $("label[for=StateOfOrganization]").addClass("required");
        $("label[for=LegalFormOfBusiness]").addClass("required");
        $("label[for=FirstName]").addClass("required");
        $("label[for=LastName]").addClass("required");
        $("label[for=PhoneNumber]").addClass("required");
    }

    $("#LegalFormOfBusiness").change(function () {
        formValidate();
    });



    function SearchCompanyResult() {
        var form = $("#formFreeNowAccount")[0];
        $.ajax({
            async: false,
            url: '/ClientRegistration/DnbSearchCompany',
            type: "POST",
            data: {
                CompanyName: form.CompanyName.value,
                Address1: form.Address1.value,
                Address2: form.Address2.value,
                City: form.City.value,
                State: form.State.value,
                Zip: form.Zip.value,
                PhoneNumber: form.PhoneNumber.value,
                Country: form.Country.value,
                SatateOfOrg: form.StateOfOrganization.value,
                LegalFormOfBusiness: form.LegalFormOfBusiness.value,
                FirstName: form.FirstName.value,
                LastName: form.LastName.value,
                Email: form.Email.value,
            },
            error: function (xhr, status, err) {
                var message = "Server error has occurred.";
                if (xhr.status == 400) {
                    message = xhr.statusText;
                }
            },
            success: function (partialView) {
                $('#DNB-search-result').html(partialView);
            }
        });
    }

    $('#CreateAccount').on('click', '#btnSearchBack', function () {
        if ($("#DNB-search-result").is(":visible")) {
            $("#DNB-search-result").hide();
            $("#conform-account-form").hide();
            $("#DNB-Create-account").show();
            $("#PhoneNumber").unmask()
            if ($('#IsUSbased').is(":checked")) {
                $("#PhoneNumber").mask("(999) 999-9999");
            }
            return false;
        }
        else { return true; }

    });

    $('#CreateAccount').on('click', '#btn-Company-Finalize', function () {
        if (!$('input[name=SelectCompany]').is(':checked')) {
            $('#SelectCompany-error').show();
            return false;
        }
        else {
            $('#SelectCompany-error').hide();
            var SelectedDunsCompany = $('input[name=SelectCompany]:checked');
            $('#CompanyName').val(SelectedDunsCompany.attr('data-comanyname'));
            if (SelectedDunsCompany.attr('data-phonenumber') != "") {
                $('#PhoneNumber').val(SelectedDunsCompany.attr('data-phonenumber'));
            }
            $('#Address1').val(SelectedDunsCompany.attr('data-adress1'))
            $('#City').val(SelectedDunsCompany.attr('data-city'));
            $('#State').val(SelectedDunsCompany.attr('data-state'));
            var ZipLength = SelectedDunsCompany.attr('data-zip').length;

            if ($('#IsUSbased').is(":checked") && ZipLength == 9) {
                $('#Zip').val(SelectedDunsCompany.attr('data-zip').slice(0, 5) + "-" + SelectedDunsCompany.attr('data-zip').slice(5, 9));
            }
            else {
                $('#Zip').val(SelectedDunsCompany.attr('data-zip'));
            }
            $('#DunsNumber').val(parseFloat(SelectedDunsCompany.attr('data-dunsid')));
            $("#confirm-phone").html($('#PhoneNumber').val());
            $("#confirm-company-name").html(SelectedDunsCompany.attr('data-comanyname'));
            $("#confirm-Adddress").html(SelectedDunsCompany.attr('data-address'));
            $("#confirm-dunsid").html(SelectedDunsCompany.attr('data-dunsid'));
            $("#DNB-search-result").hide();
            $("#conform-account-form").show();
            $("#DNB-Create-account").hide();
            //     $("#PhoneNumber").unmask();
            $("#PhoneNumber").mask("(999) 999-9999");
            ProcessConfirmationSubmitWithData(3);
            return true;
        }
    });

    // Company not listed

    $('#CreateAccount').on('click', '#btn-companyNotListed', function () {
      
            $("#confirm-phone").html($('#PhoneNumber').val());
            $("#confirm-company-name").html($('#CompanyName').val());
            $("#confirm-Adddress").html($('#Address1').val());
            $("#confirm-dunsid").html("");
            $("#DNB-search-result").hide();
            $("#conform-account-form").show();
            $("#DNB-Create-account").hide();
            $("#PhoneNumber").mask("(999) 999-9999");
            return true;
    });


    $('#CreateAccount').on('click', '#btn-SelectCompany-MakeChange', function () {
        if (!$('input[name=SelectCompany]').is(':checked')) {
            $('#SelectCompany-error').show();
            return false;
        }
        else {
            $('#SelectCompany-error').hide();
            checkCompanyMakeChange = true;
            var SelectedDunsCompany = $('input[name=SelectCompany]:checked');
            $('#CompanyName').val(SelectedDunsCompany.attr('data-comanyname'));
            if (SelectedDunsCompany.attr('data-phonenumber') != "") {
                $('#PhoneNumber').val(SelectedDunsCompany.attr('data-phonenumber'));
            }
            $('#Address1').val(SelectedDunsCompany.attr('data-adress1'))
            $('#City').val(SelectedDunsCompany.attr('data-city'));
            $('#State').val(SelectedDunsCompany.attr('data-state'));
            var ZipLength = SelectedDunsCompany.attr('data-zip').length;

            if ($('#IsUSbased').is(":checked") && ZipLength == 9) {
                $('#Zip').val(SelectedDunsCompany.attr('data-zip').slice(0, 5) + "-" + SelectedDunsCompany.attr('data-zip').slice(5, 9));

            }
            else {
                $('#Zip').val(SelectedDunsCompany.attr('data-zip'));

            }
            $('#DunsNumber').val(parseFloat(SelectedDunsCompany.attr('data-dunsid')));
            $("#confirm-phone").html($('#PhoneNumber').val());
            $("#confirm-company-name").html(SelectedDunsCompany.attr('data-comanyname'));
            $("#confirm-Adddress").html(SelectedDunsCompany.attr('data-address'));
            $("#confirm-dunsid").html(SelectedDunsCompany.attr('data-dunsid'));
            $("#DNB-Create-account").show();
            $("#DNB-search-result").hide();
            $("#conform-account-form").hide();
            $("#PhoneNumber").unmask();
            $("#PhoneNumber").mask("(999) 999-9999");
            //ProcessConfirmationSubmitWithData(4)
            return true;
        }
    });


    $("#makeChanges").click(function () {
        $("#PhoneNumber").unmask()
        if ($('#IsUSbased').is(":checked")) {
            $("#PhoneNumber").mask("(999) 999-9999");
        }
        $("#DNB-search-result").hide();
        $("#conform-account-form").hide();
        $("#DNB-Create-account").show();


    });



    function ProcessConfirmationSubmitWithData(statusId) {
        var form = $("#formFreeNowAccount")[0];
        $.ajax({
            url: '/ClientRegistration/SaveQBOClientRegHistoryInfo',
            type: "POST",
            data: {
                CompanyName: form.CompanyName.value,
                Address1: form.Address1.value,
                Address2: form.Address2.value,
                City: form.City.value,
                State: form.State.value,
                Zip: form.Zip.value,
                PhoneNumber: form.PhoneNumber.value,
                Country: form.Country.value,
                SatateOfOrg: form.StateOfOrganization.value,
                LegalFormOfBusiness: form.LegalFormOfBusiness.value,
                FirstName: form.FirstName.value,
                LastName: form.LastName.value,
                Email: form.Email.value,
                StatusId: statusId
            },
            error: function (xhr, status, err) {
                var message = "Server error has occurred.";
                if (xhr.status == 400) {
                    message = xhr.statusText;
                }
            },
            success: function () {
            }
        });
    }
});
