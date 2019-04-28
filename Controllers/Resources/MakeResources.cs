using System.Collections.Generic;
using System.Collections.ObjectModel;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace vega.Controllers.Resources
{
    public class MakeResources
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public ICollection<ModelResource> Models { get; set; }

        public MakeResources()
        {
            Models = new Collection<ModelResource>();
        }
    }
}