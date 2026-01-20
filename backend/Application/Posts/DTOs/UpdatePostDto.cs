namespace backend.Application.Posts.DTOs;

public class UpdatePostDto
{
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public bool? IsPrivate { get; set; }
}
