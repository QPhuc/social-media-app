namespace backend;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();

        // Add Swagger/OpenAPI services
        builder.Services.AddEndpointsApiExplorer(); // Needed for minimal APIs and Swagger
        builder.Services.AddSwaggerGen();           // Registers Swagger generator

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();                       // Enable middleware to serve generated Swagger as JSON
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                // Optional: make Swagger UI open at root /
                // c.RoutePrefix = string.Empty;
            });
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}