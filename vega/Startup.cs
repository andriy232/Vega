using System;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Sentry;
using vega.Core;
using Vega.Core.Models;
using vega.Persistance;

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

            services.AddControllersWithViews().AddNewtonsoftJson();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
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
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

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

                if (context.Request.Path == "/throw")
                {
                    var hub = context.RequestServices.GetService<IHub>();
                    hub.ConfigureScope(s =>
                    {
                        // More data can be added to the scope like this:
                        s.SetTag("Sample", "ASP.NET Core"); // indexed by Sentry
                        s.SetExtra("Extra!", "Some extra information");
                    });

                    log.LogInformation("Logging info...");
                    log.LogWarning("Logging some warning!");

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
