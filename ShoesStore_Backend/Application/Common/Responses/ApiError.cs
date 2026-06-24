namespace Application.Common.Responses;

public sealed class ApiError
{
    public string Code { get; init; }
    public IDictionary<string, string[]>? Details { get; init; }

    public ApiError(
        string code,
        IDictionary<string, string[]>? details = null)
    {
        Code = code;
        Details = details;
    }
}
