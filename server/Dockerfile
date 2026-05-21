# Stage 1: Build & Restore
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy CSPROJ and restore dependencies
COPY ["VTCLBD.API/VTCLBD.API.csproj", "VTCLBD.API/"]
RUN dotnet restore "VTCLBD.API/VTCLBD.API.csproj"

# Copy the entire source tree and build in Release mode
COPY . .
WORKDIR "/src/VTCLBD.API"
RUN dotnet build "VTCLBD.API.csproj" -c Release -o /app/build

# Publish output files
FROM build AS publish
RUN dotnet publish "VTCLBD.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Clean Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port and configure environment URLs
ENV ASPNETCORE_URLS=http://+:5237
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 5237

ENTRYPOINT ["dotnet", "VTCLBD.API.dll"]
