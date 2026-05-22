using Api.Data;
using Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class TelemetryService
{
    private readonly IDbContextFactory<FermentationDbContext> _ctxFactory;

    public TelemetryService(
        IDbContextFactory<FermentationDbContext> ctxFactory)
    {
        _ctxFactory = ctxFactory;
    }

    public async Task SaveTelemetryAsync(
        FermentationTelemetryEntity telemetry)
    {
        using var ctx = _ctxFactory.CreateDbContext();

        telemetry.Id = Guid.NewGuid();

        ctx.Telemetries.Add(telemetry);

        await ctx.SaveChangesAsync();
    }

    public async Task<List<FermentationTelemetryEntity>>
        GetLatestAsync(int count = 100)
    {
        using var ctx = _ctxFactory.CreateDbContext();

        return await ctx.Telemetries
            .OrderByDescending(t => t.Timestamp)
            .Take(count)
            .ToListAsync();
    }
}