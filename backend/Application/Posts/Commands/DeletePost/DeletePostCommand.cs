using MediatR;

namespace backend.Application.Posts.Commands.DeletePost;

public class DeletePostCommand : IRequest<Unit>
{
    public int PostId { get; set; }
    public int UserId { get; set; }
}
