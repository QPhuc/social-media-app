using FluentValidation;

namespace backend.Application.Posts.Queries.GetPostById;

public class GetPostByIdQueryValidator : AbstractValidator<GetPostByIdQuery>
{
    public GetPostByIdQueryValidator()
    {
        RuleFor(x => x.PostId)
            .GreaterThan(0).WithMessage("Post ID must be greater than 0.");
    }
}
