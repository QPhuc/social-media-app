using backend.Application.Common.Interfaces;
using backend.Domain.Entities;
using backend.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Persistence.Repositories;

public class PostRepository : GenericRepository<Post>, IPostRepository
{
    public PostRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<List<Post>> GetPostsByUserIdAsync(int userId, int pageNumber, int pageSize)
    {
        return await _dbSet
            .Where(x => x.UserId == userId)
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<Post>> GetPostsWithLikesAndCommentsAsync(int pageNumber, int pageSize)
    {
        return await _dbSet
            .Where(x => !x.IsPrivate)
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
                .ThenInclude(c => c.User)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetLikesCountAsync(int postId)
    {
        var post = await _dbSet
            .Include(p => p.Likes)
            .FirstOrDefaultAsync(p => p.Id == postId);
        
        return post?.Likes.Count ?? 0;
    }

    public async Task<int> GetCommentsCountAsync(int postId)
    {
        var post = await _dbSet
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Id == postId);
        
        return post?.Comments.Count ?? 0;
    }

    public async Task<bool> IsLikedByUserAsync(int postId, int userId)
    {
        return await _context.Set<Like>()
            .AnyAsync(l => l.PostId == postId && l.UserId == userId);
    }
}
