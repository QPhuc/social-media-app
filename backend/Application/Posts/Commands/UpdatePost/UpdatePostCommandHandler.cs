using AutoMapper;
using backend.Application.Common.Interfaces;
using backend.Application.Posts.DTOs;
using backend.Domain.Common;
using backend.Domain.Entities;
using MediatR;

namespace backend.Application.Posts.Commands.UpdatePost;

public class UpdatePostCommandHandler : IRequestHandler<UpdatePostCommand, PostDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdatePostCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PostDto> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
    {
        var post = await _unitOfWork.Posts.GetByIdAsync(request.PostId);
        
        if (post == null)
            throw new NotFoundException(nameof(Post), request.PostId);

        if (post.UserId != request.UserId)
            throw new BadRequestException("You are not authorized to update this post.");

        if (request.Content != null)
            post.Content = request.Content;

        if (request.ImageUrl != null)
            post.ImageUrl = request.ImageUrl;

        if (request.IsPrivate.HasValue)
            post.IsPrivate = request.IsPrivate.Value;

        post.DateUpdated = DateTime.UtcNow;

        _unitOfWork.Posts.Update(post);
        await _unitOfWork.SaveChangesAsync();

        var postDto = _mapper.Map<PostDto>(post);
        return postDto;
    }
}
