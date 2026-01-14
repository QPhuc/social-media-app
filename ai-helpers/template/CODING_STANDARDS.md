# Coding Standards & Templates

> Templates and coding standards for Social Media App project
> 
> **Last Updated:** January 14, 2026

---

## 📋 Table of Contents

1. [SOLID Principles](#solid-principles)
2. [Backend Templates (.NET)](#backend-templates-net)
3. [Frontend Templates (React)](#frontend-templates-react)
4. [Naming Conventions](#naming-conventions)
5. [Best Practices](#best-practices)

---

## SOLID Principles

### 🎯 Overview

SOLID represents 5 software design principles that make code maintainable, scalable, and testable.

---

### 1️⃣ Single Responsibility Principle (SRP)

> **"A class should have only one reason to change"**

Each class/module should do only one thing.

#### ❌ Violates SRP:

```csharp
// Backend - BAD: Class does too many things
public class UserService
{
    public void CreateUser(User user)
    {
        // Validate
        if (string.IsNullOrEmpty(user.Email))
            throw new Exception("Email required");
            
        // Hash password
        user.Password = BCrypt.HashPassword(user.Password);
        
        // Save to database
        _context.Users.Add(user);
        _context.SaveChanges();
        
        // Send email
        var smtp = new SmtpClient();
        smtp.Send(new MailMessage("Welcome!", user.Email));
        
        // Log
        File.AppendAllText("log.txt", $"User created: {user.Email}");
    }
}
```

```tsx
// Frontend - BAD: Component does too many things
const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    // Fetch user
    fetch('/api/users/1').then(res => res.json()).then(setUser)
    
    // Fetch posts
    fetch('/api/posts').then(res => res.json()).then(setPosts)
  }, [])
  
  const handleUpdateProfile = async (data) => {
    // Validation logic
    if (!data.email.includes('@')) return alert('Invalid email')
    
    // API call
    await fetch('/api/users/1', { method: 'PUT', body: JSON.stringify(data) })
    
    // Update local state
    setUser(data)
  }
  
  return (
    <div>
      {/* Render profile */}
      {/* Render posts */}
      {/* Render edit form */}
    </div>
  )
}
```

#### ✅ Follows SRP:

```csharp
// Backend - GOOD: Each class has one responsibility
public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, User>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IEmailService _emailService;
    private readonly ILogger<CreateUserCommandHandler> _logger;
    
    public async Task<User> Handle(CreateUserCommand request, CancellationToken ct)
    {
        var user = new User
        {
            Email = request.Email,
            Password = _passwordHasher.Hash(request.Password)
        };
        
        await _userRepository.AddAsync(user);
        await _emailService.SendWelcomeEmailAsync(user.Email);
        _logger.LogInformation("User created: {Email}", user.Email);
        
        return user;
    }
}

// Separate validator
public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).MinimumLength(8);
    }
}
```

```tsx
// Frontend - GOOD: Separate responsibilities
// 1. Hook cho data fetching
const useUser = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUser(id)
  })
}

// 2. Hook cho mutations
const useUpdateUser = () => {
  return useMutation({
    mutationFn: (data: UpdateUserDto) => userApi.updateUser(data)
  })
}

// 3. Component chỉ render UI
const UserProfile = ({ userId }: { userId: number }) => {
  const { data: user, isLoading } = useUser(userId)
  
  if (isLoading) return <Spinner />
  
  return (
    <div>
      <UserInfo user={user} />
      <EditProfileForm user={user} />
    </div>
  )
}

// 4. Form component riêng
const EditProfileForm = ({ user }: { user: User }) => {
  const updateUser = useUpdateUser()
  const { handleSubmit, register } = useForm({
    resolver: zodResolver(updateUserSchema)
  })
  
  return <form onSubmit={handleSubmit(updateUser.mutate)}>...</form>
}
```

---

### 2️⃣ Open/Closed Principle (OCP)

> **"Open for extension, closed for modification"**

You can extend functionality without modifying existing code.

#### ❌ Violates OCP:

```csharp
// Backend - BAD: Must modify code every time a new notification type is added
public class NotificationService
{
    public void Send(Notification notification)
    {
        if (notification.Type == "Email")
        {
            // Send email logic
        }
        else if (notification.Type == "SMS")
        {
            // Send SMS logic
        }
        else if (notification.Type == "Push")
        {
            // Send push notification logic
        }
        // Must modify here every time a new type is added!
    }
}
```

#### ✅ Follows OCP:

```csharp
// Backend - GOOD: Use abstraction
public interface INotificationChannel
{
    Task SendAsync(string recipient, string message);
}

public class EmailChannel : INotificationChannel
{
    public async Task SendAsync(string recipient, string message)
    {
        // Email logic
    }
}

public class SmsChannel : INotificationChannel
{
    public async Task SendAsync(string recipient, string message)
    {
        // SMS logic
    }
}

public class PushChannel : INotificationChannel
{
    public async Task SendAsync(string recipient, string message)
    {
        // Push logic
    }
}

public class NotificationService
{
    private readonly IEnumerable<INotificationChannel> _channels;
    
    public NotificationService(IEnumerable<INotificationChannel> channels)
    {
        _channels = channels;
    }
    
    public async Task SendToAllChannelsAsync(string recipient, string message)
    {
        foreach (var channel in _channels)
        {
            await channel.SendAsync(recipient, message);
        }
    }
}

// DI Registration - Add new channel by just registering, no code modification
services.AddTransient<INotificationChannel, EmailChannel>();
services.AddTransient<INotificationChannel, SmsChannel>();
services.AddTransient<INotificationChannel, PushChannel>();
```

```tsx
// Frontend - GOOD: Strategy pattern with React
interface ValidationRule {
  validate: (value: string) => boolean
  message: string
}

const emailRule: ValidationRule = {
  validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message: 'Invalid email format'
}

const minLengthRule = (min: number): ValidationRule => ({
  validate: (value) => value.length >= min,
  message: `Minimum ${min} characters required`
})

// Add new rules without modifying existing code
const useValidation = (rules: ValidationRule[]) => {
  return (value: string) => {
    for (const rule of rules) {
      if (!rule.validate(value)) {
        return rule.message
      }
    }
    return null
  }
}

// Usage
const validateEmail = useValidation([emailRule, minLengthRule(5)])
```

---

### 3️⃣ Liskov Substitution Principle (LSP)

> **"Derived classes must be substitutable for their base classes without breaking the program"**

#### ❌ Violates LSP:

```csharp
// Backend - BAD: Square violates LSP
public class Rectangle
{
    public virtual int Width { get; set; }
    public virtual int Height { get; set; }
    
    public int GetArea() => Width * Height;
}

public class Square : Rectangle
{
    public override int Width
    {
        set { base.Width = base.Height = value; }
    }
    
    public override int Height
    {
        set { base.Width = base.Height = value; }
    }
}

// Problem:
Rectangle rect = new Square();
rect.Width = 5;
rect.Height = 10;
Console.WriteLine(rect.GetArea()); // Expected: 50, Actual: 100!
```

#### ✅ Follows LSP:

```csharp
// Backend - GOOD: Use composition instead of inheritance
public interface IShape
{
    int GetArea();
}

public class Rectangle : IShape
{
    public int Width { get; set; }
    public int Height { get; set; }
    
    public int GetArea() => Width * Height;
}

public class Square : IShape
{
    public int Side { get; set; }
    
    public int GetArea() => Side * Side;
}
```

```tsx
// Frontend - GOOD: Composition over inheritance
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

// Base button
const Button = ({ onClick, children }: ButtonProps) => (
  <button onClick={onClick}>{children}</button>
)

// Composed buttons instead of inheritance
const PrimaryButton = (props: ButtonProps) => (
  <Button {...props} className="bg-blue-500" />
)

const DangerButton = (props: ButtonProps) => (
  <Button {...props} className="bg-red-500" />
)
```

---

### 4️⃣ Interface Segregation Principle (ISP)

> **"Clients should not be forced to implement interfaces they don't use"**

#### ❌ Violates ISP:

```csharp
// Backend - BAD: Fat interface
public interface IRepository
{
    Task<T> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
    Task<List<T>> SearchAsync(string query);
    Task<byte[]> ExportToPdfAsync();
    Task<byte[]> ExportToExcelAsync();
    Task SendEmailReportAsync();
}

// ReadOnlyRepository must implement Add, Update, Delete!
public class ReadOnlyUserRepository : IRepository
{
    public Task AddAsync(User user) 
        => throw new NotImplementedException(); // Not needed but required!
}
```

#### ✅ Follows ISP:

```csharp
// Backend - GOOD: Split into smaller interfaces
public interface IReadRepository<T>
{
    Task<T?> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();
}

public interface IWriteRepository<T>
{
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}

public interface ISearchableRepository<T>
{
    Task<List<T>> SearchAsync(string query);
}

public interface IExportableRepository
{
    Task<byte[]> ExportToPdfAsync();
    Task<byte[]> ExportToExcelAsync();
}

// Implement only what's needed
public class UserRepository : 
    IReadRepository<User>, 
    IWriteRepository<User>, 
    ISearchableRepository<User>
{
    // Only implement methods actually needed
}

public class ReadOnlyReportRepository : IReadRepository<Report>, IExportableRepository
{
    // Not forced to implement Add/Update/Delete
}
```

```tsx
// Frontend - GOOD: Specific props interfaces
// BAD: Fat props
interface UserCardProps {
  user: User
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  showActions?: boolean
  showAvatar?: boolean
  showBio?: boolean
}

// GOOD: Split into smaller interfaces
interface UserCardBaseProps {
  user: User
}

interface UserCardWithActionsProps extends UserCardBaseProps {
  onEdit: () => void
  onDelete: () => void
}

interface UserCardCompactProps extends UserCardBaseProps {
  compact: true
}

// Usage
const UserCard = (props: UserCardBaseProps) => { /* Basic card */ }
const UserCardWithActions = (props: UserCardWithActionsProps) => { /* With actions */ }
const UserCardCompact = (props: UserCardCompactProps) => { /* Compact view */ }
```

---

### 5️⃣ Dependency Inversion Principle (DIP)

> **"High-level modules should not depend on low-level modules. Both should depend on abstractions"**

#### ❌ Violates DIP:

```csharp
// Backend - BAD: Direct dependency
public class OrderService
{
    private readonly SqlServerDatabase _database; // Depends on concrete class
    private readonly SmtpEmailService _emailService;
    
    public OrderService()
    {
        _database = new SqlServerDatabase(); // Hard-coded!
        _emailService = new SmtpEmailService();
    }
    
    public void CreateOrder(Order order)
    {
        _database.Save(order); // Cannot test, cannot change DB
        _emailService.Send("Order created");
    }
}
```

#### ✅ Follows DIP:

```csharp
// Backend - GOOD: Dependency Injection
public interface IDatabase
{
    Task SaveAsync<T>(T entity);
}

public interface IEmailService
{
    Task SendAsync(string message);
}

public class OrderService
{
    private readonly IDatabase _database;
    private readonly IEmailService _emailService;
    
    // Dependencies injected via constructor
    public OrderService(IDatabase database, IEmailService emailService)
    {
        _database = database;
        _emailService = emailService;
    }
    
    public async Task CreateOrderAsync(Order order)
    {
        await _database.SaveAsync(order);
        await _emailService.SendAsync("Order created");
    }
}

// Registration in DI container
services.AddScoped<IDatabase, SqlServerDatabase>();
services.AddScoped<IEmailService, SmtpEmailService>();
services.AddScoped<OrderService>();

// Easy to mock for testing
var mockDb = new Mock<IDatabase>();
var mockEmail = new Mock<IEmailService>();
var service = new OrderService(mockDb.Object, mockEmail.Object);
```

```tsx
// Frontend - GOOD: Dependency injection via props/context
// BAD: Hard-coded dependency
const UserList = () => {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    // Hard-coded axios
    axios.get('/api/users').then(res => setUsers(res.data))
  }, [])
  
  return <div>{users.map(...)}</div>
}

// GOOD: Injected dependency
interface UserListProps {
  fetchUsers: () => Promise<User[]> // Abstraction
}

const UserList = ({ fetchUsers }: UserListProps) => {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    fetchUsers().then(setUsers) // Use injected function
  }, [fetchUsers])
  
  return <div>{users.map(...)}</div>
}

// Usage
<UserList fetchUsers={userApi.getUsers} />

// Or use Context
const ApiContext = createContext<IApiClient | null>(null)

const useApi = () => {
  const api = useContext(ApiContext)
  if (!api) throw new Error('API not provided')
  return api
}

// Component
const UserList = () => {
  const api = useApi() // Injected via context
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers
  })
  
  return <div>{users?.map(...)}</div>
}
```

---

### 📊 SOLID Summary

| Principle | Purpose | When violated | How to fix |
|-----------|---------|---------------|------------|
| **SRP** | One responsibility per class | Class does > 1 thing | Split into multiple classes |
| **OCP** | Extend without modifying old code | Using if/else/switch for behavior | Use interfaces/strategies |
| **LSP** | Subclass can replace base | Override changes behavior | Composition > inheritance |
| **ISP** | Small, focused interfaces | Fat interface with unused methods | Split into multiple interfaces |
| **DIP** | Depend on abstractions | new in constructor, hard-coded | Dependency Injection |

---

### ✅ SOLID Checklist

**Backend:**
- [ ] Each class has a single reason to change (SRP)
- [ ] Use interfaces for extensibility (OCP)
- [ ] Avoid complex inheritance, prefer composition (LSP)
- [ ] Interfaces are small and focused (ISP)
- [ ] Dependencies injected via constructor (DIP)
- [ ] Business logic separated from infrastructure
- [ ] Controllers are thin, only coordinate requests

**Frontend:**
- [ ] Components do one thing: UI rendering (SRP)
- [ ] Logic separated into hooks/services (SRP)
- [ ] Use composition instead of inheritance (OCP, LSP)
- [ ] Props interfaces are specific, not too many optionals (ISP)
- [ ] API clients injected via Context/props (DIP)
- [ ] Validation logic separated (SRP)
- [ ] State management is clear (local vs global)

---

## Backend Templates (.NET)

### 🎯 Clean Architecture Layers

```
backend/
├── API/                    # Presentation Layer
│   ├── Controllers/
│   └── Extensions/
├── Application/            # Application Layer
│   ├── Common/
│   │   ├── Interfaces/
│   │   ├── Behaviors/
│   │   └── Exceptions/
│   └── [Feature]/
│       ├── Commands/
│       ├── Queries/
│       ├── DTOs/
│       └── Validators/
├── Domain/                 # Domain Layer
│   ├── Entities/
│   ├── Enums/
│   ├── ValueObjects/
│   └── Common/
└── Infrastructure/         # Infrastructure Layer
    ├── Persistence/
    │   ├── DbContext/
    │   ├── Configurations/
    │   └── Repositories/
    └── Services/
```

---

### 1️⃣ Entity Template

```csharp
// Domain/Entities/Post.cs
using backend.Domain.Common;

namespace backend.Domain.Entities;

public class Post : BaseEntity
{
    public int UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    
    // Navigation Properties
    public User User { get; set; } = null!;
    public ICollection<Like> Likes { get; set; } = new List<Like>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}

// Domain/Common/BaseEntity.cs
public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
}
```

---

### 2️⃣ DTOs Template

```csharp
// Application/Posts/DTOs/PostDto.cs
namespace backend.Application.Posts.DTOs;

public record PostDto(
    int Id,
    int UserId,
    string UserName,
    string? UserAvatar,
    string Content,
    string? ImageUrl,
    int LikesCount,
    int CommentsCount,
    bool IsLiked,
    DateTime CreatedAt
);

public record CreatePostDto(
    string Content,
    string? ImageUrl
);

public record UpdatePostDto(
    string Content,
    string? ImageUrl
);

// Response Wrapper
public record ApiResponse<T>(
    bool Success,
    T? Data,
    string? Message = null,
    List<string>? Errors = null
);

public record PaginatedResponse<T>(
    List<T> Items,
    int PageNumber,
    int PageSize,
    int TotalCount,
    int TotalPages
);
```

---

### 3️⃣ CQRS Commands & Queries Template

```csharp
// Application/Posts/Commands/CreatePost/CreatePostCommand.cs
using MediatR;

namespace backend.Application.Posts.Commands.CreatePost;

public record CreatePostCommand(string Content, string? ImageUrl) 
    : IRequest<ApiResponse<PostDto>>;

// Application/Posts/Commands/CreatePost/CreatePostCommandHandler.cs
public class CreatePostCommandHandler 
    : IRequestHandler<CreatePostCommand, ApiResponse<PostDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;
    
    public CreatePostCommandHandler(
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUser)
    {
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }
    
    public async Task<ApiResponse<PostDto>> Handle(
        CreatePostCommand request, 
        CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;
        
        var post = new Post
        {
            UserId = userId,
            Content = request.Content,
            ImageUrl = request.ImageUrl
        };
        
        await _unitOfWork.Posts.AddAsync(post);
        await _unitOfWork.CompleteAsync();
        
        var postDto = MapToDto(post);
        
        return new ApiResponse<PostDto>(true, postDto, "Post created successfully");
    }
}

// Application/Posts/Queries/GetPosts/GetPostsQuery.cs
public record GetPostsQuery(int PageNumber = 1, int PageSize = 10) 
    : IRequest<PaginatedResponse<PostDto>>;

public class GetPostsQueryHandler 
    : IRequestHandler<GetPostsQuery, PaginatedResponse<PostDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    
    public async Task<PaginatedResponse<PostDto>> Handle(
        GetPostsQuery request, 
        CancellationToken cancellationToken)
    {
        var posts = await _unitOfWork.Posts
            .GetPagedAsync(request.PageNumber, request.PageSize);
            
        // Map and return
    }
}
```

---

### 4️⃣ Validator Template

```csharp
// Application/Posts/Commands/CreatePost/CreatePostValidator.cs
using FluentValidation;

namespace backend.Application.Posts.Commands.CreatePost;

public class CreatePostValidator : AbstractValidator<CreatePostCommand>
{
    public CreatePostValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required")
            .MaximumLength(5000).WithMessage("Content must not exceed 5000 characters");
            
        RuleFor(x => x.ImageUrl)
            .Must(BeAValidUrl).When(x => !string.IsNullOrEmpty(x.ImageUrl))
            .WithMessage("Invalid image URL");
    }
    
    private bool BeAValidUrl(string? url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out _);
    }
}
```

---

### 5️⃣ Repository Template

```csharp
// Application/Common/Interfaces/IGenericRepository.cs
public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();
    Task<List<T>> GetPagedAsync(int pageNumber, int pageSize);
    Task<T> AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task<bool> ExistsAsync(int id);
}

// Infrastructure/Persistence/Repositories/GenericRepository.cs
public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;
    
    public GenericRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }
    
    public async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Where(x => !x.IsDeleted)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
    
    public async Task<List<T>> GetPagedAsync(int pageNumber, int pageSize)
    {
        return await _dbSet
            .Where(x => !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
    
    public async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        return entity;
    }
    
    public void Update(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        _dbSet.Update(entity);
    }
    
    public void Delete(T entity)
    {
        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        _dbSet.Update(entity);
    }
}
```

---

### 6️⃣ Controller Template

```csharp
// API/Controllers/PostsController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PostsController : ControllerBase
{
    private readonly IMediator _mediator;
    
    public PostsController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    /// <summary>
    /// Get paginated posts
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponse<PostDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPosts(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var query = new GetPostsQuery(pageNumber, pageSize);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
    /// <summary>
    /// Create a new post
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<PostDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
    {
        var command = new CreatePostCommand(dto.Content, dto.ImageUrl);
        var result = await _mediator.Send(command);
        
        if (!result.Success)
            return BadRequest(result);
            
        return CreatedAtAction(
            nameof(GetPostById), 
            new { id = result.Data!.Id }, 
            result
        );
    }
    
    /// <summary>
    /// Get post by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<PostDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPostById(int id)
    {
        var query = new GetPostByIdQuery(id);
        var result = await _mediator.Send(query);
        
        if (!result.Success)
            return NotFound(result);
            
        return Ok(result);
    }
}
```

---

### 7️⃣ Service Registration Template

```csharp
// API/Extensions/ServiceCollectionExtensions.cs
using FluentValidation;
using MediatR;

namespace backend.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services)
    {
        // MediatR
        services.AddMediatR(cfg => 
            cfg.RegisterServicesFromAssembly(typeof(Application.AssemblyReference).Assembly));
        
        // FluentValidation
        services.AddValidatorsFromAssembly(
            typeof(Application.AssemblyReference).Assembly);
        
        // AutoMapper
        services.AddAutoMapper(typeof(Application.AssemblyReference).Assembly);
        
        return services;
    }
    
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
        
        // UnitOfWork & Repositories
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        
        return services;
    }
}
```

---

## Frontend Templates (React)

### 🎯 Feature-based Structure

```
src/
├── features/
│   └── [feature]/
│       ├── components/         # Feature-specific components
│       ├── hooks/             # Feature-specific hooks
│       ├── services/          # API calls
│       ├── types/             # TypeScript types
│       ├── utils/             # Helper functions
│       └── index.ts           # Public API
├── components/
│   ├── ui/                    # Reusable UI components
│   └── form/                  # Form components
├── lib/
│   ├── api.ts                 # API client
│   └── types/                 # Global types
├── hooks/                     # Global hooks
├── context/                   # React Context
├── pages/                     # Route pages
└── routes/                    # Route config
```

---

### 1️⃣ Component Template

```tsx
// features/posts/components/PostCard.tsx
import { FC } from 'react'
import { Post } from '../types'

interface PostCardProps {
  post: Post
  onLike?: (postId: number) => void
  onComment?: (postId: number) => void
  className?: string
}

export const PostCard: FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment,
  className = '' 
}) => {
  const handleLike = () => {
    onLike?.(post.id)
  }

  return (
    <article className={`post-card ${className}`}>
      <header className="post-header">
        <img src={post.userAvatar} alt={post.userName} />
        <h3>{post.userName}</h3>
      </header>
      
      <div className="post-content">
        <p>{post.content}</p>
        {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
      </div>
      
      <footer className="post-footer">
        <button onClick={handleLike}>
          ❤️ {post.likesCount}
        </button>
        <button onClick={() => onComment?.(post.id)}>
          💬 {post.commentsCount}
        </button>
      </footer>
    </article>
  )
}
```

---

### 2️⃣ Custom Hook Template

```tsx
// features/posts/hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '../services/postsApi'
import { CreatePostDto } from '../types'

export const usePosts = (pageNumber = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['posts', pageNumber, pageSize],
    queryFn: () => postsApi.getPosts(pageNumber, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const usePost = (id: number) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postsApi.getPost(id),
    enabled: !!id,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreatePostDto) => postsApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (postId: number) => postsApi.likePost(postId),
    onMutate: async (postId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      
      const previousPosts = queryClient.getQueryData(['posts'])
      
      queryClient.setQueryData(['posts'], (old: any) => {
        // Update logic here
        return old
      })
      
      return { previousPosts }
    },
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(['posts'], context?.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
```

---

### 3️⃣ API Service Template

```tsx
// features/posts/services/postsApi.ts
import { api } from '@/lib/api'
import { 
  Post, 
  CreatePostDto, 
  UpdatePostDto,
  PaginatedResponse,
  ApiResponse 
} from '../types'

export const postsApi = {
  getPosts: async (
    pageNumber = 1, 
    pageSize = 10
  ): Promise<PaginatedResponse<Post>> => {
    const { data } = await api.get('/posts', {
      params: { pageNumber, pageSize }
    })
    return data
  },

  getPost: async (id: number): Promise<Post> => {
    const { data } = await api.get<ApiResponse<Post>>(`/posts/${id}`)
    return data.data!
  },

  createPost: async (dto: CreatePostDto): Promise<Post> => {
    const { data } = await api.post<ApiResponse<Post>>('/posts', dto)
    return data.data!
  },

  updatePost: async (id: number, dto: UpdatePostDto): Promise<Post> => {
    const { data } = await api.put<ApiResponse<Post>>(`/posts/${id}`, dto)
    return data.data!
  },

  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`)
  },

  likePost: async (id: number): Promise<void> => {
    await api.post(`/posts/${id}/like`)
  },

  unlikePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}/like`)
  }
}
```

---

### 4️⃣ Types Template

```tsx
// features/posts/types/index.ts
export interface Post {
  id: number
  userId: number
  userName: string
  userAvatar?: string
  content: string
  imageUrl?: string
  likesCount: number
  commentsCount: number
  isLiked: boolean
  createdAt: string
}

export interface CreatePostDto {
  content: string
  imageUrl?: string
}

export interface UpdatePostDto {
  content: string
  imageUrl?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}
```

---

### 5️⃣ Form with React Hook Form + Zod

```tsx
// features/posts/components/CreatePostForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreatePost } from '../hooks/usePosts'

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content must not exceed 5000 characters'),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

type CreatePostFormData = z.infer<typeof createPostSchema>

export const CreatePostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  })

  const createPost = useCreatePost()

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      await createPost.mutateAsync(data)
      reset()
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <textarea
          {...register('content')}
          placeholder="What's on your mind?"
          className="w-full p-3 border rounded"
          rows={4}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      <div>
        <input
          {...register('imageUrl')}
          type="url"
          placeholder="Image URL (optional)"
          className="w-full p-2 border rounded"
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting ? 'Posting...' : 'Post'}
      </button>
    </form>
  )
}
```

---

### 6️⃣ Page Template

```tsx
// features/posts/pages/PostsPage.tsx
import { useState } from 'react'
import { usePosts } from '../hooks/usePosts'
import { PostCard } from '../components/PostCard'
import { CreatePostForm } from '../components/CreatePostForm'

export const PostsPage = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, error } = usePosts(page, 10)

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      
      <CreatePostForm />
      
      <div className="mt-8 space-y-4">
        {data?.items.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
```

---

### 7️⃣ Context Template

```tsx
// context/NotificationContext.tsx
import { createContext, useContext, useState, useCallback } from 'react'

type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface Notification {
  id: string
  type: NotificationType
  message: string
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (type: NotificationType, message: string) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = useCallback((type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { id, type, message }])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider 
      value={{ notifications, showNotification, removeNotification }}
    >
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}
```

---

## Naming Conventions

### Backend (C#)

| Item | Convention | Example |
|------|-----------|---------|
| Classes | PascalCase | `UserService`, `PostRepository` |
| Interfaces | I + PascalCase | `IUserService`, `IUnitOfWork` |
| Methods | PascalCase | `GetUserById`, `CreatePost` |
| Properties | PascalCase | `UserId`, `CreatedAt` |
| Private fields | _camelCase | `_dbContext`, `_mapper` |
| Parameters | camelCase | `userId`, `pageNumber` |
| Constants | PascalCase | `MaxPageSize`, `DefaultTimeout` |
| Async methods | Suffix with Async | `GetUserAsync`, `SaveChangesAsync` |

### Frontend (React/TypeScript)

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `PostCard`, `UserProfile` |
| Hooks | use + camelCase | `useAuth`, `usePosts` |
| Functions | camelCase | `handleSubmit`, `fetchData` |
| Variables | camelCase | `userName`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_FILE_SIZE` |
| Types/Interfaces | PascalCase | `User`, `PostDto` |
| Enums | PascalCase | `UserRole`, `PostStatus` |
| Files (components) | PascalCase | `PostCard.tsx`, `UserList.tsx` |
| Files (utils) | camelCase | `formatDate.ts`, `validators.ts` |

---

## Best Practices

### ✅ Backend

1. **SOLID Compliance**
   - **SRP**: Each class one responsibility (Controllers route, Services business logic, Repositories data access)
   - **OCP**: Use interfaces and DI to extend without modification
   - **LSP**: Avoid complex inheritance, prefer composition
   - **ISP**: Split large interfaces into smaller focused interfaces
   - **DIP**: Inject dependencies via constructor, no new() inside classes

2. **Separation of Concerns**
   - Controllers only handle HTTP requests
   - Business logic in Application layer
   - Database logic in Infrastructure

3. **CQRS Pattern**
   - Separate Commands (write) and Queries (read)
   - Queries don't modify data
   - Commands return result, don't query again

4. **Error Handling**
   ```csharp
   // Global Exception Handler
   app.UseExceptionHandler(err => err.Run(async context =>
   {
       var exception = context.Features
           .Get<IExceptionHandlerFeature>()?.Error;
           
       var response = exception switch
       {
           NotFoundException => new { status = 404, message = exception.Message },
           ValidationException => new { status = 400, errors = ... },
           _ => new { status = 500, message = "Internal server error" }
       };
       
       context.Response.StatusCode = response.status;
       await context.Response.WriteAsJsonAsync(response);
   }));
   ```

5. **Validation**
   - Use FluentValidation
   - Validate at Application layer
   - Return clear error details

6. **Async/Await**
   - Always use async for I/O operations
   - Use CancellationToken
   - Avoid async void (except event handlers)

### ✅ Frontend

1. **SOLID Compliance**
   - **SRP**: Components only render UI, logic in hooks/services
   - **OCP**: Composition pattern, render props, HOCs
   - **LSP**: Component substitution, props compatibility
   - **ISP**: Specific props interfaces, not fat props with many optionals
   - **DIP**: API clients, services injected via Context/props

2. **Component Organization**
   ```tsx
   // ❌ Bad
   function PostCard(props) { ... }
   
   // ✅ Good
   interface PostCardProps {
     post: Post
     onLike?: (id: number) => void
   }
   
   export const PostCard: FC<PostCardProps> = ({ post, onLike }) => { ... }
   ```

3. **State Management**
   - Local state for UI state
   - React Query for server state
   - Context for global UI state (theme, auth)
   - Zustand/Redux for complex client state

4. **Error Handling**
   ```tsx
   // ❌ Bad
   const { data } = usePosts()
   return <div>{data.items.map(...)}</div>
   
   // ✅ Good
   const { data, isLoading, isError, error } = usePosts()
   
   if (isLoading) return <Spinner />
   if (isError) return <ErrorMessage error={error} />
   if (!data) return null
   
   return <div>{data.items.map(...)}</div>
   ```

5. **Performance**
   - Use `useMemo` for expensive calculations
   - Use `useCallback` for callbacks passed to children
   - Lazy load components with `React.lazy()`
   - Virtualize long lists

6. **TypeScript**
   - Avoid `any`, use `unknown` if needed
   - Define types for props, state, API responses
   - Use utility types: `Partial`, `Pick`, `Omit`

7. **Dependency Injection**
   ```tsx
   // ✅ Good: Inject dependencies
   const ApiContext = createContext<ApiClient | null>(null)
   
   export const ApiProvider = ({ children, client }: { 
     children: ReactNode
     client: ApiClient 
   }) => (
     <ApiContext.Provider value={client}>
       {children}
     </ApiContext.Provider>
   )
   
   // Usage
   const api = useContext(ApiContext)
   ```

---

## Code Review Checklist

### Backend - SOLID Compliance
- [ ] Follows Clean Architecture principles
- [ ] CQRS implemented correctly
- [ ] Proper error handling
- [ ] Validation in place
- [ ] Async/await used correctly
- [ ] No business logic in controllers
- [ ] DTOs used for data transfer
- [ ] Repository pattern implemented
- [ ] Unit tests written

### Frontend
- [ ] Component is properly typed
- [ ] Error states handled
- [ ] Loading states shown
- [ ] No prop drilling (use Context/composition)
- [ ] Accessibility considered (ARIA labels)
- [ ] Responsive design
- [ ] Performance optimized
- [ ] API calls in services, not components
- [ ] Custom hooks for reusable logic

---

## Quick Reference

### Common Commands

```bash
# Backend
dotnet new webapi -n API
dotnet add package MediatR
dotnet ef migrations add InitialCreate
dotnet ef database update

# Frontend
npm create vite@latest
npm install @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm run dev
```

### Useful Snippets

Add your own snippets here as you discover patterns!

```tsx
// [Your custom snippets]
```

---

**Remember:** These are guidelines, not strict rules. Adapt them as needed for your specific use case!
