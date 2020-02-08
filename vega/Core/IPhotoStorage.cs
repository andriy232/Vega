using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Vega.Core
{
    public interface IPhotoStorage
    {
        Task<string> StorePhoto(string uploadFolderPath, IFormFile file);
    }
}