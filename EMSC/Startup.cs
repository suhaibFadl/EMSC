using DinkToPdf;
using DinkToPdf.Contracts;
using EMSC.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Data.SqlClient;
using System.IO;
using System.Text;

namespace EMSC
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
            services.AddControllersWithViews();
            services.AddSingleton<IHttpContextAccessor , HttpContextAccessor>();

            services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));

            services.AddTransient<ReportsCreator.TemplateGeneratorMedicationsReports>();

          //  In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist/ClientApp";
            });


            services.AddControllers().AddNewtonsoftJson();

            //////////Adding Cors

            //{
            //    options.AddPolicy("", builder =>
            //    {
            //        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().AllowCredentials().Build();
            //    });
            //});
            services.AddCors();

            ///connecting to database

            services.AddDbContext<EMSCDBContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefultConnction")));

            SqlConnection connection = new SqlConnection("Server=.;Database=EMSCDB;Trusted_Connection=True;");
           
            SqlCommand command = new SqlCommand("",connection);

            // Set the command timeout value for the command object
            command.CommandTimeout = 300;
            //  services.AddDbContext<EMSCDBContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefultConnction"), b => b.MigrationsAssembly("Backups")));

            services.AddControllers();

           // services.AddScoped<IService, Service>();


            //specifiying we are going to use Identity framework

            //*************************************************************************
            services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 4;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;

                options.User.RequireUniqueEmail = true;

                //options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                //options.Lockout.MaxFailedAccessAttempts = 5;
                //options.Lockout.AllowedForNewUsers = true;

            }).AddEntityFrameworkStores<EMSCDBContext>().AddDefaultTokenProviders();

            //*************************************************************************


            //configure strongly typed settings objects

            var AppSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<Helpers.AppSettings>(AppSettingsSection);

            var AppSettings = AppSettingsSection.Get<Helpers.AppSettings>();

            var Key = Encoding.ASCII.GetBytes(AppSettings.Secret); // incoding key to be hashed


            //adding authentication middleware
            services.AddAuthentication(O =>
            {
                O.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                O.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                O.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = AppSettings.Site,
                    ValidAudience = AppSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Key)

                };
            });

           // middleware for authorization
            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireLoggedIn", Policy => Policy.RequireRole("Admin", "الإدارة", "موظف إدخال البيانات الرئيسية",
                    "موظف إدخال بيانات جرحى ورسائل إحالة", "مسؤول التسفير","مدير الفرع",
                    "موظف إدخال الفرع","مدير المصحة","موظف إدخال المصحة",
                    "مشرف عام","مشرف إداري","مشرف طبي","مشرف تسكين", "لجنة الحصر").RequireAuthenticatedUser());

                options.AddPolicy("RequireManagementRole", Policy => Policy.RequireRole("Admin", "الإدارة", "الشؤون الطبية بالمركز").RequireAuthenticatedUser());

                options.AddPolicy("RequireEmployeeManagementRole", Policy => Policy.RequireRole("الإدارة", "موظف إدخال البيانات الرئيسية",
                    "موظف إدخال بيانات جرحى ورسائل إحالة", "مسؤول التسفير","مندوب المصحة").RequireAuthenticatedUser());

                options.AddPolicy("RequireBranchManagerRole", Policy => Policy.RequireRole("الإدارة", "مدير الفرع").RequireAuthenticatedUser());

                options.AddPolicy("RequireBranchEmployeeRole", Policy => Policy.RequireRole("الإدارة", "مدير الفرع", "موظف إدخال الفرع").RequireAuthenticatedUser());

                options.AddPolicy("RequireHospitalManagerRole", Policy => Policy.RequireRole("الإدارة", "مدير المصحة").RequireAuthenticatedUser());

                options.AddPolicy("RequireHospitalEmployeeRole", Policy => Policy.RequireRole("الإدارة", "مدير المصحة", "موظف إدخال المصحة").RequireAuthenticatedUser());

                options.AddPolicy("RequireGeneralSupervisorRole", Policy => Policy.RequireRole("Admin", "مشرف عام").RequireAuthenticatedUser());

                options.AddPolicy("RequireAdministrativeSupervisorRole", Policy => Policy.RequireRole("Admin", "مشرف إداري", "لجنة الحصر").RequireAuthenticatedUser());

                options.AddPolicy("RequireMedicalSupervisorRole", Policy => Policy.RequireRole("Admin", "مشرف طبي", "لجنة الحصر").RequireAuthenticatedUser());

                options.AddPolicy("RequireHousingSupervisorRole", Policy => Policy.RequireRole("Admin", "مشرف تسكين" , "مشرف إداري", "لجنة الحصر").RequireAuthenticatedUser());
              
                options.AddPolicy("RequireAddPMainDataAndLettersRole", Policy => Policy.RequireRole("Admin", "الإدارة", "موظف إدخال بيانات جرحى ورسائل إحالة", "مدير الفرع", "موظف إدخال الفرع", "مشرف إداري","لجنة الحصر").RequireAuthenticatedUser());
              
                options.AddPolicy("RequireAddTravelingRole", Policy => Policy.RequireRole("Admin", "الإدارة", "مسؤول التسفير","مشرف تسكين" , "مشرف إداري", "لجنة الحصر","موظف إدخال الفرع","مدير الفرع").RequireAuthenticatedUser());
            });


            //============maze code
            services.Configure<FormOptions>(o =>
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });

            //========================
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



                /////enable cors
                app.UseCors(
                    builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());


                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseStaticFiles();

            //app.UseStaticFiles(new StaticFileOptions()
            //{
            //    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
            //    RequestPath = new PathString("/Resources")
            //});



            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp/dist/ClientApp";

                if (env.IsDevelopment())
                {
                    spa.Options.StartupTimeout = new TimeSpan(0, 9, 80);
                    spa.UseAngularCliServer(npmScript: "start");
                }

            });
        }

    }
}
