using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configurations;

public class RoleClaimConfiguration : IEntityTypeConfiguration<IdentityRoleClaim<int>>
{
    public void Configure(EntityTypeBuilder<IdentityRoleClaim<int>> builder)
    {
        builder.ToTable("RoleClaims");
    }
}
