using AutoMapper;
using backend.Application.Posts.DTOs;
using backend.Domain.Entities;

namespace backend.Application.Posts.Mappings;

public class PostMappingProfile : Profile
{
    public PostMappingProfile()
    {
        CreateMap<Post, PostDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName ?? string.Empty))
            .ForMember(dest => dest.UserAvatar, opt => opt.MapFrom(src => src.User.ProfilePictureUrl))
            .ForMember(dest => dest.LikesCount, opt => opt.MapFrom(src => src.Likes.Count))
            .ForMember(dest => dest.CommentsCount, opt => opt.MapFrom(src => src.Comments.Count));

        CreateMap<CreatePostDto, Post>()
            .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.DateUpdated, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(_ => false))
            .ForMember(dest => dest.NrOfReports, opt => opt.MapFrom(_ => 0));

        CreateMap<UpdatePostDto, Post>()
            .ForMember(dest => dest.DateUpdated, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
