using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FireBaseDemo.Models
{
    public class Login
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string DeviceId { get; set; }
        public bool IsSuccess { get; set; }

    }
}