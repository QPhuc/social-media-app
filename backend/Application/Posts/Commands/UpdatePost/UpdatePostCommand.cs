using MediatR;
using backend.Application.Posts.DTOs;

namespace backend.Application.Posts.Commands.UpdatePost;

public class UpdatePostCommand : IRequest<PostDto>
{
    public int PostId { get; set; }
    public int UserId { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public bool? IsPrivate { get; set; }
}
