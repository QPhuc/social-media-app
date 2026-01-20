using MediatR;
using backend.Application.Posts.DTOs;

namespace backend.Application.Posts.Queries.GetPostById;

public class GetPostByIdQuery : IRequest<PostDto>
{
    public int PostId { get; set; }
    public int? RequestingUserId { get; set; }
}
