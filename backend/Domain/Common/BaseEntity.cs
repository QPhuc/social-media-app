namespace backend.Domain.Common;

public class BaseEntity
{
    public string CreatedBy { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
