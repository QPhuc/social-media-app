using System;
using backend.Application.Common.Interfaces;
using backend.Infrastructure.Persistence;
using backend.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace backend.API;

public static class ModuleRegistration
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Unit Of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Services

        // Repositories

        return services;
    }
}
