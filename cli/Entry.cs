namespace FindDuplicateChromeTabs;

public class Entry
{
    public required string Id { get; set; }
    public string Description { get; set; }
    public string DevToolsFrontendUrl { get; set; }
    public string FaviconUrl { get; set; }
    public string Title { get; set; }
    public required string Type { get; set; }
    public required string Url { get; set; }
    public string WebSocketDebuggerUrl { get; set; }
}
