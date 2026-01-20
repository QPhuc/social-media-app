using FluentValidation;

namespace backend.Application.Posts.Commands.UpdatePost;

public class UpdatePostCommandValidator : AbstractValidator<UpdatePostCommand>
{
    public UpdatePostCommandValidator()
    {
        RuleFor(x => x.PostId)
            .GreaterThan(0).WithMessage("Post ID must be greater than 0.");

        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("User ID must be greater than 0.");

        RuleFor(x => x.Content)
            .MaximumLength(5000).WithMessage("Content must not exceed 5000 characters.")
            .When(x => !string.IsNullOrEmpty(x.Content));

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("Image URL must not exceed 500 characters.")
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));
    }
}
