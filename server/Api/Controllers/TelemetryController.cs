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

        var group = "telemetry";
        await _backplane.Groups.AddToGroupAsync(connectionId, group);

        using var ctx = _ctxFactory.CreateDbContext();
        var initial = await ctx.Telemetries.OrderByDescending(t => t.Timestamp).FirstOrDefaultAsync();
        
        return Ok(initial);
    }

    [HttpGet]
    public async Task<IActionResult> GetTelemetry()
    {
        using var ctx = _ctxFactory.CreateDbContext();
        var telemetry = await ctx.Telemetries.ToListAsync();
        return Ok(telemetry);
    }
}