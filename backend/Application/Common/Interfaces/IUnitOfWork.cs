namespace backend.Application.Common.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IPostRepository Posts { get; }
    
    Task<int> CompleteAsync();    Task<int> SaveChangesAsync();    Task BeginTransactionAsync();
    Task CommitAsync();
    Task RollbackAsync();
}
