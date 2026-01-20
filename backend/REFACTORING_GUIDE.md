# Backend Refactoring Summary

## ✅ Completed Changes

### 1. BaseEntity - Added Audit Fields
**File**: `Domain/Common/BaseEntity.cs`
- ✅ Added `CreatedAt`, `UpdatedAt`, `IsDeleted`
- ✅ Removed duplicate fields from `Post` entity

### 2. Repository Pattern
**Created Files**:
- ✅ `Application/Common/Interfaces/IGenericRepository.cs`
- ✅ `Application/Common/Interfaces/IPostRepository.cs`
- ✅ `Infrastructure/Persistence/Repositories/GenericRepository.cs`
- ✅ `Infrastructure/Persistence/Repositories/PostRepository.cs`

### 3. Unit of Work Pattern
**Updated Files**:
- ✅ `Application/Common/Interfaces/IUnitOfWork.cs` - Added `IPostRepository Posts { get; }`
- ✅ `Infrastructure/Persistence/UnitOfWork.cs` - Implemented lazy-loaded repository

### 4. Installed Packages
```bash
✅ dotnet add package MediatR
✅ dotnet add package FluentValidation.DependencyInjectionExtensions
✅ dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
```

## 📋 Remaining Tasks (Complete manually or in next session)

### 5. Create Exception Classes
Create these files in `Application/Common/Exceptions/`:

```csharp
// NotFoundException.cs
public class NotFoundException : Exception
{
    public NotFoundException(string name, object key)
        : base($"{name} ({key}) was not found") { }
}

// ValidationException.cs
public class ValidationException : Exception
{
    public List<string> Errors { get; }
    
    public ValidationException(List<string> errors)
        : base("Validation failed")
    {
        Errors = errors;
    }
}

// DomainException.cs
public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
}
```

### 6. Create DTOs
Create in `Application/Posts/DTOs/`:

```csharp
// PostDto.cs
public record PostDto(
    int Id,
    int UserId,
    string UserName,
    string? UserAvatar,
    string Content,
    string? ImageUrl,
    int LikesCount,
    int CommentsCount,
    bool IsLiked,
    DateTime CreatedAt
);

// CreatePostDto.cs
public record CreatePostDto(
    string Content,
    string? ImageUrl
);

// UpdatePostDto.cs
public record UpdatePostDto(
    string Content,
    string? ImageUrl
);

// ApiResponse.cs
public record ApiResponse<T>(
    bool Success,
    T? Data,
    string? Message = null,
    List<string>? Errors = null
);

// PaginatedResponse.cs
public record PaginatedResponse<T>(
    List<T> Items,
    int PageNumber,
    int PageSize,
    int TotalCount,
    int TotalPages
);
```

### 7. Create CQRS Commands & Queries

**CreatePostCommand.cs** in `Application/Posts/Commands/CreatePost/`:
```csharp
using MediatR;

public record CreatePostCommand(string Content, string? ImageUrl) 
    : IRequest<ApiResponse<PostDto>>;
```

**CreatePostCommandHandler.cs**:
```csharp
using MediatR;

public class CreatePostCommandHandler 
    : IRequestHandler<CreatePostCommand, ApiResponse<PostDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUser;
    
    public CreatePostCommandHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUser)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUser = currentUser;
    }
    
    public async Task<ApiResponse<PostDto>> Handle(
        CreatePostCommand request, 
        CancellationToken cancellationToken)
    {
        var post = new Post
        {
            UserId = _currentUser.UserId,
            Content = request.Content,
            ImageUrl = request.ImageUrl
        };
        
        await _unitOfWork.Posts.AddAsync(post);
        await _unitOfWork.CompleteAsync();
        
        var postDto = _mapper.Map<PostDto>(post);
        
        return new ApiResponse<PostDto>(true, postDto, "Post created successfully");
    }
}
```

**CreatePostValidator.cs**:
```csharp
using FluentValidation;

public class CreatePostValidator : AbstractValidator<CreatePostCommand>
{
    public CreatePostValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required")
            .MaximumLength(5000).WithMessage("Content must not exceed 5000 characters");
            
        RuleFor(x => x.ImageUrl)
            .Must(BeAValidUrl).When(x => !string.IsNullOrEmpty(x.ImageUrl))
            .WithMessage("Invalid image URL");
    }
    
    private bool BeAValidUrl(string? url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out _);
    }
}
```

**GetPostsQuery.cs** in `Application/Posts/Queries/GetPosts/`:
```csharp
public record GetPostsQuery(int PageNumber = 1, int PageSize = 10) 
    : IRequest<PaginatedResponse<PostDto>>;

public class GetPostsQueryHandler 
    : IRequestHandler<GetPostsQuery, PaginatedResponse<PostDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    
    public GetPostsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    
    public async Task<PaginatedResponse<PostDto>> Handle(
        GetPostsQuery request, 
        CancellationToken cancellationToken)
    {
        var posts = await _unitOfWork.Posts
            .GetPostsWithLikesAndCommentsAsync(request.PageNumber, request.PageSize);
            
        var totalCount = await _unitOfWork.Posts.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);
        
        var postDtos = _mapper.Map<List<PostDto>>(posts);
        
        return new PaginatedResponse<PostDto>(
            postDtos,
            request.PageNumber,
            request.PageSize,
            totalCount,
            totalPages
        );
    }
}
```

### 8. Create AutoMapper Profile

`Application/Posts/MappingProfiles/PostMappingProfile.cs`:
```csharp
using AutoMapper;

public class PostMappingProfile : Profile
{
    public PostMappingProfile()
    {
        CreateMap<Post, PostDto>()
            .ForMember(d => d.UserName, opt => opt.MapFrom(s => s.User.UserName))
            .ForMember(d => d.UserAvatar, opt => opt.MapFrom(s => s.User.Avatar))
            .ForMember(d => d.LikesCount, opt => opt.MapFrom(s => s.Likes.Count))
            .ForMember(d => d.CommentsCount, opt => opt.MapFrom(s => s.Comments.Count))
            .ForMember(d => d.IsLiked, opt => opt.Ignore()); // Set in handler
    }
}
```

### 9. Register Services in DI

Update `API/Extensions/ModuleRegistration.cs`:
```csharp
public static IServiceCollection AddApplicationServices(
    this IServiceCollection services)
{
    // MediatR
    services.AddMediatR(cfg => 
        cfg.RegisterServicesFromAssembly(typeof(Application.AssemblyMarker).Assembly));
    
    // FluentValidation
    services.AddValidatorsFromAssembly(typeof(Application.AssemblyMarker).Assembly);
    
    // AutoMapper
    services.AddAutoMapper(typeof(Application.AssemblyMarker).Assembly);
    
    // Add pipeline behaviors
    services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
    
    return services;
}
```

Create `Application/AssemblyMarker.cs`:
```csharp
namespace backend.Application;
public class AssemblyMarker { }
```

### 10. Create PostsController

`API/Controllers/PostsController.cs`:
```csharp
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PostsController : ControllerBase
{
    private readonly IMediator _mediator;
    
    public PostsController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponse<PostDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPosts(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var query = new GetPostsQuery(pageNumber, pageSize);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<PostDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
    {
        var command = new CreatePostCommand(dto.Content, dto.ImageUrl);
        var result = await _mediator.Send(command);
        
        if (!result.Success)
            return BadRequest(result);
            
        return CreatedAtAction(nameof(GetPostById), new { id = result.Data!.Id }, result);
    }
}
```

### 11. Global Exception Handler

`API/Middleware/GlobalExceptionHandler.cs`:
```csharp
public class GlobalExceptionHandler
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandler> _logger;
    
    public GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred");
            await HandleExceptionAsync(context, ex);
        }
    }
    
    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, response) = exception switch
        {
            NotFoundException => (404, new { success = false, message = exception.Message }),
            ValidationException ve => (400, new { success = false, errors = ve.Errors }),
            _ => (500, new { success = false, message = "Internal server error" })
        };
        
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        
        return context.Response.WriteAsJsonAsync(response);
    }
}

// Register in Program.cs
app.UseMiddleware<GlobalExceptionHandler>();
```

## 🎯 Next Steps

1. Run migration to update database schema:
```bash
dotnet ef migrations add UpdateBaseEntity
dotnet ef database update
```

2. Test the API endpoints
3. Update frontend to use new API structure

## 📊 SOLID Compliance After Refactor

✅ **SRP**: Controllers thin, logic in handlers, repositories for data access
✅ **OCP**: Extensible via interfaces, CQRS commands/queries
✅ **LSP**: Proper inheritance with BaseEntity
✅ **ISP**: Focused interfaces (IPostRepository, etc.)
✅ **DIP**: Dependency Injection throughout
