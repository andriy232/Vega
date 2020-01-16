using System.Collections.Generic;
using System.Threading.Tasks;
using Vega.Core.Models;

namespace vega.Core
{
    public interface IPhotoRepository
    {
        Task<IEnumerable<Photo>> GetPhotosAsync(int vehicleId);
    }
}