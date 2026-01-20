using AutoMapper;
using backend.Application.Common.Interfaces;
using backend.Application.Posts.DTOs;
using backend.Domain.Common;
using backend.Domain.Entities;
using MediatR;

namespace backend.Application.Posts.Queries.GetPostById;

public class GetPostByIdQueryHandler : IRequestHandler<GetPostByIdQuery, PostDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetPostByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PostDto> Handle(GetPostByIdQuery request, CancellationToken cancellationToken)
    {
        var post = await _unitOfWork.Posts.GetByIdAsync(request.PostId);
        
        if (post == null)
            throw new NotFoundException(nameof(Post), request.PostId);

        if (post.IsDeleted)
            throw new NotFoundException(nameof(Post), request.PostId);

        // Check if post is private and user is not the owner
        if (post.IsPrivate && (!request.RequestingUserId.HasValue || post.UserId != request.RequestingUserId.Value))
            throw new BadRequestException("You are not authorized to view this post.");

        var postDto = _mapper.Map<PostDto>(post);
        return postDto;
    }
}
