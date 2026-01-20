using backend.Application.Common.Interfaces;
using backend.Domain.Common;
using backend.Domain.Entities;
using MediatR;

namespace backend.Application.Posts.Commands.DeletePost;

public class DeletePostCommandHandler : IRequestHandler<DeletePostCommand, Unit>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeletePostCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(DeletePostCommand request, CancellationToken cancellationToken)
    {
        var post = await _unitOfWork.Posts.GetByIdAsync(request.PostId);
        
        if (post == null)
            throw new NotFoundException(nameof(Post), request.PostId);

        if (post.UserId != request.UserId)
            throw new BadRequestException("You are not authorized to delete this post.");

        _unitOfWork.Posts.Delete(post);
        await _unitOfWork.SaveChangesAsync();

        return Unit.Value;
    }
}
