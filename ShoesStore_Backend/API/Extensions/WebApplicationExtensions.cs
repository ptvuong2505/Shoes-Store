using API.Hubs;
using API.Middleware;

namespace API.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UseApiPipeline(this WebApplication app)
    {
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
