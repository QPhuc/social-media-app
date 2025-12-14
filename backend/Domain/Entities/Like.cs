using backend.Domain.Common;

namespace backend.Domain.Entities;

public class Like : BaseEntity
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public int UserId { get; set; }

    public Post Post { get; set; } = new Post();
    public User User { get; set; } = new User();
}
