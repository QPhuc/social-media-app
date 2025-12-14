
using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configurations;

public class FavoriteConfiguration : IEntityTypeConfiguration<Favorite>
{
    public void Configure(EntityTypeBuilder<Favorite> builder)
    {
        builder.ToTable("Favorites");
        builder.HasKey(f => new { f.PostId, f.UserId });

        builder.HasOne(f => f.Post)
            .WithMany(p => p.Favorites)
            .HasForeignKey(f => f.PostId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
