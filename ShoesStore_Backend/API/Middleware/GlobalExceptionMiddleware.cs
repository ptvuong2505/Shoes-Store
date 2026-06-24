using System.Security.Claims;
using Application.Common.Errors;
using Application.Common.Exceptions;
using Application.Common.Responses;

namespace API.Middleware;

public sealed class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger)
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
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
            _logger.LogInformation(
                "Request was cancelled by the client. {Method} {Path}, TraceId: {TraceId}",
                context.Request.Method,
                context.Request.Path,
                context.TraceIdentifier);
        }
        catch (Exception exception)
        {
            if (context.Response.HasStarted)
            {
                throw;
            }

            await HandleExceptionAsync(context, exception);
        }
    }

    private async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception)
    {
        var descriptor = MapException(exception);
        LogException(context, exception, descriptor);

        context.Response.Clear();
        context.Response.StatusCode = descriptor.StatusCode;

        var response = ApiResponse<object?>.Fail(
            descriptor.StatusCode,
            descriptor.ErrorCode,
            descriptor.Message,
            descriptor.Details);

        await context.Response.WriteAsJsonAsync(response);
    }

    private static ExceptionDescriptor MapException(Exception exception)
    {
        return exception switch
        {
            RequestValidationException validationException => new ExceptionDescriptor(
                StatusCodes.Status400BadRequest,
                validationException.ErrorCode,
                validationException.Message,
                validationException.Errors),

            UnauthorizedException unauthorizedException => new ExceptionDescriptor(
                StatusCodes.Status401Unauthorized,
                unauthorizedException.ErrorCode,
                unauthorizedException.Message),

            ForbiddenException forbiddenException => new ExceptionDescriptor(
                StatusCodes.Status403Forbidden,
                forbiddenException.ErrorCode,
                forbiddenException.Message),

            NotFoundException notFoundException => new ExceptionDescriptor(
                StatusCodes.Status404NotFound,
                notFoundException.ErrorCode,
                notFoundException.Message),

            ConflictException conflictException => new ExceptionDescriptor(
                StatusCodes.Status409Conflict,
                conflictException.ErrorCode,
                conflictException.Message),

            BusinessRuleException businessRuleException => new ExceptionDescriptor(
                StatusCodes.Status422UnprocessableEntity,
                businessRuleException.ErrorCode,
                businessRuleException.Message),

            _ => new ExceptionDescriptor(
                StatusCodes.Status500InternalServerError,
                ErrorCodes.InternalServerError,
                "An unexpected error occurred.")
        };
    }

    private void LogException(
        HttpContext context,
        Exception exception,
        ExceptionDescriptor descriptor)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (descriptor.StatusCode >= StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(
                exception,
                "Unhandled exception for {Method} {Path}. UserId: {UserId}, TraceId: {TraceId}",
                context.Request.Method,
                context.Request.Path,
                userId,
                context.TraceIdentifier);

            return;
        }

        _logger.LogWarning(
            "Request failed {Method} {Path} with {StatusCode} {ErrorCode}. UserId: {UserId}, TraceId: {TraceId}",
            context.Request.Method,
            context.Request.Path,
            descriptor.StatusCode,
            descriptor.ErrorCode,
            userId,
            context.TraceIdentifier);
    }

    private sealed record ExceptionDescriptor(
        int StatusCode,
        string ErrorCode,
        string Message,
        IDictionary<string, string[]>? Details = null);
}
