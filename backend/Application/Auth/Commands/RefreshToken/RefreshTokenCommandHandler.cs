using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Application.Auth.DTOs;
using backend.Domain.Common;
using backend.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace backend.Application.Auth.Commands.RefreshToken;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponseDto>
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _config;

    public RefreshTokenCommandHandler(UserManager<User> userManager, IConfiguration config)
    {
        _userManager = userManager;
        _config = config;
    }

    public async Task<AuthResponseDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // TODO: Validate refresh token from database
        // For now, we'll just generate new tokens
        // In a real application, you would:
        // 1. Validate the refresh token exists in database
        // 2. Check if it's expired
        // 3. Get the user ID from the stored token
        // 4. Generate new access token
        // 5. Optionally rotate the refresh token

        // Placeholder: This is a simplified version
        // You should implement proper refresh token storage and validation
        throw new BadRequestException("Refresh token functionality requires database implementation. Please implement refresh token storage.");

        // Uncomment and implement when refresh token storage is ready:
        /*
        var storedToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken);
        
        if (storedToken == null || storedToken.ExpiresAt < DateTime.UtcNow)
            throw new BadRequestException("Invalid or expired refresh token.");

        var user = await _userManager.FindByIdAsync(storedToken.UserId.ToString());
        
        if (user == null || user.IsDeleted)
            throw new BadRequestException("User not found.");

        var accessToken = GenerateAccessToken(user);
        var newRefreshToken = GenerateRefreshToken();

        // Update refresh token in database
        await _refreshTokenRepository.UpdateTokenAsync(storedToken.Id, newRefreshToken);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            User = new UserInfoDto
            {
                Id = user.Id,
                Email = user.Email!,
                UserName = user.UserName!,
                FullName = user.FullName,
                ProfilePictureUrl = user.ProfilePictureUrl
            }
        };
        */
    }

    private string GenerateAccessToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Name, user.UserName!)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
        );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }
}
