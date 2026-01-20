using System;
using System.Reflection;
using backend.Application.Common.Interfaces;
using backend.Domain.Entities;
using backend.Infrastructure.Persistence;
using backend.Infrastructure.Persistence.DbContext;
using FluentValidation;
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
        
        // MediatR
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(Application.Posts.Commands.CreatePost.CreatePostCommand).Assembly);
            // Add ValidationBehavior to pipeline
            cfg.AddOpenBehavior(typeof(Application.Common.Behaviors.ValidationBehavior<,>));
        });
        
        // FluentValidation
        services.AddValidatorsFromAssembly(typeof(Application.Posts.Commands.CreatePost.CreatePostCommand).Assembly);
        
        // AutoMapper
        services.AddAutoMapper(typeof(Application.Posts.Mappings.PostMappingProfile).Assembly);
        
        // Services

        // Repositories

        return services;
    }
}
