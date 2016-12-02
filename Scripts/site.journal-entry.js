$(function () {
    function initializePage() {
        $('#selectClient').chosen();
        var form = $('#formJournalEntry');
        $.data(form[0], 'validator').settings.ignore = ".ignore";
        $('.chosen-select').chosen();
        setStep();

        $('#journalEntryTableBody tr').each(function (idx, ele) {
            var tr = $(ele);
            var allFieldsEmpty = tr.find('input:text').filter(function () { return this.value != ""; }).length == 0;
            tr.find('input:text, select').toggleClass("ignore", allFieldsEmpty);
        });
    }
    function showDatePicker() {
        $('[id$=JournalDate]').datepicker({
            changeYear: true,
            changeMonth: true,
            yearRange: "-10:+20",
            onSelect: function (date) {
                if (date) {
                    if ($(this).hasClass('NotValid')) {
                        $(this).removeClass('NotValid');
                    }
                }
            },
        });
    }
    function setStep() {
        var selectCustomer = $('#selectClient');
        $('#step1Instructions').toggle(selectCustomer.val() == '');
        $('#step2').toggle(selectCustomer.val() != '');
    }

    function clearRow(tr) {
        var sequence = tr.find('input[name$=Sequence]');
        if (parseInt(sequence.val()) > 8) {
            tr.remove();
        }
        else {
            tr.find('input').not(sequence).val('');
            tr.find('select').val('').trigger("chosen:updated");
        }
    }

    function calculateTotals() {
        var totalDebits = 0, totalCredits = 0;
        $('tbody tr input[name$=DebitAmount]').each(function () {
            if ($(this).val() != '') {
                totalDebits += parseFloat($(this).val());
            }
        });
        $('tbody tr input[name$=CreditAmount]').each(function () {
            if ($(this).val() != '') {
                totalCredits += parseFloat($(this).val());
            }
        });
        $('#TotalDebitAmount').val(totalDebits);
        $('#TotalCreditAmount').val(totalCredits);
        $('#totalDebits').html(accounting.formatNumber(totalDebits, 2));
        $('#totalCredits').html(accounting.formatNumber(totalCredits, 2));
    }

    initializePage();

    $(document).ajaxSend(function (event, request, settings) {
        $('#loading-indicator').show();
    });

    $(document).ajaxComplete(function (event, request, settings) {
        $('#loading-indicator').hide();
    });

    // Change client
    $("#selectClient").change(function () {
        var clientId = $(this).val();
        if (clientId == '') {
            setStep();
        }
        else {
            $.ajax({
                async: true,
                url: '/JournalEntries/New?clientId=' + $(this).val(),
                error: function (xhr, status, err) {
                    var message = "Server error has occurred.";
                    if (xhr.status == 400) {
                        message = xhr.statusText;
                    }
                    $('#modalMessageContent').html(message);
                    $('#modalMessage').modal();
                },
                success: function (partialView) {
                    $('#journalEntryContainer').html(partialView);
                    var form = $('#formJournalEntry');
                    $.validator.unobtrusive.parse(form);
                    $.data(form[0], 'validator').settings.ignore = ".ignore";
                    $('.chosen-select').chosen();
                    setStep();
                    showDatePicker();
                }
            });
        }
        $('#messageToUser').remove();
    });

    // Add new journal entry detail
    $("#addDetail").on('click', function () {
        var ref = $('#selectCustomer').val();
        if (ref != null && ref != '') {
            $.ajax({
                async: false,
                url: '/JournalEntries/NewDetail'
            }).success(function (partialView) {
                $('#journalEntryDetailsTableBody').append(partialView);
            });
        }
    });

    $('#journalEntryContainer').on('click', '#btnSaveJournalEntry', function () {
        $('#tableJournalEntry tbody tr').each(function () {
            if ($(this).find('input:text, select').filter(function () { return this.value != ""; }).length == 0) {
                var sequence = parseInt($(this).find('input:hidden[name$=Sequence]').val());
                if (sequence > 8) {
                    $(this).remove();
                }
            }
            var form = $('#formJournalEntry');
            if (form.valid()) {
                form.submit();
            }
        });
    });

    $('#journalEntryContainer').on('click', '.btn-delete', function () {
        var tr = $(this).closest('tr');
        clearRow(tr);
        calculateTotals();
    });

    $('#journalEntryContainer').on('click', '#btnClearAllLines', function () {
        $('#tableJournalEntry tbody tr').each(function () {
            clearRow($(this));
        });
        calculateTotals();
    });

    $('#journalEntryContainer').on('focusin', 'input', function () {
        $(this).closest('tr').addClass('selected');
    });

    $('#journalEntryContainer').on('focusout', 'input', function () {
        // Configure row & validation
        var tr = $(this).closest('tr');
        tr.removeClass('selected');
        var allFieldsEmpty = tr.find('input:text').filter(function () { return this.value != ""; }).length == 0;
        tr.find('input:text, select').toggleClass("ignore", allFieldsEmpty);
    });

    $('#journalEntryContainer').on('change', 'select[name$=AccountId]', function () {
        var selectedText = $(this).children(":selected").text();
        var tr = $(this).closest('tr');

        tr.find('input:hidden[name$=AccountName]').val(selectedText);
        // Prefill debits/credits for the current line with the balance; Carry description forward as well
        if (selectedText != '') {
            var prevTrList = tr.prevAll('tr');
            for (var i = 0; i < prevTrList.length; i++) {
                debugger;
                var prevTr = $(prevTrList[i]);
                var account = prevTr.find('select[name$=AccountId]').val();
                var debits = prevTr.find('input[name$=DebitAmount]').val();
                var credits = prevTr.find('input[name$=CreditAmount]').val();
                var description = prevTr.find('input[name$=Description]').val();
                var entityName = prevTr.find('input[name$=EntityNameId]').val();
                if (account != '' || debits != '' || credits != '' || description != '' || entityName != '') {
                    // found the last entered tr
                    calculateTotals();
                    var totalDebits = parseFloat($('#TotalDebitAmount').val());
                    var totalCredits = parseFloat($('#TotalCreditAmount').val());
                    if (totalDebits != totalCredits) {
                        tr.find('input[name$=DebitAmount]').val(totalCredits > totalDebits ? accounting.formatNumber((totalCredits - totalDebits), { precision: 2, thousand: '' }) : '');
                        tr.find('input[name$=CreditAmount]').val(totalDebits > totalCredits ? accounting.formatNumber((totalDebits - totalCredits), { precision: 2, thousand: '' }) : '');
                        tr.find('input[name$=Description]').val(description);
                        calculateTotals();
                    }
                    break;
                }
            }
        }
    });

    $('#journalEntryContainer').on('change', 'select[name$=EntityNameId]', function () {
        var selectedText = $(this).find("option:selected").text();
        alert(selectedText);
        var tr = $(this).closest('tr');
        tr.find('input:hidden[name$=EntityName]').val(selectedText);
    });

    $('#journalEntryContainer').on('focusout', 'input[name$=DebitAmount]', function () {
        var val = $(this).val();
        if (val - 0 == val && val.length > 0) {
            $(this).closest('tr').find('input[name$=CreditAmount]').val('');
            $(this).val(accounting.formatNumber(val, { precision: 2, thousand: '' }));
        }
        else {
            $(this).val('');
        }
        calculateTotals();
    });

    $('#journalEntryContainer').on('focusout', 'input[name$=CreditAmount]', function () {
        var val = $(this).val();
        if (val - 0 == val && val.length > 0) {
            $(this).closest('tr').find('input[name$=DebitAmount]').val('');
            $(this).val(accounting.formatNumber(val, { precision: 2, thousand: '' }));
        }
        else {
            $(this).val('');
        }
        calculateTotals();
    });
});
