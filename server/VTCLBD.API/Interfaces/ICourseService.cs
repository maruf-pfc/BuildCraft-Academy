using VTCLBD.API.DTOs.Course;

namespace VTCLBD.API.Interfaces
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseResponseDto>> GetAllCoursesAsync(bool publishedOnly = false);
        Task<CourseResponseDto> GetCourseByIdAsync(Guid id);
        Task<CourseResponseDto> CreateCourseAsync(CreateCourseDto request);
        Task<CourseResponseDto> UpdateCourseAsync(Guid id, UpdateCourseDto request);
        Task<bool> DeleteCourseAsync(Guid id);
    }
}
