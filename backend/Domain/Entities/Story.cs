using backend.Domain.Common;

namespace backend.Domain.Entities;

public class Story : BaseEntity
{
    public int Id { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsDeleted { get; set; }
    public int UserId { get; set; }

    public User User { get; set; } = new User();
}
