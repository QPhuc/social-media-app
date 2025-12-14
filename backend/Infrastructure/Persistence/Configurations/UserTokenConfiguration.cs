
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configurations;

public class UserTokenConfiguration : IEntityTypeConfiguration<IdentityUserToken<int>>
{
    public void Configure(EntityTypeBuilder<IdentityUserToken<int>> builder)
    {
        builder.ToTable("UserTokens");
    }
}
