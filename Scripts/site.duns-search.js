$(function () {
    $('#tblCompanySearchHistory').dataTable({
        "aaSorting": [[0, "desc"]]
    });

    $(document).ajaxSend(function (event, request, settings) {

        $('#loading-indicator').show();
    });

    $(document).ajaxComplete(function (event, request, settings) {

        $('#loading-indicator').hide();
    });

    $('#search_text').keyup(function (e) {
        if (e.keyCode == 13) {
            GetNextRecord(1);
        }
    });

    //Search Click 
    $("#searchTextBtn").on('click', function () {
        GetNextRecord(1);
    });

    $('#dunsContainer').on('click', '#sort_name', function ()
    { sortColumn(1); });
    $('#dunsContainer').on('click', '#sort_address1', function ()
    { sortColumn(2); });
    $('#dunsContainer').on('click', '#sort_city', function ()
    { sortColumn(3); });
    $('#dunsContainer').on('click', '#sort_state', function ()
    { sortColumn(4); });
    $('#dunsContainer').on('click', '#sort_zip', function ()
    { sortColumn(5); });
    $('#dunsContainer').on('click', '#sort_phone', function ()
    { sortColumn(6); });
    $('#dunsContainer').on('click', '#sort_duns', function ()
    { sortColumn(7); });


    $('#dunsContainer').on('click', '#prevPageBtn', function () {
        var count = $(this).attr('data-value');
        GetNextRecord(count)
    });

    $('#dunsContainer').on('click', '#nextPageBtn', function () {
        var count = $(this).attr('data-value');
        GetNextRecord(count)
    });

    $('#dunsContainer').on('click', '#pagingNumberBtn', function () {
        var count = $(this).attr('data-value');
        GetNextRecord(count)
    });
    function GetNextRecord(count) {
        var searchText = $('#search_text').val();
        var sortColumnValue = $('#sort_order').attr('value');
        var sortColumnType = $('#sort_order').attr('type');
        $.ajax({
            async: true,
            url: "/DNB/NextRecord",
            data: {
                "page": count,
                "Searchtext": searchText,
                "column": sortColumnValue,
                "type": sortColumnType
            },
            success: function (data) {
                $('#tableData').html(data);
                changeSortIcon(sortColumnValue, sortColumnType);
                changeclass(count);

            }
        });
    }
    var numberId = 0;
    function changeclass(id) {
        if (id == 1) {
            var NAME = $('#DefaultActive').attr('class', 'active');
            if (document.getElementById(numberId) != undefined) {
                document.getElementById(numberId).className = "";
            }
        }
        else {
            if (numberId != 0) {
                if (document.getElementById(numberId) != null) {
                    document.getElementById(numberId).className = "";
                }
                else {
                    $('#DefaultActive').attr('class', '');
                }
            }
            var NAME = document.getElementById(id)
            if (NAME != null) {
                NAME.className = "active";
                $('#DefaultActive').attr('class', '');
            }
            else {
                $('#DefaultActive').attr('class', 'active');
            }
            numberId = id;
        }


    }

    function sortColumn(column) {
        if ($('#sort_order').attr('value') == column)  {
            if ($('#sort_order').attr('type') == 'ASC') {
                $('#sort_order').attr('type', 'DESC');
            }
            else {
                $('#sort_order').attr('type', 'ASC');
            }
        }
        else {
            $('#sort_order').attr('value', column);
            $('#sort_order').attr('type', 'ASC');
        }
        GetNextRecord(1);
    }

    function changeSortIcon(columnNo, type) {
        $('#sort_name').addClass('sorting');
        $('#sort_address1').addClass('sorting');
        $('#sort_city').addClass('sorting');
        $('#sort_state').addClass('sorting');
        $('#sort_zip').addClass('sorting');
        $('#sort_phone').addClass('sorting');
        $('#sort_duns').addClass('sorting');

        switch (parseInt(columnNo)) {
            case 1:
                $('#sort_name').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_name').addClass('sorting_asc')
                }
                else {
                    $('#sort_name').addClass('sorting_desc')
                }
                break;
          
            case 2:
                $('#sort_address1').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_address1').addClass('sorting_asc')
                }
                else {
                    $('#sort_address1').addClass('sorting_desc')
                }
                break;
            case 3:
                $('#sort_city').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_city').addClass('sorting_asc')
                }
                else {
                    $('#sort_city').addClass('sorting_desc')
                }
                break;
            case 4:
                $('#sort_state').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_state').addClass('sorting_asc')
                }
                else {
                    $('#sort_state').addClass('sorting_desc')
                }
                break;
            case 5:
                $('#sort_zip').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_zip').addClass('sorting_asc')
                }
                else {
                    $('#sort_zip').addClass('sorting_desc')
                }
                break;
            case 6:
                $('#sort_phone').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_phone').addClass('sorting_asc')
                }
                else {
                    $('#sort_phone').addClass('sorting_desc')
                }
                break;
            case 7:
                $('#sort_duns').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_duns').addClass('sorting_asc')
                }
                else {
                    $('#sort_duns').addClass('sorting_desc')
                }
                break;
        }

    }


});
