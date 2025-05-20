using System;
using System.Linq;
using SmartEvent.Core.Models;

namespace SmartEvent.Data
{
    public static class DatabaseSeeder
    {
        public static void SeedData(ApplicationDbContext context)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Check if admin user already exists
            if (!context.Users.Any(u => u.Email == "admin@smartevent.com"))
            {
                // Create admin user
                var adminUser = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "Admin",
                    Email = "admin@smartevent.com",
                    IsAdmin = true
                };

                context.Users.Add(adminUser);
                context.SaveChanges();
            }
        }
    }
}
