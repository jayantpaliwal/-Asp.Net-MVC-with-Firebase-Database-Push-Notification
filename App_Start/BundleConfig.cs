using System.Web;
using System.Web.Optimization;

namespace FireBaseDemo
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/contingentval").Include(
                        "~/scripts/contingent.unobtrusive*",
                        "~/scripts/extensions.unobtrusive*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/scripts/bootstrap.js",
                      "~/scripts/respond.js",
                      "~/scripts/typeahead.js",
                      "~/scripts/bootstrap-switch.js",
                      "~/scripts/bootstrap-select.js"));

            bundles.Add(new ScriptBundle("~/bundles/summernote-js").Include(
                      "~/scripts/summernote.js"));

            bundles.Add(new ScriptBundle("~/bundles/ext").Include(
                    "~/scripts/accounting.js",
                    "~/scripts/chosen.jquery.js",
                     "~/scripts/jquery.dataTables.js",
                    "~/scripts/jquery.querystring.js",
                    "~/scripts/jquery.mask.js",
                    "~/scripts/js.cookie.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/modules").Include(
                      "~/scripts/modules/constants.js",
                      "~/scripts/modules/datatables.js",
                      "~/scripts/angular-ripple.js",
                      "~/scripts/modules/ripple.js",
                      "~/scripts/modules/ui-sidebar.js"));

            bundles.Add(new ScriptBundle("~/bundles/site").Include(
                    "~/scripts/site.js"));

            bundles.Add(new StyleBundle("~/bundles/css").Include(
                    "~/styles/main.css",
                    "~/styles/vendor.css",
                    "~/styles/chosen.css",
                    "~/styles/chosen.bootstrap.css",
                    "~/styles/bootstrap-switch.css",
                    "~/styles/bootstrap-select.css",
                    "~/styles/site.css",
                    "~/styles/site.journal-entry.css",
                    "~/styles/site.typeahead.css",
                    "~/styles/custom.css"));


            bundles.Add(new StyleBundle("~/bundles/summernote-css").Include(
                    "~/styles/summernote.css",
                    "~/styles/summernote-bs3.css"));
        }
    }
}
