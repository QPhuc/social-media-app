using backend.Application.Auth.Commands.Login;
using backend.Application.Auth.Commands.RefreshToken;
using backend.Application.Auth.Commands.Register;
using backend.Application.Auth.DTOs;
using backend.Application.Common.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace backend.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register([FromBody] RegisterDto dto)
    {
        var command = new RegisterCommand
        {
            Email = dto.Email,
            Password = dto.Password,
            FullName = dto.FullName,
            UserName = dto.UserName
        };

        var result = await _mediator.Send(command);

        // Set refresh token in HTTP-only cookie
        SetRefreshTokenCookie(result.RefreshToken);

        return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Registration successful."));
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginDto dto)
    {
        var command = new LoginCommand
        {
            Email = dto.Email,
            Password = dto.Password
        };

        var result = await _mediator.Send(command);

        // Set refresh token in HTTP-only cookie
        SetRefreshTokenCookie(result.RefreshToken);

        return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Login successful."));
    }

    /// <summary>
    /// Refresh access token using refresh token from cookie
    /// </summary>
    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        
        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized(ApiResponse<AuthResponseDto>.FailureResponse("Refresh token not found."));

        var command = new RefreshTokenCommand
        {
            RefreshToken = refreshToken
        };

        var result = await _mediator.Send(command);

        // Set new refresh token in HTTP-only cookie
        SetRefreshTokenCookie(result.RefreshToken);

        return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Token refreshed successfully."));
    }

    /// <summary>
    /// Logout - clear refresh token cookie
    /// </summary>
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("refreshToken");
        return Ok(ApiResponse<object>.SuccessResponse(new { }, "Logout successful."));
    }

    #region Private Methods
    private void SetRefreshTokenCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }
    #endregion
}
