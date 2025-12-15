using backend.Domain.Common;

namespace backend.Domain.Entities;

public class Notification : BaseEntity
{
    public int UserId { get; set; }
    public string Message { get; set; } = String.Empty;
    public bool IsRead { get; set; }
    public string Type { get; set; } = String.Empty;
    public int? PostId { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateUpdated { get; set; }
}
