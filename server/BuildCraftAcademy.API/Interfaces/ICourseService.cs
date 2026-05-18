using BuildCraftAcademy.API.Common;
using BuildCraftAcademy.API.DTOs.Course;

namespace BuildCraftAcademy.API.Interfaces
{
    public interface ICourseService
    {
        Task<ApiResponse<IEnumerable<CourseResponseDto>>> GetAllCoursesAsync(bool publishedOnly = false);
        Task<ApiResponse<CourseResponseDto>> GetCourseByIdAsync(Guid id);
        Task<ApiResponse<CourseResponseDto>> CreateCourseAsync(CreateCourseDto request);
        Task<ApiResponse<CourseResponseDto>> UpdateCourseAsync(Guid id, UpdateCourseDto request);
        Task<ApiResponse<bool>> DeleteCourseAsync(Guid id);
    }
}
