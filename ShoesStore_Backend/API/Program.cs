using API.Extensions;
using Infrastructure;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();

builder.Services.AddSerilog((services, loggerConfiguration) =>
{
    loggerConfiguration
        .ReadFrom.Configuration(builder.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext();
});

builder.Services
    .AddApiServices(builder.Configuration)
    .AddInfrastructure(builder.Configuration);

var app = builder.Build();

await app.Services.InitialiseInfrastructureAsync();

app.UseApiPipeline();

app.Run();
