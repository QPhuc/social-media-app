using backend.Application.Common.DTOs;
using backend.Application.Posts.Commands.CreatePost;
using backend.Application.Posts.Commands.DeletePost;
using backend.Application.Posts.Commands.UpdatePost;
using backend.Application.Posts.DTOs;
using backend.Application.Posts.Queries.GetPostById;
using backend.Application.Posts.Queries.GetPosts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.API.Controllers;

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

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    /// <summary>
    /// Get paginated list of posts
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<PostDto>>>> GetPosts(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? userId = null,
        [FromQuery] bool includePrivate = false)
    {
        var query = new GetPostsQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            UserId = userId,
            IncludePrivate = includePrivate
        };

        var result = await _mediator.Send(query);
        return Ok(ApiResponse<PaginatedResponse<PostDto>>.SuccessResponse(result));
    }

    /// <summary>
    /// Get a specific post by ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PostDto>>> GetPostById(int id)
    {
        var query = new GetPostByIdQuery
        {
            PostId = id,
            RequestingUserId = User.Identity?.IsAuthenticated == true ? GetCurrentUserId() : null
        };

        var result = await _mediator.Send(query);
        return Ok(ApiResponse<PostDto>.SuccessResponse(result));
    }

    /// <summary>
    /// Create a new post
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<PostDto>>> CreatePost([FromBody] CreatePostDto dto)
    {
        var command = new CreatePostCommand
        {
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            IsPrivate = dto.IsPrivate,
            UserId = GetCurrentUserId()
        };

        var result = await _mediator.Send(command);
        return CreatedAtAction(
            nameof(GetPostById),
            new { id = result.Id },
            ApiResponse<PostDto>.SuccessResponse(result, "Post created successfully.")
        );
    }

    /// <summary>
    /// Update an existing post
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<PostDto>>> UpdatePost(int id, [FromBody] UpdatePostDto dto)
    {
        var command = new UpdatePostCommand
        {
            PostId = id,
            UserId = GetCurrentUserId(),
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            IsPrivate = dto.IsPrivate
        };

        var result = await _mediator.Send(command);
        return Ok(ApiResponse<PostDto>.SuccessResponse(result, "Post updated successfully."));
    }

    /// <summary>
    /// Delete a post
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeletePost(int id)
    {
        var command = new DeletePostCommand
        {
            PostId = id,
            UserId = GetCurrentUserId()
        };

        await _mediator.Send(command);
        return Ok(ApiResponse<object>.SuccessResponse(new { }, "Post deleted successfully."));
    }
}
