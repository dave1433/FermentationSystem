using Api.Data;
using Api.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PushController : ControllerBase
{
    private readonly IDbContextFactory<FermentationDbContext> _ctxFactory;

    public PushController(IDbContextFactory<FermentationDbContext> ctxFactory)
    {
        _ctxFactory = ctxFactory;
    }

    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] PushSubscriptionEntity sub)
    {
        using var ctx = _ctxFactory.CreateDbContext();
        sub.Id = Guid.NewGuid();
        sub.CreatedAt = DateTime.UtcNow;
        ctx.PushSubscriptions.Add(sub);
        await ctx.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("vapid-public-key")]
    public IActionResult GetVapidPublicKey([FromServices] IConfiguration config)
    {
        return Ok(new { publicKey = config["Vapid:PublicKey"] });
    }
}