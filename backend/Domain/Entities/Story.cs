using backend.Domain.Common;

namespace backend.Domain.Entities;

public class Story : BaseEntity
{
    public string? ImageUrl { get; set; }
    public DateTime DateCreated { get; set; }
    public bool IsDeleted { get; set; }
    public int UserId { get; set; }

    public User User { get; set; } = new User();
}
