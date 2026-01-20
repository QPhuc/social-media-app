namespace backend.Application.Posts.DTOs;

public class PostDto
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public bool IsPrivate { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateUpdated { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? UserAvatar { get; set; }
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
}
