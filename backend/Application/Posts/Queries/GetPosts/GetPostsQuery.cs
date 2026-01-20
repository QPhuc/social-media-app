using MediatR;
using backend.Application.Common.DTOs;
using backend.Application.Posts.DTOs;

namespace backend.Application.Posts.Queries.GetPosts;

public class GetPostsQuery : IRequest<PaginatedResponse<PostDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int? UserId { get; set; }
    public bool IncludePrivate { get; set; } = false;
}
