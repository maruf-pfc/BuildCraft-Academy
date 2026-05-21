using System.ComponentModel.DataAnnotations;

namespace VTCLBD.API.DTOs.Cms
{
    public class CreateContentBlockDto
    {
        [Required]
        public string Identifier { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string Type { get; set; } = "Text";
        public bool IsActive { get; set; } = true;
    }
}
