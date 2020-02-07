using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace vega.Controllers
{
    public class TestController : Controller
    {
        [Authorize]
        [HttpGet("/api/auth-test")]
        public IActionResult Test()
        {
            return Ok("authorization works");
        }
    }
}