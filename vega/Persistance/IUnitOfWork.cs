using System.Threading.Tasks;

namespace vega.Persistance
{
    public interface IUnitOfWork
    {
        Task CompleteAsync();
    }
}