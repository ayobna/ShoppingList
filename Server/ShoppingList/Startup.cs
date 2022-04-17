
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ShoppingList.Data;
using ShoppingList.Hubs;
using ShoppingList.Models;
using ShoppingList.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingList
{
    public class Startup
    {


        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSwaggerGen();
            services.AddSignalR()
            .AddAzureSignalR(Configuration["connectionStringAzureSignalR"]);

            services.Add(new ServiceDescriptor(typeof(IDbConnection), new DbConnection(Configuration["connectionStringSqlAzure"])));
            services.AddSingleton<IShoppingList, ShoppingListData>();
            services.AddSingleton<IChatData, ChatData>();
            services.AddSingleton<IProductData, ProductData>();
            services.AddSingleton<IUser, UserData>();
            services.AddSingleton<IRequestsData, RequestsData>();
            services.AddSingleton<ILoginData, LoginData>();
            services.AddSingleton<IListUsers, ListUsersData>();
            services.Add(new ServiceDescriptor(typeof(IMailVerification), new MailVerification(Configuration["SendEmailApiKey"])));

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                builder => builder.AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed(_ => true)
                .AllowCredentials()
                );

                options.AddPolicy("AnotherPolicy",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:3000")
                                            .AllowAnyHeader()
                                            .AllowAnyMethod();
                    });
            });
            services.AddSingleton<IDictionary<string, UserConnection>>(opts => new Dictionary<string, UserConnection>());
            services.AddControllersWithViews();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseStaticFiles();
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                c.RoutePrefix = string.Empty;
            });
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseRouting();
            app.UseCors();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
            app.UseAzureSignalR(endpoints =>
            {
                endpoints.MapHub<ChatHub>("/chat");
            });
            app.UseAzureSignalR(endpoints =>
            {
                endpoints.MapHub<ListProductsHub>("/Products");
            });

        }
    }
}
