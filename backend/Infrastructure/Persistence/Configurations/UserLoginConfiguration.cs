using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configurations;

public class UserLoginConfiguration : IEntityTypeConfiguration<IdentityUserLogin<int>>
{
    public void Configure(EntityTypeBuilder<IdentityUserLogin<int>> builder)
    {
        builder.ToTable("UserLogins");
    }
}
