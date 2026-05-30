using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VTCLBD.API.DTOs.Job;

namespace VTCLBD.API.Interfaces
{
    public interface IJobService
    {
        Task<IEnumerable<JobResponseDto>> GetAllJobsAsync(bool publishedOnly);
        Task<JobResponseDto> GetJobByIdAsync(Guid id);
        Task<JobResponseDto> CreateJobAsync(CreateJobDto request);
        Task<JobResponseDto> UpdateJobAsync(Guid id, UpdateJobDto request);
        Task<bool> DeleteJobAsync(Guid id);
    }
}
