namespace Application.DTOs.Product;

public record FiltersDto(List<string> Genders, List<string> Brands, List<int> Sizes);
