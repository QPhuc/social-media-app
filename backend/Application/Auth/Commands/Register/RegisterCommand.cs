using backend.Application.Auth.DTOs;
using MediatR;

namespace backend.Application.Auth.Commands.Register;

public class RegisterCommand : IRequest<AuthResponseDto>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? UserName { get; set; }
}
