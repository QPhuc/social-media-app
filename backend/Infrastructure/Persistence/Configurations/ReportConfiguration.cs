
using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configurations;

public class ReportConfiguration : IEntityTypeConfiguration<Report>
{
    public void Configure(EntityTypeBuilder<Report> builder)
    {
        builder.ToTable("Reports");

        builder.HasKey(f => new { f.PostId, f.UserId });

        builder.HasOne(f => f.Post)
            .WithMany(p => p.Reports)
            .HasForeignKey(f => f.PostId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(f => f.User)
            .WithMany(u => u.Reports)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
