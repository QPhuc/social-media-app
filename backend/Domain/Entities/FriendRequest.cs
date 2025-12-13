using backend.Domain.Common;

namespace backend.Domain.Entities;

public class FriendRequest : BaseEntity
{
    public int Id { get; set; }
    public string Status { get; set; } = String.Empty;
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }

    public User Sender { get; set; } = new User();
    public User Receiver { get; set; } = new User();
}
