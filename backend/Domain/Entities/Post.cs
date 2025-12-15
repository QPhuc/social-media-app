using backend.Domain.Common;

namespace backend.Domain.Entities;

public class Post : BaseEntity
{
    public string Content { get; set; } = String.Empty;
    public string? ImageUrl { get; set; }
    public int NrOfReports { get; set; }
    public bool IsPrivate { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateUpdated { get; set; }
    public int UserId { get; set; }

    public User User { get; set; } = new User();
    public ICollection<Like> Likes { get; set; } = new List<Like>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<Report> Reports { get; set; } = new List<Report>();
}
