using MediatR;
using backend.Application.Posts.DTOs;

namespace backend.Application.Posts.Commands.CreatePost;

public class CreatePostCommand : IRequest<PostDto>
{
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public bool IsPrivate { get; set; }
    public int UserId { get; set; }
}
