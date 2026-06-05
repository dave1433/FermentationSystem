using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Entities;
using StateleSSE.AspNetCore;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TelemetryController : ControllerBase
{
    private readonly IDbContextFactory<FermentationDbContext> _ctxFactory;
    private readonly ISseBackplane _backplane;

    public TelemetryController(
        IDbContextFactory<FermentationDbContext> ctxFactory,
        ISseBackplane backplane)
    {
        _ctxFactory = ctxFactory;
        _backplane = backplane;
    }

    [HttpGet("listen")]
    public async Task<IActionResult> Listen([FromQuery] string connectionId)
    {
       if (string.IsNullOrEmpty(connectionId))
          return BadRequest("ConnectionId is required");

       await _backplane.Groups.AddToGroupAsync(connectionId, "telemetry");

       using var ctx = _ctxFactory.CreateDbContext();
       var history = await ctx.Telemetries
        .OrderByDescending(t => t.Timestamp)
        .Take(50)
        .OrderBy(t => t.Timestamp)
        .ToListAsync();

       return Ok(history);
    }

    [HttpGet]
    public async Task<IActionResult> GetTelemetry()
    {
        using var ctx = _ctxFactory.CreateDbContext();
        var telemetry = await ctx.Telemetries.ToListAsync();
        return Ok(telemetry);
    }
}