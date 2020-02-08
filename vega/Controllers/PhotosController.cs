using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Vega.Controllers.Resources;
using Vega.Core;
using Vega.Core.Models;

namespace Vega.Controllers
{
    [Route("/api/vehicles/{vehicleId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IPhotoRepository _photoRepository;
        private readonly PhotoSettings _photoSettings;
        private readonly IPhotoManager _photoManager;
        private readonly IWebHostEnvironment _host;
        private readonly IMapper _mapper;

        public PhotosController(IWebHostEnvironment host,
            IMapper mapper,
            IVehicleRepository vehicleRepository,
            IPhotoManager photoManager,
            IPhotoRepository photoRepository,
            IOptionsSnapshot<PhotoSettings> options)
        {
            _photoManager = photoManager;
            _vehicleRepository = vehicleRepository;
            _photoRepository = photoRepository;
            _photoSettings = options.Value;
            _mapper = mapper;
            _host = host;
        }

        [HttpPost]
        public async Task<IActionResult> UploadAsync(int vehicleId, IFormFile file)
        {
            if (file == null)
                return BadRequest("Null file");
            if (file.Length == 0)
                return BadRequest("Empty file");
            if (file.Length > _photoSettings.MaxBytes)
                return BadRequest("Maximum file size exceeded!");

            var extension = Path.GetExtension(file.FileName);
            if (!_photoSettings.IsSupported(extension))
                return BadRequest("Not allowed file type!");

            var vehicle = await _vehicleRepository.GetVehicleAsync(vehicleId);
            if (vehicle == null)
                return NotFound();

            var uploadsFolderPath = Path.Combine(_host.WebRootPath, "uploads");
            var photo = await _photoManager.UploadPhotoAsync(vehicle, file, uploadsFolderPath);

            return Ok(_mapper.Map<Photo, PhotoResource>(photo));
        }

        [HttpGet]
        public async Task<IEnumerable<PhotoResource>> GetPhotos(int vehicleId)
        {
            var photos = await _photoRepository.GetPhotosAsync(vehicleId);

            return _mapper.Map<IEnumerable<Photo>, IEnumerable<PhotoResource>>(photos);
        }
    }
}