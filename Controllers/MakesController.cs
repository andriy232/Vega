using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vega.Models;
using vega.Persistence;

namespace vega.Controllers
{
    public class MakesController : Controller
    {
        private readonly VegaDbContext context;

        public MakesController(VegaDbContext context)
        {
            this.context = context;
        }

        [HttpGet("/api")]
        public async Task<string> GetHello()
        {
            return await Task.FromResult("Several makes from database");
        }
        
        [HttpGet("/api/makes")]
        public async Task<IEnumerable<Make>> GetMakes()
        {
            return await context.Makes.Include(x => x.Models).ToListAsync();
        }
    }
}