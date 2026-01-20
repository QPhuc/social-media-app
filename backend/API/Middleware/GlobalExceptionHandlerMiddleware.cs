using System.Net;
using System.Text.Json;
using backend.Application.Common.DTOs;
using backend.Domain.Common;

namespace backend.API.Middleware;

public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionHandlerMiddleware> logger)
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
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "An error occurred: {Message}", exception.Message);

        var response = context.Response;
        response.ContentType = "application/json";

        var apiResponse = exception switch
        {
            NotFoundException notFoundEx => new
            {
                StatusCode = HttpStatusCode.NotFound,
                Response = ApiResponse<object>.FailureResponse(notFoundEx.Message)
            },
            ValidationException validationEx => new
            {
                StatusCode = HttpStatusCode.BadRequest,
                Response = ApiResponse<object>.FailureResponse("Validation failed.", validationEx.Errors)
            },
            BadRequestException badRequestEx => new
            {
                StatusCode = HttpStatusCode.BadRequest,
                Response = ApiResponse<object>.FailureResponse(badRequestEx.Message)
            },
            DomainException domainEx => new
            {
                StatusCode = HttpStatusCode.BadRequest,
                Response = ApiResponse<object>.FailureResponse(domainEx.Message)
            },
            _ => new
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Response = ApiResponse<object>.FailureResponse("An internal server error occurred.")
            }
        };

        response.StatusCode = (int)apiResponse.StatusCode;

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var jsonResponse = JsonSerializer.Serialize(apiResponse.Response, options);
        await response.WriteAsync(jsonResponse);
    }
}
