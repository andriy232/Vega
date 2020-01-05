using Microsoft.AspNetCore.Mvc;
using vega.Models;

namespace vega.Controllers
{
    [Route("/api/vehicles")]
    public class FeatureController : Controller
    {
        [HttpPost]
        public IActionResult CreateVehicle([FromBody]Vehicle vehicle)
        {
            return Ok(vehicle);
        }

        [HttpGet]
        public IActionResult GetVehicle()
        {
            return Ok(1);
        }
    }
}