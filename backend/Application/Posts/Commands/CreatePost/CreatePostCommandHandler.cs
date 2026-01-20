using AutoMapper;
using backend.Application.Common.Interfaces;
using backend.Application.Posts.DTOs;
using backend.Domain.Entities;
using MediatR;

namespace backend.Application.Posts.Commands.CreatePost;

public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, PostDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreatePostCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PostDto> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        var post = new Post
        {
            Content = request.Content,
            ImageUrl = request.ImageUrl,
            IsPrivate = request.IsPrivate,
            UserId = request.UserId,
            DateCreated = DateTime.UtcNow,
            DateUpdated = DateTime.UtcNow,
            IsDeleted = false,
            NrOfReports = 0
        };

        await _unitOfWork.Posts.AddAsync(post);
        await _unitOfWork.SaveChangesAsync();

        var postDto = _mapper.Map<PostDto>(post);
        return postDto;
    }
}
