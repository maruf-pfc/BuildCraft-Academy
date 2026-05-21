using VTCLBD.API.DTOs.Lesson;
using VTCLBD.API.DTOs.Module;

namespace VTCLBD.API.Interfaces
{
    public interface ICourseModuleService
    {
        Task<IEnumerable<ModuleResponseDto>> GetModulesByCourseAsync(Guid courseId);
        Task<ModuleResponseDto> GetModuleByIdAsync(Guid id);
        Task<ModuleResponseDto> CreateModuleAsync(CreateModuleDto request);
        Task<ModuleResponseDto> UpdateModuleAsync(Guid id, UpdateModuleDto request);
        Task<bool> DeleteModuleAsync(Guid id);

        Task<LessonResponseDto> AddLessonAsync(CreateLessonDto request);
        Task<LessonResponseDto> UpdateLessonAsync(Guid id, UpdateLessonDto request);
        Task<bool> DeleteLessonAsync(Guid id);

        Task<bool> AddResourceLinkAsync(CreateResourceLinkDto request);
        Task<bool> DeleteResourceLinkAsync(Guid id);
    }
}
