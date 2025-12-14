using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configurations;

public class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.ToTable("Comments");

        builder.HasOne(l => l.Post)
            .WithMany(p => p.Comments)
            .HasForeignKey(l => l.PostId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(l => l.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
