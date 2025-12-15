using System;
using backend.Application.Common.Interfaces;
using backend.Domain.Entities;
using backend.Infrastructure.Persistence;
using backend.Infrastructure.Persistence.DbContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.API;

public static class ModuleRegistration
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Identity
        services.AddIdentity<User, IdentityRole<int>>(options =>
        {
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
        })
        .AddEntityFrameworkStores<AppDbContext>() // ⭐ QUAN TRỌNG
        .AddDefaultTokenProviders();
        
        // Unit Of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        // Services

        // Repositories

        return services;
    }
}
