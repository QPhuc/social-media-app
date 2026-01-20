using AutoMapper;
using backend.Application.Common.DTOs;
using backend.Application.Common.Interfaces;
using backend.Application.Posts.DTOs;
using MediatR;

namespace backend.Application.Posts.Queries.GetPosts;

public class GetPostsQueryHandler : IRequestHandler<GetPostsQuery, PaginatedResponse<PostDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetPostsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PaginatedResponse<PostDto>> Handle(GetPostsQuery request, CancellationToken cancellationToken)
    {
        var posts = await _unitOfWork.Posts.GetPagedAsync(
            request.PageNumber,
            request.PageSize,
            p => !p.IsDeleted && 
                 (request.IncludePrivate || !p.IsPrivate) &&
                 (!request.UserId.HasValue || p.UserId == request.UserId.Value)
        );

        var totalCount = await _unitOfWork.Posts.CountAsync(
            p => !p.IsDeleted && 
                 (request.IncludePrivate || !p.IsPrivate) &&
                 (!request.UserId.HasValue || p.UserId == request.UserId.Value)
        );

        var postDtos = _mapper.Map<List<PostDto>>(posts);

        return new PaginatedResponse<PostDto>(
            postDtos,
            totalCount,
            request.PageNumber,
            request.PageSize
        );
    }
}
