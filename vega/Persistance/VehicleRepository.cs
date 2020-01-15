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

        private readonly Dictionary<string, Expression<Func<Vehicle, object>>> _columnsMap =
            new Dictionary<string, Expression<Func<Vehicle, object>>>
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

        public async Task<QueryResult<Vehicle>> ListVehiclesAsync(VehicleQuery queryObj = null)
        {
            var queryItems = _context.Vehicles
                .Include(v => v.Model).ThenInclude(m => m.Make)
                .Include(v => v.Features).ThenInclude(vf => vf.Feature)
                .AsQueryable();

            if (queryObj != null)
            {
                if (queryObj.MakeId.HasValue)
                    queryItems = queryItems.Where(v => v.Model.MakeId == queryObj.MakeId.Value);

                if (queryObj.ModelId.HasValue)
                    queryItems = queryItems.Where(v => v.Model.Id == queryObj.ModelId.Value);

                queryItems = queryItems.ApplyOrdering(queryObj, _columnsMap);
            }

            var result = new QueryResult<Vehicle>
            {
                TotalItems = await queryItems.CountAsync()
            };

            if (queryObj != null)
            {
                queryItems = queryItems.ApplyPaging(queryObj);
            }

            result.Items = await queryItems.ToListAsync();
            return result;
        }
    }
}