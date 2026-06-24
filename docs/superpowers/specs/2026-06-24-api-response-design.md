# API Response Design

## Scope

This phase introduces a shared response envelope for the ShoesStore backend. It does not add exception middleware, Serilog, or migrate controllers yet.

## Contract

All JSON API responses will eventually use `ApiResponse<T>`:

- `Success` identifies successful and failed responses.
- `StatusCode` mirrors the HTTP response status.
- `Message` is suitable for display but is not a stable frontend identifier.
- `Data` contains successful response data and is `null` for failures.
- `Error` contains a stable error code and optional field-level details.

`TraceId` and `Timestamp` are intentionally excluded from the public response. Request trace identifiers remain internal logging properties.

## Factory methods

`ApiResponse<T>` provides:

- `Ok(data, message)` for HTTP 200.
- `Created(data, message)` for HTTP 201.
- `SuccessResponse(statusCode, data, message)` for other successful HTTP statuses.
- `Fail(statusCode, errorCode, message, details)` for failures.
- `Validation(errors, message)` for HTTP 400 field validation failures.

Factories enforce these invariants:

- Successful responses have `Success = true` and `Error = null`.
- Failed responses have `Success = false`, `Data = null`, and a non-null `Error`.
- Validation errors use the stable code `VALIDATION_ERROR`.

## Placement

The types belong in `Application/Common/Responses` because controllers, middleware, and future non-HTTP application entry points can share the contract without making Application depend on API.

