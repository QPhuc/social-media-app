using backend.Domain.Common;

namespace backend.Domain.Entities;

public class Favorite : BaseEntity
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public int UserId { get; set; }

    public Post Post { get; set; } = new Post();
    public User User { get; set; } = new User();
}
