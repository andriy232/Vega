using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vega.Controllers.Resources;
using vega.Models;
using vega.Persistance;

namespace vega.Controllers
{
    public class FeatureController
    {
        private VegaDbContext _context;
        private IMapper _mapper;

        public FeatureController(VegaDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("/api/features")]
        public async Task<IEnumerable<FeatureResource>> GetMakes()
        {
            var makes = await _context.Features.ToListAsync();

            return _mapper.Map<List<Feature>, List<FeatureResource>>(makes);
        }
    }

}