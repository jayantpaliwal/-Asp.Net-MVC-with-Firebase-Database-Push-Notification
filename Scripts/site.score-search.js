$(function () {

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

    $('#scoreContainer').on('click', '#sort_date', function ()
    { sortColumn(1); });
    $('#scoreContainer').on('click', '#sort_name', function ()
    { sortColumn(2); });
    $('#scoreContainer').on('click', '#sort_dunsnumber', function ()
    { sortColumn(3); });
    $('#scoreContainer').on('click', '#sort_score', function ()
    { sortColumn(4); });

    $('#scoreContainer').on('click', '#sort_score', function ()
    { sortColumn(4); });

    $('#scoreContainer').on('click', '#sort_createdBy', function () {
        sortColumn(5);
    });

    $('#scoreContainer').on('click', '#nextPageBtn', function () {
        var count = $(this).attr('data-value');
        GetNextRecord(count);
    });

    $('#scoreContainer').on('click', '#prevPageBtn', function () {
        var count = $(this).attr('data-value');
        GetNextRecord(count);
    });


    $('#scoreContainer').on('click', '#pagingNumberBtn', function () {
        var count = $(this).attr('data-value');
        GetNextRecord(count)
    });
    function GetNextRecord(count) {
        var searchText = $('#search_text').val();
        var sortColumnValue = $('#sort_order').attr('value');
        var sortColumnType = $('#sort_order').attr('type');
        $.ajax({
            async: true,
            url: "/DNB/ScorePageRecord",
            data: {
                "page": count,
                "Searchtext": searchText,
                "column": sortColumnValue,
                "type": sortColumnType
            },
            success: function (data) {
                $('#scoreTableData').html(data);
                changeSortIcon(sortColumnValue, sortColumnType);
                changeclass(count);

            }
        });
    }
    var numberId = 0;
    function changeclass(id) {
        if (id == 1) {
            var defaulclassName = $('#DefaultActive').attr('class', 'active');
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
            var defaulclassName = document.getElementById(id)
            if (defaulclassName != null) {
                defaulclassName.className = "active";
                $('#DefaultActive').attr('class', '');
            }
            else {
                $('#DefaultActive').attr('class', 'active');
            }
            numberId = id;
        }


    }

    function sortColumn(column) {
        if ($('#sort_order').attr('value') == column) {
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
        $('#sort_date').addClass('sorting');
        $('#sort_name').addClass('sorting');
        $('#sort_dunsnumber').addClass('sorting');
        $('#sort_score').addClass('sorting');
        $('#sort_createdBy').addClass('sorting');
        switch (parseInt(columnNo)) {
            case 1:
                $('#sort_date').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_date').addClass('sorting_asc')
                }
                else {
                    $('#sort_date').addClass('sorting_desc')
                }
                break;
            case 2:
                $('#sort_name').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_name').addClass('sorting_asc')
                }
                else {
                    $('#sort_name').addClass('sorting_desc')
                }
                break;
            case 3:
                $('#sort_dunsnumber').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_dunsnumber').addClass('sorting_asc')
                }
                else {
                    $('#sort_dunsnumber').addClass('sorting_desc')
                }
                break;
            case 4:
                $('#sort_score').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_score').addClass('sorting_asc')
                }
                else {
                    $('#sort_score').addClass('sorting_desc')
                }
                break;
            case 5:
                $('#sort_createdBy').removeClass('sorting');
                if (type == 'ASC') {
                    $('#sort_createdBy').addClass('sorting_asc')
                }
                else {
                    $('#sort_createdBy').addClass('sorting_desc')
                }
                break;
        }
    }

    $('#downloadPdf').click(function () {
        var columns = ["", ""];
        var rows = tableToJson($('#pdfData').get(0));
        var doc = new jsPDF('p', 'pt');
        doc.text(140, 30, "NOWaccount SBFE Score Report");
        doc.autoTable(columns, rows, {
            margin: { top: 40, left: 20, right: 20, bottom: 0 },
            createdHeaderCell: function (cell, data) {
                if (cell.raw === '') {
                    cell.styles.rowHeight = 0;
                }
            },

        });
        doc.save('score.pdf');
    });

  

    $('#btnRunScore').click(function () {
        var dunsNumber = $('#DunsNumber').val();
        $('#errorMessage').html('');
        if (dunsNumber.length != 9 || Number.isInteger(parseInt(dunsNumber)) != true)
        {
            $('#errorMessage').html('Enter valid DUNS number.');
            return false;
        }
        $.ajax({
            async: true,
            type :'json',
            url: "/DNB/NewDunsScore",
            data: {
                "dunsNumber": dunsNumber
            },
            success: function (data) {
                if (data.success != true) {
                    $('#errorMessage').html('No result found for this DUNS number.');
                    return;
                }
                else {
                    $('#searchByCompany').hide();
                    $('#searchByDuns').show();
                    $('#score-companyname')[0].innerHTML = data.CompanyName;
                    $('#score-duns')[0].innerHTML = data.DunsNumber;
                    $('#score-companyscore')[0].innerHTML = data.Score;
                    if (data.ErrorMessage != "") {
                        $('#errormessage-panel').show();
                        $('#score-errormessage')[0].innerHTML = data.ErrorMessage;
                    }
                    else {
                        $('#errormessage-panel').hide();
                    }
                    if (data.SEVERITY != "" && data.SEVERITY != null) {
                        $('#severity-panel').show();
                        $('#score-severity')[0].innerHTML = data.SEVERITY;
                    }
                    else {
                        $('#severity-panel').hide();
                    }
                    if (data.LANGUAGE != "" && data.LANGUAGE != null) {
                        $('#language-panel').show();
                        $('#score-language')[0].innerHTML = data.LANGUAGE;
                    }
                    else {
                        $('#language-panel').hide();
                    }
                    if (data.DTSERVER != "" && data.DTSERVER != null) {
                        $('#dtserver-panel').show();
                        $('#score-dtserver')[0].innerHTML = data.DTSERVER;
                    }
                    else {
                        $('#dtserver-panel').hide();
                    }
                    if (data.CountryISOAlpha2Code != "" && data.CountryISOAlpha2Code != null) {
                        $('#countryisoalpha2code-panel').show();
                        $('#score-countryisoalpha2code')[0].innerHTML = data.CountryISOAlpha2Code;
                    }
                    else {
                        $('#countryisoalpha2code-panel').hide();
                    }
                    if (data.ScoreReason1Code != "" && data.ScoreReason1Code != null) {
                        $('#scorereason1code-panel').show();
                        $('#score-scorereason1code')[0].innerHTML = data.ScoreReason1Code;
                    }
                    else {
                        $('#scorereason1code-panel').hide();
                    }
                    if (data.ScoreReason2Code != "" && data.ScoreReason2Code != null) {
                        $('#scorereason2code-panel').show();
                        $('#score-scorereason2code')[0].innerHTML = data.ScoreReason2Code;
                    }
                    else {
                        $('#scorereason2code-panel').hide();
                    }
                    if (data.ScoreReason3Code != "" && data.ScoreReason3Code != null) {
                        $('#scorereason3code-panel').show();
                        $('#score-scorereason3code')[0].innerHTML = data.ScoreReason3Code;
                    }
                    else {
                        $('#scorereason3code-panel').hide();
                    }
                    if (data.CurrentOpenAccountsCount != "" && data.CurrentOpenAccountsCount != null) {
                        $('#currentopenaccountscount-panel').show();
                        $('#score-currentopenaccountscount')[0].innerHTML = data.CurrentOpenAccountsCount;
                    }
                    else {
                        $('#currentopenaccountscount-panel').hide();
                    }
                    if (data.MostRecentDelinquencyDuration != "" && data.MostRecentDelinquencyDuration != null) {
                        $('#mostrecentdelinquencyduration-panel').show();
                        $('#score-mostrecentdelinquencyduration')[0].innerHTML = data.MostRecentDelinquencyDuration;
                    }
                    else {
                        $('#mostrecentdelinquencyduration-panel').hide();
                    }
                    if (data.OpenAccountsWithBalanceCount != "" && data.OpenAccountsWithBalanceCount != null) {
                        $('#openaccountswithbalancecount-panel').show();
                        $('#score-openaccountswithbalancecount')[0].innerHTML = data.OpenAccountsWithBalanceCount;
                    }
                    else {
                        $('#openaccountswithbalancecount-panel').hide();
                    }
                    if (data.OpenAccountsCount != "" && data.OpenAccountsCount != null) {
                        $('#openaccountscount-panel').show();
                        $('#score-openaccountscount')[0].innerHTML = data.OpenAccountsCount;
                    }
                    else {
                        $('#openaccountscount-panel').hide();
                    }
                    if (data.ClosedAccountsCount != "" && data.ClosedAccountsCount != null) {
                        $('#closedaccountscount-panel').show();
                        $('#score-closedaccountscount')[0].innerHTML = data.ClosedAccountsCount;
                    }
                    else {
                        $('#closedaccountscount-panel').hide();
                    }
                    if (data.TotalCurrentBalanceAmount != "" && data.TotalCurrentBalanceAmount != null) {
                        $('#totalcurrentbalanceamount-panel').show();
                        $('#score-totalcurrentbalanceamount')[0].innerHTML = data.TotalCurrentBalanceAmount;
                    }
                    else {
                        $('#totalcurrentbalanceamount-panel').hide();
                    }
                    if (data.TotalUtilizationPercentage != "" && data.TotalUtilizationPercentage != null) {
                        $('#totalutilizationpercentage-panel').show();
                        $('#score-totalutilizationpercentage')[0].innerHTML = data.TotalUtilizationPercentage;
                    }
                    else {
                        $('#totalutilizationpercentage-panel').hide();
                    }
                    if (data.TotalPastDueAmount != "" && data.TotalPastDueAmount != null) {
                        $('#totalpastdueamount-panel').show();
                        $('#score-totalpastdueamount')[0].innerHTML = data.TotalPastDueAmount;
                    }
                    else {
                        $('#totalpastdueamount-panel').hide();
                    }
                    if (data.SatisfactoryAccountsPercentage != "" && data.SatisfactoryAccountsPercentage != null) {
                        $('#satisfactoryaccountspercentage-panel').show();
                        $('#score-satisfactoryaccountspercentage')[0].innerHTML = data.SatisfactoryAccountsPercentage;
                    }
                    else {
                        $('#satisfactoryaccountspercentage-panel').hide();
                    }
                    if (data.MaximumBalanceVelocityAmount != "" && data.MaximumBalanceVelocityAmount != null) {
                        $('#maximumbalancevelocityamount-panel').show();
                        $('#score-maximumbalancevelocityamount')[0].innerHTML = data.MaximumBalanceVelocityAmount;
                    }
                    else {
                        $('#maximumbalancevelocityamount-panel').hide();
                    }
                    if (data.MaximumExposureAmount != "" && data.MaximumExposureAmount != null) {
                        $('#maximumexposureamount-panel').show();
                        $('#score-maximumexposureamount')[0].innerHTML = data.MaximumExposureAmount;
                    }
                    else {
                        $('#maximumexposureamount-panel').hide();
                    }
                    if (data.TotalExposureAmount != "" && data.TotalExposureAmount != null) {
                        $('#totalexposureamount-panel').show();
                        $('#score-totalexposureamount')[0].innerHTML = data.TotalExposureAmount;
                    }
                    else {
                        $('#totalexposureamount-panel').hide();
                    }

                    GetNextRecord(0);
                    $('#closePopupBtn').click();
                }

            },
            failure: function (data)
            {
                $('#errorMessage').html(data.message);
            }
        });



    });


    $('#searchByDuns').click(function () {
        var columns = ["", ""];
        var rows = tableToJson($('#pdfDataSearchByDuns').get(0));
        var doc = new jsPDF('p', 'pt');
        doc.text(140, 30, "NOWaccount SBFE SEARCH RESULT");
        doc.autoTable(columns, rows, {
            margin: { top: 40, left: 20, right: 20, bottom: 0 },
            createdHeaderCell: function (cell, data) {
                if (cell.raw === '') {
                    cell.styles.rowHeight = 0;
                }
            },

        });
        doc.save('SearchResult.pdf');

    });

    function tableToJson(table) {

        liTag = table.getElementsByTagName('li');
        var rec = [];        
        for (var i = 0; i < liTag.length; i++) {
            var recInner = [];
            if (liTag[i].hidden != true)
            {
                var label = liTag[i].getElementsByTagName('label')[0].innerHTML;
                var text = liTag[i].getElementsByTagName('p')[0].innerHTML;
                recInner.push(label, text);
                rec.push(recInner);
            }
              
        }
        return rec;
    }

});
