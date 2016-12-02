using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace FireBaseDemo.Controllers
{
    public class HomeController : Controller
    {
        const string LOGIN = "LoginSuccess";
        public ActionResult Index(string UserId)
        {
            if (Session[LOGIN] != null)
            {
                Models.Login logindetail = new Models.Login();
                logindetail = (Models.Login)Session[LOGIN];
                ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";
                ViewBag.UserId = logindetail.UserId;
                @ViewBag.UserName = logindetail.UserName;
                @ViewBag.DeviceId = logindetail.DeviceId;
                return View();
            }
            else
            {
                return RedirectToAction("Login");
            }
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult LoginWithFireBase()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }


        public JsonResult LoginSuccess(string UserId, string UserName, string DeviceId, bool IsSuccess = false)
        {
            if (!string.IsNullOrEmpty(UserId) && !string.IsNullOrEmpty(UserName))
            {
                Models.Login loginDetail = new Models.Login();
                loginDetail.UserId = UserId;
                loginDetail.UserName = UserName;
                loginDetail.IsSuccess = true;
                loginDetail.DeviceId = DeviceId;
                Session[LOGIN] = loginDetail;

            }

            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult LogOut()
        {
            Session[LOGIN] = null;
            return RedirectToAction("Login");
        }

        public JsonResult SendNotification(string deviceId, string message,string UserName)
        {
            string SERVER_API_KEY =  System.Configuration.ConfigurationManager.AppSettings["SERVER_API_KEY"];
            var SENDER_ID = System.Configuration.ConfigurationManager.AppSettings["SENDER_ID"]; ;
            var value = message;
            WebRequest tRequest;
            tRequest = WebRequest.Create("https://fcm.googleapis.com/fcm/send");
            //tRequest.UseDefaultCredentials = true;
            tRequest.Method = "post";
            tRequest.ContentType = " application/x-www-form-urlencoded;charset=UTF-8";
            tRequest.Headers.Add(string.Format("Authorization: key={0}", SERVER_API_KEY));

            tRequest.Headers.Add(string.Format("Sender: id={0}", SENDER_ID));

            string postData = "collapse_key=score_update&time_to_live=108&delay_while_idle=1&data.title=You have message from "+UserName+"&data.message=" + value + "&data.time=" + System.DateTime.Now.ToString() + "&registration_id=" + deviceId + "";
           
            Byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            tRequest.ContentLength = byteArray.Length;

            Stream dataStream = tRequest.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();

            WebResponse tResponse = tRequest.GetResponse();

            dataStream = tResponse.GetResponseStream();

            StreamReader tReader = new StreamReader(dataStream);

            String sResponseFromServer = tReader.ReadToEnd();


            tReader.Close();
            dataStream.Close();
            tResponse.Close();
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }

    }
}
