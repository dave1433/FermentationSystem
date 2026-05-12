using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Entities;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TelemetryController : ControllerBase
{
    private readonly IDbContextFactory<FermentationDbContext> _ctxFactory;

    public TelemetryController(
        IDbContextFactory<FermentationDbContext> ctxFactory)
    {
        _ctxFactory = ctxFactory;
    }

    [HttpGet]
    public async Task<IActionResult> GetTelemetry()
    {
        using var ctx = _ctxFactory.CreateDbContext();

        var telemetry = await ctx.Telemetries
            .OrderByDescending(t => t.Timestamp)
            .Take(100)
            .ToListAsync();

        return Ok(telemetry);
    }
}