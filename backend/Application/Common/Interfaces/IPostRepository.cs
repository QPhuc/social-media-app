using backend.Domain.Entities;

namespace backend.Application.Common.Interfaces;

public interface IPostRepository : IGenericRepository<Post>
{
    Task<List<Post>> GetPostsByUserIdAsync(int userId, int pageNumber, int pageSize);
    Task<List<Post>> GetPostsWithLikesAndCommentsAsync(int pageNumber, int pageSize);
    Task<int> GetLikesCountAsync(int postId);
    Task<int> GetCommentsCountAsync(int postId);
    Task<bool> IsLikedByUserAsync(int postId, int userId);
}
