namespace Application.Common.Errors;

public static class ErrorCodes
{
    // Common
    public const string ValidationError = "VALIDATION_ERROR";
    public const string Unauthorized = "UNAUTHORIZED";
    public const string Forbidden = "FORBIDDEN";
    public const string InternalServerError = "INTERNAL_SERVER_ERROR";
    public const string DatabaseError = "DATABASE_ERROR";
    public const string ExternalServiceError = "EXTERNAL_SERVICE_ERROR";

    // Authentication
    public const string InvalidCredentials = "INVALID_CREDENTIALS";
    public const string AccountLocked = "ACCOUNT_LOCKED";
    public const string EmailNotFound = "EMAIL_NOT_FOUND";
    public const string EmailAlreadyRegistered = "EMAIL_ALREADY_REGISTERED";
    public const string PasswordMismatch = "PASSWORD_MISMATCH";
    public const string PasswordChangeFailed = "PASSWORD_CHANGE_FAILED";
    public const string RegistrationFailed = "REGISTRATION_FAILED";
    public const string RefreshTokenMissing = "REFRESH_TOKEN_MISSING";
    public const string InvalidRefreshToken = "INVALID_REFRESH_TOKEN";
    public const string OtpNotFound = "OTP_NOT_FOUND";
    public const string OtpStillValid = "OTP_STILL_VALID";
    public const string OtpExpired = "OTP_EXPIRED";
    public const string OtpAlreadyUsed = "OTP_ALREADY_USED";
    public const string InvalidOtp = "INVALID_OTP";
    public const string OtpVerificationRequired = "OTP_VERIFICATION_REQUIRED";

    // Account
    public const string UserNotFound = "USER_NOT_FOUND";
    public const string InvalidUserId = "INVALID_USER_ID";
    public const string AddressNotFound = "ADDRESS_NOT_FOUND";
    public const string SelectedAddressNotFound = "SELECTED_ADDRESS_NOT_FOUND";

    // Product and inventory
    public const string ProductNotFound = "PRODUCT_NOT_FOUND";
    public const string InvalidProductId = "INVALID_PRODUCT_ID";
    public const string SizeNotFound = "SIZE_NOT_FOUND";
    public const string InventoryNotFound = "INVENTORY_NOT_FOUND";
    public const string InsufficientInventory = "INSUFFICIENT_INVENTORY";

    // Order
    public const string OrderNotFound = "ORDER_NOT_FOUND";
    public const string CheckoutItemsRequired = "CHECKOUT_ITEMS_REQUIRED";

    // Chat
    public const string CustomerNotFound = "CUSTOMER_NOT_FOUND";
    public const string SupportAdminNotFound = "SUPPORT_ADMIN_NOT_FOUND";
    public const string MessageRequired = "MESSAGE_REQUIRED";
}
