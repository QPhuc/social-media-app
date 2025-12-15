namespace backend.Application.Common.Interfaces;

public interface IUnitOfWork
{
    Task<int> CompleteAsync();
    Task BeginTransactionAsync();
    Task CommitAsync();
    Task RollbackAsync();
}
