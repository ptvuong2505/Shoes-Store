namespace Application.Common.Exceptions;

public sealed class BusinessRuleException : AppException
{
    public BusinessRuleException(
        string errorCode,
        string message)
        : base(errorCode, message)
    {
    }
}
