$(function () {
    // Reference the auto-generated proxy for the hub.
    var quickBooksAuthorizationHub = $.connection.quickBooksAuthorizationHub;

    // Create a function that the hub can call back to refresh the page
    quickBooksAuthorizationHub.client.refreshPage = function () {
        location.reload(true);
        //window.location = "/QuickBooks/AccountSettings";
    };

    // Start the connection
    $.connection.hub.start();

    // Add click handler
    $("#btn-intuit-Connect").click(function () {
        var url = $(this).attr("href") + "?connectionId=" + $.connection.hub.id;
        popupWindow(url, "quickbooks-connect", 800, 600);
        return false;
    });
});