using backend.Application.Common.Interfaces;
using backend.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore.Storage;

namespace backend.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public async Task BeginTransactionAsync()
        => _transaction = await _context.Database.BeginTransactionAsync();

    public async Task CommitAsync()
    {
        await _context.SaveChangesAsync();
        await _transaction?.CommitAsync()!;
    }

    public async Task RollbackAsync()
        => await _transaction?.RollbackAsync()!;

    public async Task<int> CompleteAsync()
        => await _context.SaveChangesAsync();

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}