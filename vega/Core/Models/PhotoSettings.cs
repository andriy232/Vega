using System;
using System.Linq;

namespace Vega.Core.Models
{
    public class PhotoSettings
    {
        public string[] AcceptedFileTypes { get; set; }
        
        public long MaxBytes { get; set; }

        public bool IsSupported(string extension)
        {
            return AcceptedFileTypes.Any(s => s.Equals(extension, StringComparison.OrdinalIgnoreCase));
        }
    }
}