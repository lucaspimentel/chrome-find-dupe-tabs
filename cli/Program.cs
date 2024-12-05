// See https://aka.ms/new-console-template for more information

using System.Net.Http.Json;
using FindDuplicateChromeTabs;

Console.WriteLine("Hello, World!");

if (args.Length == 0 || !int.TryParse(args[0], out var port))
{
    port = 9222;
}

var client = new HttpClient();
var tags = await client.GetFromJsonAsync<List<Entry>>($"http://localhost:{port}/json");

var duplicateTabs = tags!.GroupBy(e => e.Url)
                         .Where(g => g.Count() > 1)
                         .Select(g => g.Key);

foreach (var url in duplicateTabs)
{
    Console.WriteLine(url);
}
