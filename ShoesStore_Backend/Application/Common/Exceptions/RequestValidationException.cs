using Application.Common.Errors;

namespace Application.Common.Exceptions;

public sealed class RequestValidationException : AppException
{
    public IDictionary<string, string[]> Errors { get; }

    public RequestValidationException(
        IDictionary<string, string[]> errors,
        string message = "Request validation failed.")
        : base(ErrorCodes.ValidationError, message)
    {
        Errors = errors;
    }
}
