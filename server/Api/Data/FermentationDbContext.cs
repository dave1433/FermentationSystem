using Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class FermentationDbContext : DbContext
{
    public FermentationDbContext(DbContextOptions<FermentationDbContext> options)
        : base(options)
    {
    }

    public DbSet<FermentationTelemetryEntity> Telemetries => Set<FermentationTelemetryEntity>();
    public DbSet<PushSubscriptionEntity> PushSubscriptions => Set<PushSubscriptionEntity>();
}