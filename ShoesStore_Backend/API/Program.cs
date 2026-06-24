using API.Extensions;
using Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApiServices(builder.Configuration)
    .AddInfrastructure(builder.Configuration);

var app = builder.Build();

await app.Services.InitialiseInfrastructureAsync();

app.UseApiPipeline();

app.Run();
