using backend.Domain.Common;

namespace backend.Domain.Entities;

public class Friendship : BaseEntity
{
    public DateTime DateCreated { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }

    public virtual User Sender { get; set; } = new User();
    public virtual User Receiver { get; set; } = new User();
}
