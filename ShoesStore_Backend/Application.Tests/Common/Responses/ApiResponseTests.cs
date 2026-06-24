using Application.Common.Errors;
using Application.Common.Responses;
using Xunit;

namespace Application.Tests.Common.Responses;

public class ApiResponseTests
{
    [Fact]
    public void Ok_CreatesSuccessfulResponseWithData()
    {
        var data = new TestData("order-1");

        var response = ApiResponse<TestData>.Ok(data, "Order retrieved successfully.");

        Assert.True(response.Success);
        Assert.Equal(200, response.StatusCode);
        Assert.Equal("Order retrieved successfully.", response.Message);
        Assert.Same(data, response.Data);
        Assert.Null(response.Error);
    }

    [Fact]
    public void Created_CreatesSuccessfulResponseWithCreatedStatus()
    {
        var data = new TestData("order-1");

        var response = ApiResponse<TestData>.Created(data, "Order created successfully.");

        Assert.True(response.Success);
        Assert.Equal(201, response.StatusCode);
        Assert.Same(data, response.Data);
        Assert.Null(response.Error);
    }

    [Fact]
    public void SuccessResponse_SupportsOtherSuccessfulStatusCodes()
    {
        var response = ApiResponse<object?>.SuccessResponse(
            202,
            null,
            "Request accepted.");

        Assert.True(response.Success);
        Assert.Equal(202, response.StatusCode);
        Assert.Equal("Request accepted.", response.Message);
        Assert.Null(response.Data);
        Assert.Null(response.Error);
    }

    [Fact]
    public void Fail_CreatesFailedResponseWithError()
    {
        var response = ApiResponse<TestData>.Fail(
            404,
            "ORDER_NOT_FOUND",
            "Order not found.");

        Assert.False(response.Success);
        Assert.Equal(404, response.StatusCode);
        Assert.Equal("Order not found.", response.Message);
        Assert.Null(response.Data);
        Assert.NotNull(response.Error);
        Assert.Equal("ORDER_NOT_FOUND", response.Error.Code);
        Assert.Null(response.Error.Details);
    }

    [Fact]
    public void Validation_CreatesValidationFailureWithFieldDetails()
    {
        Dictionary<string, string[]> errors = new()
        {
            ["quantity"] = ["Quantity must be greater than 0."]
        };

        var response = ApiResponse<object?>.Validation(errors);

        Assert.False(response.Success);
        Assert.Equal(400, response.StatusCode);
        Assert.Equal("Request validation failed.", response.Message);
        Assert.Null(response.Data);
        Assert.NotNull(response.Error);
        Assert.Equal(ErrorCodes.ValidationError, response.Error.Code);
        Assert.Same(errors, response.Error.Details);
    }

    private sealed record TestData(string Id);
}
