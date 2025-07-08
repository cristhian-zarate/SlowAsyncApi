using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace Test_SlowAsyncAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DefaultController : ControllerBase
{
	[HttpGet]
	public async Task Get(string text, CancellationToken cancellationToken)
	{
		Response.ContentType = "text/plain";

		string initialText = text.Trim();
		string finalText = string.Empty;

		var splittedText = initialText.ToCharArray();
		SortedDictionary<char, int> letterDict = new();
		foreach (char letter in splittedText)
		{
			letterDict.TryGetValue(letter, out int value);
			if (!letterDict.TryAdd(letter, ++value))
				letterDict[letter]++;
		}
		var letterCount = string.Join("", letterDict.Select(p => $"{p.Key}{p.Value}"));
		var encodedText = Convert.ToBase64String(Encoding.UTF8.GetBytes(initialText));
		finalText = $"{letterCount}/{encodedText}";

		Random r = new();
		int delay;
		foreach (char letter in finalText.ToCharArray())
		{
			delay = 125 + (125 * r.Next(0, 2)) + (250 * (r.Next(0, 4) % 3));
			await Task.Delay(delay, cancellationToken);
			await Response.WriteAsync(letter.ToString());
			await Response.Body.FlushAsync();
		}
	}
}
