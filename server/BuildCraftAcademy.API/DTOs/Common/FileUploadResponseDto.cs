namespace BuildCraftAcademy.API.DTOs.Common
{
    public class FileUploadResponseDto
    {
        public string Url { get; set; } = string.Empty;
        public string PublicId { get; set; } = string.Empty;
        public string Format { get; set; } = string.Empty;
    }
}
