using System.Text.Json;
using API.Middleware;
using Application.Common.Errors;
using Application.Common.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace API.Tests.Middleware;

public class GlobalExceptionMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_ReturnsNotFoundResponse_ForNotFoundException()
    {
        var exception = new NotFoundException(
            ErrorCodes.OrderNotFound,
            "Order not found.");

        var context = CreateContext();
        var middleware = CreateMiddleware(exception);

        await middleware.InvokeAsync(context);

        var response = await ReadResponseAsync(context);
        Assert.Equal(StatusCodes.Status404NotFound, context.Response.StatusCode);
        Assert.False(response.GetProperty("success").GetBoolean());
        Assert.Equal(
            ErrorCodes.OrderNotFound,
            response.GetProperty("error").GetProperty("code").GetString());
        Assert.Equal("Order not found.", response.GetProperty("message").GetString());
    }

    [Fact]
    public async Task InvokeAsync_ReturnsValidationDetails_ForRequestValidationException()
    {
        Dictionary<string, string[]> errors = new()
        {
            ["quantity"] = ["Quantity must be greater than 0."]
        };

        var context = CreateContext();
        var middleware = CreateMiddleware(new RequestValidationException(errors));

        await middleware.InvokeAsync(context);

        var response = await ReadResponseAsync(context);
        Assert.Equal(StatusCodes.Status400BadRequest, context.Response.StatusCode);
        Assert.Equal(
            ErrorCodes.ValidationError,
            response.GetProperty("error").GetProperty("code").GetString());
        Assert.Equal(
            errors["quantity"],
            response.GetProperty("error")
                .GetProperty("details")
                .GetProperty("quantity")
                .EnumerateArray()
                .Select(item => item.GetString())
                .ToArray());
    }

    [Fact]
    public async Task InvokeAsync_HidesExceptionMessage_ForUnhandledException()
    {
        var context = CreateContext();
        var middleware = CreateMiddleware(new InvalidOperationException("Database password leaked."));

        await middleware.InvokeAsync(context);

        var response = await ReadResponseAsync(context);
        Assert.Equal(StatusCodes.Status500InternalServerError, context.Response.StatusCode);
        Assert.Equal(
            ErrorCodes.InternalServerError,
            response.GetProperty("error").GetProperty("code").GetString());
        Assert.Equal(
            "An unexpected error occurred.",
            response.GetProperty("message").GetString());
        Assert.DoesNotContain(
            "Database password",
            response.GetProperty("message").GetString());
    }

    private static GlobalExceptionMiddleware CreateMiddleware(Exception exception)
    {
        RequestDelegate next = _ => Task.FromException(exception);
        return new GlobalExceptionMiddleware(
            next,
            NullLogger<GlobalExceptionMiddleware>.Instance);
    }

    private static DefaultHttpContext CreateContext()
    {
        return new DefaultHttpContext
        {
            Response =
            {
                Body = new MemoryStream()
            }
        };
    }

    private static async Task<JsonElement> ReadResponseAsync(HttpContext context)
    {
        context.Response.Body.Position = 0;

        using var document = await JsonDocument.ParseAsync(context.Response.Body);

        return document.RootElement.Clone();
    }
}
