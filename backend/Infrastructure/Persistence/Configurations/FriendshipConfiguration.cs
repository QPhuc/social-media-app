using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Infrastructure.Persistence.Configurations;

public class FriendshipConfiguration : IEntityTypeConfiguration<Friendship>
{
    public void Configure(EntityTypeBuilder<Friendship> builder)
    {
        builder.ToTable("Friendships");
        
        builder.HasOne(fr => fr.Sender)
            .WithMany()
            .HasForeignKey(fr => fr.SenderId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(fr => fr.Receiver)
            .WithMany()
            .HasForeignKey(fr => fr.ReceiverId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
