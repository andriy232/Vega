using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Sentry;
using System;
using Microsoft.AspNetCore.Http.Extensions;
using vega.Core;
using vega.Persistance;
using Vega.Core.Models;
using vega.Controllers;

namespace vega
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAutoMapper(typeof(Startup));

            services.Configure<PhotoSettings>(Configuration.GetSection("PhotoSettings"));

            var connectionString = Configuration.GetConnectionString("Default");
            services.AddDbContext<VegaDbContext>(options => options.UseSqlServer(connectionString));

            services.AddScoped<IVehicleRepository, VehicleRepository>();
            services.AddScoped<IPhotoRepository, PhotoRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Authority = Configuration["Auth0:Domain"];
                options.Audience = Configuration["Auth0:Audience"];
            });

            services.AddAuthorization(options =>
                {
                    options.AddPolicy(Policies.RequireAdminRole, policy =>
                        policy.RequireClaim("https://vega.com/roles", "Admin"));
                });

            services.AddControllers().AddNewtonsoftJson();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            if (!env.IsDevelopment())
                app.UseSpaStaticFiles();

            // order is important, so 1.
            app.UseRouting();

            // 2. authentication and authorization
            app.UseAuthentication();

            // 2.1 !!! extreme attention to order !!!
            app.UseAuthorization();

            // 3. UseEndpoint
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            // An example ASP.NET Core middleware that throws an
            // exception when serving a request to path: /throw
            app.Use(async (context, next) =>
            {
                var log = context.RequestServices.GetService<ILoggerFactory>()
                    .CreateLogger<Startup>();

                var hub = context.RequestServices.GetService<IHub>();
                hub.ConfigureScope(s =>
                {
                    // More data can be added to the scope like this:
                    s.SetTag("Sample", "ASP.NET Core"); // indexed by Sentry
                    s.SetExtra("Extra!", "Some extra information");
                });

                var displayUrl = context.Request.GetDisplayUrl();
                if (!displayUrl.EndsWith(".js") && !displayUrl.EndsWith(".map"))
                    log.LogInformation($"Processing request: {context.Request.Method}, {displayUrl}");

                if (context.Request.Path == "/throw")
                {
                    // The following exception will be captured by the SDK and the event
                    // will include the Log messages and any custom scope modifications
                    // as exemplified above.
                    throw new Exception("An exception thrown from the ASP.NET Core pipeline");
                }

                await next();
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}