$(function () {
    function sortHistory() {
        $('#historyTable').dataTable({
            'paging': false,  // Table pagination
            'ordering': true,  // Column ordering 
            'info': false,  // Bottom left status text
            "bFilter": false

        });
    }
    sortHistory();
    $('#btn-assingTask-popup').click(function () {
        var clientId = $(this).attr('data-id');
        var clientNumber = $(this).attr('data-client-number');
        $.ajax({
            async: true,
            url: '/Clients/GetUnAssignList?clientId=' + clientId + '&clientNumber=' + clientNumber,
            error: function (xhr, status, err) {
                var message = "Server error has occurred.";
                if (xhr.status == 400) {
                    message = xhr.statusText;
                }
            },
            success: function (partialView) {
                $('#assign_model_list').html(partialView);
                $('#assignModel').modal();
            }
        });
    });

    $('#assign_model_list').on('click', '.unassign_btn', function () {
        var clientTaskId = $(this).attr('data-id');
        var clientId = $(this).attr('data-client-id');
        var clientNumber = $(this).attr('data-client-number');
        $.ajax({
            async: true,
            url: '/Clients/GetAssign?taskId=' + clientTaskId + '&clientId=' + clientId + '&clientNumber=' + clientNumber,
            error: function (xhr, status, err) {
                var message = "Server error has occurred.";
                if (xhr.status == 400) {
                    message = xhr.statusText;
                }
            },
            success: function (partialView) {
                $('#assignModel').modal('toggle');
                $('#dataAssign').html(partialView);
                GetHistory(clientId, clientNumber);
            }
        });
    });

    $('#dataAssign').on('click', '.assign_btn_warning', function () {
        var clientTaskId = $(this).attr('data-id');
        var clientId = $(this).attr('data-client-id');
        var clientNumber = $(this).attr('data-client-number');
        $.ajax({
            async: true,
            url: '/Clients/GetOpen?clientTaskId=' + clientTaskId + '&clientNumber=' + clientNumber,
            error: function (xhr, status, err) {
                var message = "Server error has occurred.";
                if (xhr.status == 400) {
                    message = xhr.statusText;
                }
            },
            success: function (partialView) {
                $('#dataAssign').html(partialView);
                GetHistory(clientId, clientNumber);
            }
        });
    });

    $('#dataAssign').on('click', '.assign_btn_success', function () {
        var clientTaskId = $(this).attr('data-id');
        var clientId = $(this).attr('data-client-id');
        var clientNumber = $(this).attr('data-client-number');
        $.ajax({
            async: true,
            url: '/Clients/GetComplete?clientTaskId=' + clientTaskId + '&clientNumber=' + clientNumber,
            error: function (xhr, status, err) {
                var message = "Server error has occurred.";
                if (xhr.status == 400) {
                    message = xhr.statusText;
                }
            },
            success: function (partialView) {
                $('#dataAssign').html(partialView);
                GetHistory(clientId, clientNumber);
            }
        });
    });

    $('#dataAssign').on('click', '.assign_btn_delete', function () {
        var clientTaskId = $(this).attr('data-id');
        var clientId = $(this).attr('data-client-id');
        var clientNumber = $(this).attr('data-client-number');
        $.ajax({
            async: true,
            url: '/Clients/GetDelete?clientTaskId=' + clientTaskId + '&clientNumber=' + clientNumber,
            error: function (xhr, status, err) {
                var message = "Server error has occurred.";
                if (xhr.status == 400) {
                    message = xhr.statusText;
                }
            },
            success: function (partialView) {
                $('#dataAssign').html(partialView);
                GetHistory(clientId, clientNumber);
            }
        });
    });

    function GetHistory(clientId, clientNumber) {
        $.ajax({
            async: true,
            url: '/Clients/GetHistory?clientId=' + clientId + '&clientNumber=' + clientNumber,
            error: function (xhr, status, err) {
                var message = "Server error has occurred.";
                if (xhr.status == 400) {
                    message = xhr.statusText;
                }
            },
            success: function (partialView) {
                $('#dataHistory').html(partialView);
                sortHistory();
            }
        });
    }

    $(document).ajaxSend(function (event, request, settings) {
        $('#loading-indicator').show();
    });

    $(document).ajaxComplete(function (event, request, settings) {
        $('#loading-indicator').hide();
    });
});
