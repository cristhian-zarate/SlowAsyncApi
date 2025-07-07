using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace Test_SlowAsyncAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DefaultController : ControllerBase
{
	[HttpGet]
	public async IAsyncEnumerable<char> Get(string text, [EnumeratorCancellation] CancellationToken cancellationToken)
	{
		Response.ContentType = "text/event-stream";

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

		// await foreach (char letter in GetLetterWithDelay(finalText, cancellationToken).WithCancellation(cancellationToken))
		// {
		// 	Console.Write(letter);
		// 	yield return letter.ToString();
		// }

		Random r = new();
		int delay;
		foreach (char letter in finalText.ToCharArray())
		{
			delay = 125 + (125 * r.Next(0, 2)) + (250 * (r.Next(0, 4) % 3));
			Debug.Write($"['{letter}',{delay}ms], ");
			await Task.Delay(delay, cancellationToken);
			yield return letter;
		}
	}

	// public static async IAsyncEnumerable<char> GetLetterWithDelay(string text, [EnumeratorCancellation] CancellationToken cancellationToken = default)
	// {
	// 	Random r = new();
	// 	int delay;
	// 	foreach (char letter in text.ToCharArray())
	// 	{
	// 		delay = 500 + (500 * r.Next(0, 3));
	// 		await Task.Delay(delay, cancellationToken);
	// 		yield return letter;
	// 	}
	// }
}
