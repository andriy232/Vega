using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace vega.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet("/api")]
        public async Task<string> GetHello()
        {
            return await Task.FromResult("Hello from API!");
        }
    }
}