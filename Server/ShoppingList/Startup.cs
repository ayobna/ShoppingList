
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
        //public void iteratexx (string searchInDirectory) { 
        
        //    var directories = Directory.GetDirectories(searchInDirectory);
        //    foreach (var directory in directories)
        //    {
        //        var files = Directory.GetFiles(directory);
        //        iteratexx(directory);
        //    }
        //}

        public Startup(IConfiguration configuration)
        {
            //iteratexx(@"c:\");
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSwaggerGen();
            services.AddSignalR();
            services.Add(new ServiceDescriptor(typeof(IDbConnection), new DbConnection()));
            services.AddSingleton<IShoppingList, ShoppingListData>();
            services.AddSingleton<IChatData, ChatData>();

            services.AddSingleton<IProductData, ProductData>();
            services.AddSingleton<IUser, UserData>();
            //       services.Add(new ServiceDescriptor(typeof(IUser), new User()));
            //     services.Add(new ServiceDescriptor(typeof(IShoppingList), new Shoppinglist()));

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                builder => builder
                .AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed(_ => true)
                .AllowCredentials()
                );
            });

            

            

            services.AddSingleton<IDictionary<string, UserConnection>>(opts => new Dictionary<string, UserConnection>());
            services.AddControllersWithViews();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
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
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChatHub>("/chat");
            });

        }
    }
}
