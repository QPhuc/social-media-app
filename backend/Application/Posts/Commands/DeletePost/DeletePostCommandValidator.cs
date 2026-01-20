using FluentValidation;

namespace backend.Application.Posts.Commands.DeletePost;

public class DeletePostCommandValidator : AbstractValidator<DeletePostCommand>
{
    public DeletePostCommandValidator()
    {
        RuleFor(x => x.PostId)
            .GreaterThan(0).WithMessage("Post ID must be greater than 0.");

        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("User ID must be greater than 0.");
    }
}
