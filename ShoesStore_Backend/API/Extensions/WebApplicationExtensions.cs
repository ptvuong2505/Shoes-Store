using API.Hubs;
using API.Middleware;
using Serilog;
using Serilog.Events;
using System.Security.Claims;

namespace API.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UseApiPipeline(this WebApplication app)
    {
        app.UseSerilogRequestLogging(options =>
        {
            options.MessageTemplate = "Request {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";

            options.GetLevel = (
                httpContext,
                elapsed,
                exception) =>
            {
                if (exception != null
                    || httpContext.Response.StatusCode >= StatusCodes.Status500InternalServerError)
                {
                    return LogEventLevel.Error;
                }

                return httpContext.Response.StatusCode >= StatusCodes.Status400BadRequest
                    ? LogEventLevel.Warning
                    : LogEventLevel.Information;
            };

            options.EnrichDiagnosticContext = (
                diagnosticContext,
                httpContext) =>
            {
                diagnosticContext.Set(
                    "UserId",
                    httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? "anonymous");
                diagnosticContext.Set(
                    "TraceId",
                    httpContext.TraceIdentifier);
            };
        });

        app.UseMiddleware<GlobalExceptionMiddleware>();

        app.UseCors(ApiServiceExtensions.CorsPolicyName);

        if (app.Environment.IsDevelopment())
        {
            app.UseHttpsRedirection();
        }

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.MapHub<ChatHub>("/hubs/chat");

        return app;
    }
}
