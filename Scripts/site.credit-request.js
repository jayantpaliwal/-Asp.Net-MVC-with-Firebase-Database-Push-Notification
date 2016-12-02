$(function () {
    function setStep() {
        debugger;
        var ref = $('#ClientRefNumber').val();
        var text = $("#ClientRefNumber option:selected").text();
        var availableCredit = $('#ClientRefNumber option:selected').attr('data-availablecredit');
        var hasSelection = (text != 'Select a Customer');
        var selectDebtor = $('#ClientRefNumber option:selected').attr('id')
        $('#selectDebtor').attr('href', '/Customers/Edit?DebtorKey='+selectDebtor);
        $('.selectedCustomerName').html(text);
        $('#availableCredit').html(accounting.formatMoney(availableCredit));
        $('#step1Instructions').toggle(!hasSelection || ref == '');
        $('#step2').toggle(hasSelection && ref != '');
        $('#invalidCustomer').toggle(hasSelection && ref == '');
    }

    setStep();

    $('#ClientRefNumber').change(function () {
        $('#messageToUser').remove();
        setStep();
    });

    Number.prototype.format = function (n, x, s, c) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
               num = this.toFixed(Math.max(0, ~~n));

        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    };


    $('#RequestAmount2').blur(function () {
        debugger;
        var number = $('#RequestAmount2').val();
        number = number.replace(/,/g, "");
        if (isNaN(number) != true && number != "") {
            number = parseFloat(number);
            $('#RequestAmount2').val(number.format(2, 3, ',', '.'));
            $('#user-error').hide();
        }
        else {
            // show red mark and validation message  
            $('#user-error').show();

        }
    });

    $('#btSubmit').click(function () {
        debugger;
        var number = $('#RequestAmount2').val();
        number = number.replace(/,/g, "");
        if (isNaN(number) == true || number == "") {

            return false;
        }
        else {
            $("#RequestAmount").val(number);

            return true;
        }

    });
});