using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configurations;

public class UserClaimConfiguration : IEntityTypeConfiguration<IdentityUserClaim<int>>
{
    public void Configure(EntityTypeBuilder<IdentityUserClaim<int>> builder)
    {
        builder.ToTable("UserClaims");
    }
}
