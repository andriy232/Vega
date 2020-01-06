using System.Threading.Tasks;
using vega.Models;

namespace vega.Persistance
{
    public interface IVehicleRepository
    {
        Task<Vehicle> GetVehicle(int id);
    }
}