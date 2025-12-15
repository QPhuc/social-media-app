using backend.Domain.Common;

namespace backend.Domain.Entities;

public class Comment : BaseEntity
{
    public string Content { get; set; } = string.Empty;
    public DateTime DateCreated { get; set; }
    public DateTime DateUpdated { get; set; }
    public int PostId { get; set; }
    public int UserId { get; set; }

    public Post Post { get; set; } = new Post();
    public User User { get; set; } = new User();
}
