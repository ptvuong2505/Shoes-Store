namespace Application.DTOs.Paging;

public record PagedResult<T>(
    int Page = 0,
    int PageSize = 0,
    int TotalItems = 0,
    int TotalPages = 0,
    List<T>? Items = null);
