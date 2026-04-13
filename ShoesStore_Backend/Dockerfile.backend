# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy toàn bộ source code vào container
COPY . .

# Chuyển thư mục làm việc vào thư mục chứa project API chính
WORKDIR /src/API

# Chạy lệnh publish trực tiếp trên project API
# (Lệnh publish sẽ tự động chạy restore các project liên quan như Application, Domain...)
RUN dotnet publish "API.csproj" -c Release -o /app/publish

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Chạy file dll của project API
ENTRYPOINT ["dotnet", "API.dll"]