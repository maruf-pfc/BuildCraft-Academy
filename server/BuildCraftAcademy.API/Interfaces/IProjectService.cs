using BuildCraftAcademy.API.DTOs.Project;

namespace BuildCraftAcademy.API.Interfaces
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectResponseDto>> GetAllProjectsAsync(bool publishedOnly = false);
        Task<ProjectResponseDto> GetProjectByIdAsync(Guid id);
        Task<ProjectResponseDto> CreateProjectAsync(CreateProjectDto request);
        Task<ProjectResponseDto> UpdateProjectAsync(Guid id, UpdateProjectDto request);
        Task<bool> DeleteProjectAsync(Guid id);
    }
}
