using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Vega.Core;
using Vega.Core.Models;

namespace Vega.Persistance
{
    public class PhotoManager : IPhotoManager
    {
        private readonly IPhotoStorage _photoStorage;
        private readonly IUnitOfWork _unitOfWork;

        public PhotoManager(IUnitOfWork unitOfWork, IPhotoStorage photoStorage)
        {
            _photoStorage = photoStorage;
            _unitOfWork = unitOfWork;
        }

        public async Task<Photo> UploadPhotoAsync(Vehicle vehicle, IFormFile file, string uploadFolderPath)
        {
            var fileName = await _photoStorage.StorePhoto(uploadFolderPath, file);

            var photo = new Photo {FileName = fileName};
            vehicle.Photos.Add(photo);
            await _unitOfWork.CompleteAsync();

            return photo;
        }
    }
}