namespace backend.Application.Posts.DTOs;

public class CreatePostDto
{
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public bool IsPrivate { get; set; } = false;
}
