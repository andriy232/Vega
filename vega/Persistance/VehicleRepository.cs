using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using vega.Models;

namespace vega.Persistance
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly VegaDbContext _context;

        public VehicleRepository(VegaDbContext context)
        {
            _context = context;
        }
        public async Task<Vehicle> GetVehicle(int id)
        {
            return await _context.Vehicles
        .Include(v => v.Features)
        .ThenInclude(vf => vf.Feature)
        .Include(v => v.Model)
        .ThenInclude(m => m.Make)
        .SingleOrDefaultAsync(v => v.Id == Id);
        }
    }
}