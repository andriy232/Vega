using System.Collections.Generic;
using System.Threading.Tasks;
using vega.Models;

namespace vega.Persistance
{
    public interface IVehicleRepository
    {
        void AddVehicle(Vehicle vehicle);
        Task<Vehicle> GetVehicleAsync(int id, bool includeRelated = true);
        void RemoveVehicle(Vehicle vehicle);
        Task<Model> FindModelAsync(int id);
        Task<List<Vehicle>> ListVehiclesAsync();
    }
}