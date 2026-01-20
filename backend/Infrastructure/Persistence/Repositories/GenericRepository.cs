using System.Linq.Expressions;
using backend.Application.Common.Interfaces;
using backend.Domain.Common;
using backend.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Persistence.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public GenericRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<List<T>> GetPagedAsync(int pageNumber, int pageSize, Expression<Func<T, bool>>? filter = null)
    {
        IQueryable<T> query = _dbSet;

        if (filter != null)
            query = query.Where(filter);

        return await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountAsync(Expression<Func<T, bool>>? filter = null)
    {
        if (filter != null)
            return await _dbSet.CountAsync(filter);

        return await _dbSet.CountAsync();
    }

    public async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        return entity;
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _dbSet.AnyAsync(x => x.Id == id);
    }
}
