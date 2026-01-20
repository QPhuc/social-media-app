using backend.Application.Auth.DTOs;
using MediatR;

namespace backend.Application.Auth.Commands.RefreshToken;

public class RefreshTokenCommand : IRequest<AuthResponseDto>
{
    public string RefreshToken { get; set; } = string.Empty;
}
