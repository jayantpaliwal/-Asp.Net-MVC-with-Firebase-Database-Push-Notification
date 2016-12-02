$(function () {
    $(document).ajaxSend(function (event, request, settings) {
        $('#loading-indicator').show();
    });

    $(document).ajaxComplete(function (event, request, settings) {
        $('#loading-indicator').hide();
    });

    function setInvoiceCount() {
        var invoiceCount = $('tr[data-id] input[name$=InvoiceId]').not('[value=""]').length;
        var pendingCount = $('tr[data-id] input[name$=InvoiceId][value=""]').length;
        $('#invoiceCount').html(invoiceCount);
        $('#emptyBatch').toggleClass("inline-block", invoiceCount == 0).toggleClass("hidden", invoiceCount > 0);
        $('#pendingBatch').toggleClass("inline-block", invoiceCount > 0).toggleClass("hidden", invoiceCount == 0);
        $('#invoiceCount').toggleClass('bg-gray', invoiceCount == 0).toggleClass('bg-danger bg-light', invoiceCount > 0);
        $('#CountBox').toggleClass("pending", invoiceCount > 0);
        $('#step1Instructions').toggle(invoiceCount + pendingCount == 0);
        $('#step2').toggle(invoiceCount + pendingCount > 0);
        totalRowLength = $(".trInvoiceEdit").length;
        if (totalRowLength != 0) {
            selectedRowId = $(".trInvoiceEdit")[totalRowLength - 1].dataset.id;
            addDatePicker(selectedRowId);
        }
        if (invoiceCount == 0 || pendingCount > 0) {
            $("#fs-Hide").hide();
        }
        else {
            $("#fs-Hide").show();
        }
    }

    setInvoiceCount();
    // Change customer
    $("#selectCustomer").change(function () {
        var debtorKey = $(this).val();
        $('#NowCustomerId').val(debtorKey);        
        // Check INVOICE OFF
        $.ajax({
            async: true,
            type: 'json',
            url: '/Invoices/CheckInvoice?debtorKey=' + debtorKey,
            error: function (xhr, status, err) {
                var message = "Server error has occurred.";
                if (xhr.status == 400) {
                    message = xhr.statusText;
                }
            },
            success: function (data) {
                if (data.success) {
                    $('#IsInvoice').show();
                    $('#addInvoice').hide();
                }
                else {

                    $('#IsInvoice').hide();
                    $('#addInvoice').show();
                }
               
            }
        });
    });

    // Add new invoice
    $("#addInvoice").on('click', function () {
        var debtorKey = $('#selectCustomer').val();
        if (debtorKey != null && debtorKey != '') {
            $.ajax({
                async: false,
                url: '/Invoices/New?debtorKey=' + debtorKey,
                error: function (xhr, status, err) {
                    var message = "Server error has occurred.";
                    if (xhr.status == 400) {
                        message = xhr.statusText;
                    }
                    $('#modalInvoiceMessageContent').html(message);
                    $('#modalInvoiceMessage').modal();
                },
                success: function (partialView) {
                    $('#invoicesTableBody').append(partialView);
                    if (/Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                        scrollBottom()
                    }

                    var form = $('#formInvoiceBatch');
                    form.removeData('validator');
                    form.removeData('unobtrusiveValidation');
                    $.validator.unobtrusive.parse(form);
                    setInvoiceCount();
                }
            });
        }
    });

    function scrollBottom() {
        $('html, body').animate({ scrollTop: $(document).height() }, 500);
    }
    //modal confirm Finish and Submit
    $("#modalConfirmSubmit").on('click', function () {
        $('#modelSaveConfirmation').modal();
    });
    //modal Invoices Batch Help
    $(".modalInvoiceHelp").on('click', function () {
        $('#modelInvoicesBatchHelp').modal();
    });

    //Jquery Date picker Configure
    function addDatePicker(id) {
        var id = "date_" + id;
        $('[id$=' + id + ']').datepicker({
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

    // Configure delete(s)
    $('#batchContainer').on('click', '.btn-delete-invoice', function () {
        var dataId = $(this).attr('data-id');
        var invoiceId = $('input[name$="InvoiceId"][data-id="' + dataId + '"]').val();
        if (invoiceId == '') {
            $('tr[data-id="' + dataId + '"]').remove();
            setInvoiceCount();
        }
        else {
            var form = $('#__AjaxAntiForgeryForm');
            var token = $('input[name="__RequestVerificationToken"]', form).val();
            $.ajax({
                url: '/Invoices/Delete/' + invoiceId,
                type: 'POST',
                data: {
                    __RequestVerificationToken: token
                },
                success: function (result) {
                    $('tr[data-id="' + dataId + '"]').remove();
                    setInvoiceCount();
                }
            });
        }
    });

    // Configure save(s)
    $('#batchContainer').on('click', '.btn-save-invoice', function () {
        var form = $('#formInvoiceBatch');
        if (form.valid()) {
            form.submit();
        }
    });

    // Configure edit(s)
    $('#batchContainer').on('click', '.btn-edit-invoice', function () {
        var dataId = $(this).attr('data-id');
        $("#addInvoice, .btn-submit").prop('disabled', true); // disable add/submit button
        $('tr[data-id="' + dataId + '"]').toggle(); // toggle view/edit rows
        addDatePicker(dataId);
        var selectedDate = $('#date_' + dataId)[0].value;
        $('#date_' + dataId).datepicker("setDate", new Date(selectedDate));
    });

    // Configure cancel(s)
    $('#batchContainer').on('click', '.btn-cancel-invoice', function () {
        var dataId = $(this).attr('data-id');
        var invoiceId = $('tr[data-id="' + dataId + '"] input[name$=InvoiceId]').val();
        if (invoiceId == null || invoiceId == '') {
            $('tr[data-id="' + dataId + '"]').remove();
        }
        else {
            $('tr[data-id="' + dataId + '"] input[data-replace]').each(function (index, value) { $(this).val($(this).attr('data-replace')) });
            if ($('tr[data-id="' + dataId + '"] .invoiceFileName').length == 0) {
                $('tr[data-id="' + dataId + '"] .invoiceFileUpdate').show();
            }
            else {
                $('tr[data-id="' + dataId + '"] .invoiceFileName').show();
                $('tr[data-id="' + dataId + '"] .invoiceFileUpdate').hide();
                $('tr[data-id="' + dataId + '"] input[name$=DeleteInvoiceFile]').val(false);
            }
        }
        $("#addInvoice, .btn-submit").prop('disabled', false); // enable add button
        $('tr[data-id="' + dataId + '"]').toggle(); // toggle view/edit rows
        setInvoiceCount();
    });

    // Configure delete invoice file
    $('#batchContainer').on('click', '.btnDeleteInvoiceFile', function () {
        var dataId = $(this).attr('data-id');
        $('tr[data-id="' + dataId + '"] input[name$=DeleteInvoiceFile]').val(true);
        $('tr[data-id="' + dataId + '"] .invoiceFileName').hide();
        $('tr[data-id="' + dataId + '"] .invoiceFileUpdate').show();
    });

    // btn Invoice Submit Disable
    $('#btnInvoiceSubmit').click(function () {
        $('#btnInvoiceSubmit').addClass('disabled');
    });

    var moreId = '';
    //modal Invoice More options
    $('#batchContainer').on('click', '.moreOptionsModal', function () {
        var dataId = $(this).attr('data-id');
        var dataName = $(this).attr('data-name');
        var credit = $(this).attr('data-available-credit');
        var ptid = $('tr input[name*=ProcessingTypeId][data-id="' + dataId + '"]:not([name*=CustomerProcessingTypeId])').val();
        var cptid = $('#ClientProcessingTypeId').val();

        moreId = dataId;
        $('#PaymentAdministration').prop('checked', false);
        $('#PaymentGuarantee').prop('checked', false);
        $('#PaymentNow').prop('checked', false);

        if (ptid == 1) {
            $('#PaymentAdministration').prop('checked', true)
        }
        if (ptid == 2) {
            $('#PaymentGuarantee').prop('checked', true)
        }
        if (ptid == 3) {
            $('#PaymentNow').prop('checked', true)
        }
        //$('#PaymentAdministration').attr('checked', ptid >= 1);
        //$('#PaymentGuarantee').attr('checked', ptid >= 2);
        //$('#PaymentNow').attr('checked', ptid >= 3);

        $('#PaymentGuarantee, label[for=PaymentGuarantee]').attr('disabled', cptid < 2);
        $('#PaymentNow, label[for=PaymentNow]').attr('disabled', cptid < 3);

        $('#IPO_availableCredit').html(parseFloat(credit).toFixed(2));
        $('#IPO_CustomerName').html(dataName);

        $('#moreOptionsModal').modal();
    });

    $('#btnSaveMore').click(function () {
        var processingTypeId = 1;

        if ($('#PaymentNow').is(':checked')) {
            processingTypeId = 3;
        }
        else if ($('#PaymentGuarantee').is(':checked')) {
            processingTypeId = 2;
        }

        $('tr input[name*=ProcessingTypeId][data-id="' + moreId + '"]:not([name*=CustomerProcessingTypeId])').val(processingTypeId);

        if ($('#UpdateCustomerProcessingTypeId').is(':checked')) {
            var custid = $('tr input[name*=CustomerProcessingTypeId][data-id="' + moreId + '"]').attr('data-custid');
            $('tr input[name*=CustomerProcessingTypeId][data-custid="' + custid + '"]').val(processingTypeId);
        }
        else {
            var custid = $('tr input[name*=CustomerProcessingTypeId][data-id="' + moreId + '"]').attr('data-custid');
            $('tr input[name*=CustomerProcessingTypeId][data-custid="' + custid + '"]').val('');
        }

        $('#moreOptionsModal').modal('toggle');
    });

    // Processing Option select PaymentAdministration
    $("#PaymentAdministration").on('click', function () {
        $('#PaymentAdministration').prop('checked', true);
        $('#PaymentNow').prop('checked', false);
        $('#PaymentGuarantee').prop('checked', false);


    });

    // Processing Option select PaymentGuarantee
    $("#PaymentGuarantee").on('click', function () {
        $('#PaymentGuarantee').prop('checked', true);
        $('#PaymentAdministration').prop('checked', false);
        $('#PaymentNow').prop('checked', false);
        //if ($(this).is(':checked')) {
        //    $('#PaymentAdministration').prop('checked', true);
        //}
        //else {
        //    $('#PaymentNow').prop('checked', false);
        //}
    });

    // Processing Option select PaymentNow
    $("#PaymentNow").on('click', function () {
        $('#PaymentNow').prop('checked', true);
        $('#PaymentAdministration').prop('checked', false);
        $('#PaymentGuarantee').prop('checked', false);
        //if ($(this).is(':checked')) {
        //    $('#PaymentAdministration').prop('checked', true);
        //    $('#PaymentGuarantee').prop('checked', true);
        //}
    });
});
