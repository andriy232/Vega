using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using vega.Core;
using vega.Core.Models;
using vega.Extensions;

namespace vega.Persistance
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly VegaDbContext _context;

        private Dictionary<string, Expression<Func<Vehicle, object>>> columnsMap = new Dictionary<string, Expression<Func<Vehicle, object>>>()
        {
            ["make"] = v => v.Model.Make.Name,
            ["model"] = v => v.Model.Name,
            ["contactName"] = v => v.ContactName
        };

        public VehicleRepository(VegaDbContext context)
        {
            _context = context;
        }

        public async Task<Vehicle> GetVehicleAsync(int id, bool includeRelated = true)
        {
            if (!includeRelated)
                return await _context.Vehicles.FindAsync(id);

            return await _context.Vehicles
            .Include(v => v.Features)
            .ThenInclude(vf => vf.Feature)
           .Include(v => v.Model)
            .ThenInclude(m => m.Make)
           .SingleOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Model> FindModelAsync(int id)
        {
            return await _context.Models.FindAsync(id);
        }

        public void AddVehicle(Vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
        }

        public void RemoveVehicle(Vehicle vehicle)
        {
            _context.Remove(vehicle);
        }

        public async Task<List<Vehicle>> ListVehiclesAsync(VehicleQuery queryObj = null)
        {
            var query = _context.Vehicles
            .Include(v => v.Model).ThenInclude(m => m.Make)
            .Include(v => v.Features).ThenInclude(vf => vf.Feature)
            .AsQueryable();

            if (queryObj != null && queryObj.MakeId.HasValue)
                query = query.Where(v => v.Model.MakeId == queryObj.MakeId.Value);

            if (queryObj != null && queryObj.ModelId.HasValue)
                query = query.Where(v => v.Model.Id == queryObj.ModelId.Value);

            query = query.ApplyOrdering(queryObj, columnsMap);

            return await query.ToListAsync();
        }
    }
}