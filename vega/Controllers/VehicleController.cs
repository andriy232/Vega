using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using vega.Controllers.Resources;
using vega.Core;
using Vega.Core.Models;

namespace vega.Controllers
{
    [Route("/api/vehicles")]
    public class VehicleController : Controller
    {
        private readonly IVehicleRepository _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public VehicleController(IMapper mapper, IVehicleRepository repository, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetVehicles()
        {
            var queryResult = await _repository.ListVehiclesAsync();

            return Ok(_mapper.Map<QueryResult<Vehicle>, QueryResultResource<VehicleResource>>(queryResult));
        }

        [HttpGet]
        public async Task<QueryResultResource<VehicleResource>> GetVehicles(VehicleQueryResource queryResource)
        {
            var query = _mapper.Map<VehicleQueryResource, VehicleQuery>(queryResource);

            var queryResult = await _repository.ListVehiclesAsync(query);

            return _mapper.Map<QueryResult<Vehicle>, QueryResultResource<VehicleResource>>(queryResult);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            var vehicle = await _repository.GetVehicleAsync(id);

            if (vehicle == null)
                return NotFound();

            var value = _mapper.Map<Vehicle, VehicleResource>(vehicle);
            return Ok(value);
        }

        /* Test data
        {
            "isRegistered": true,
            "modelId": 10,
            "contact": {
                "name": "name",
                "phone": "phone",
                "email": "email"
            },
            "lastUpdate": "2020-01-05",
            "features": [
                1,
                2,
                3
            ]
        }
        */
        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleResource vehicleResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var model = await _repository.FindModelAsync(vehicleResource.ModelId);
            if (model == null)
            {
                ModelState.AddModelError("ModelId", "Invalid modelId.");
                return BadRequest(ModelState);
            }

            var vehicle = _mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);
            vehicle.LastUpdate = DateTime.Now;

            _repository.AddVehicle(vehicle);
            await _unitOfWork.CompleteAsync();

            vehicle = await _repository.GetVehicleAsync(vehicle.Id);

            var result = _mapper.Map<Vehicle, VehicleResource>(vehicle);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleResource vehicleResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var vehicle = await _repository.GetVehicleAsync(id);
            if (vehicle == null)
                return NotFound();

            _mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource, vehicle);
            vehicle.LastUpdate = DateTime.Now;

            await _unitOfWork.CompleteAsync();

            vehicle = await _repository.GetVehicleAsync(vehicle.Id);
            var result = _mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _repository.GetVehicleAsync(id, false);
            if (vehicle == null)
                return NotFound();

            _repository.RemoveVehicle(vehicle);
            await _unitOfWork.CompleteAsync();

            return Ok(id);
        }
    }
}