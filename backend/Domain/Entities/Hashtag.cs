using backend.Domain.Common;

namespace backend.Domain.Entities;

public class Hashtag : BaseEntity
{
    public string Name { get; set; } = string.Empty; // #travel, #food, ...
    public int Count { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateUpdated { get; set; }
}
