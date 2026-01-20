using backend.Domain.Common;

namespace backend.Application.Common.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();
    Task<List<T>> GetPagedAsync(int pageNumber, int pageSize);
    Task<int> CountAsync();
    Task<T> AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task<bool> ExistsAsync(int id);
}
