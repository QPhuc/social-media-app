using backend.Domain.Common;
using Microsoft.AspNetCore.Identity;

namespace backend.Domain.Entities;

public class User : IdentityUser<int>
{
    public string FullName { get; set; } = String.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? Bio { get; set; }
    public bool IsDeleted { get; set; }
    public string CreatedBy { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<Story> Stories { get; set; } = new List<Story>();
    public ICollection<Like> Likes { get; set; } = new List<Like>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<Report> Reports { get; set; } = new List<Report>();
}