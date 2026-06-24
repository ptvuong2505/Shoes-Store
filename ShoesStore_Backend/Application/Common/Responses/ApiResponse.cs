using Application.Common.Errors;

namespace Application.Common.Responses;

public sealed class ApiResponse<T>
{
    public bool Success { get; init; }
    public int StatusCode { get; init; }
    public string Message { get; init; } = string.Empty;
    public T? Data { get; init; }
    public ApiError? Error { get; init; }

    private ApiResponse()
    {
    }

    public static ApiResponse<T> Ok(
        T? data,
        string message = "Request completed successfully.")
    {
        return SuccessResponse(200, data, message);
    }

    public static ApiResponse<T> Created(
        T? data,
        string message = "Resource created successfully.")
    {
        return SuccessResponse(201, data, message);
    }

    public static ApiResponse<T> SuccessResponse(
        int statusCode,
        T? data,
        string message)
    {
        return new ApiResponse<T>
        {
            Success = true,
            StatusCode = statusCode,
            Message = message,
            Data = data,
            Error = null
        };
    }

    public static ApiResponse<T> Fail(
        int statusCode,
        string errorCode,
        string message,
        IDictionary<string, string[]>? details = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            StatusCode = statusCode,
            Message = message,
            Data = default,
            Error = new ApiError(errorCode, details)
        };
    }

    public static ApiResponse<T> Validation(
        IDictionary<string, string[]> errors,
        string message = "Request validation failed.")
    {
        return Fail(400, ErrorCodes.ValidationError, message, errors);
    }
}
