namespace Application.Common.Exceptions;

public sealed class UnauthorizedException : AppException
{
    public UnauthorizedException(
        string errorCode,
        string message)
        : base(errorCode, message)
    {
    }
}
