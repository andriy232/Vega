FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
WORKDIR /src
COPY ["Vega.csproj", "vega/"]
RUN dotnet restore "vega/Vega.csproj"
WORKDIR /src/vega/
COPY . .
RUN dotnet build "Vega.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Vega.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Vega.dll"]