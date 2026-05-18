using BuildCraftAcademy.API.Common;
using BuildCraftAcademy.API.Common.Exceptions;
using System.Net;
using System.Text.Json;

namespace BuildCraftAcademy.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                await HandleExceptionAsync(context, ex, _env);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception, IHostEnvironment env)
        {
            context.Response.ContentType = "application/json";

            var statusCode = (int)HttpStatusCode.InternalServerError;
            var message = "An unexpected error occurred.";
            var errors = new List<string>();

            switch (exception)
            {
                case ApiException e:
                    statusCode = e.StatusCode;
                    message = e.Message;
                    break;
                case NotFoundException e:
                    statusCode = (int)HttpStatusCode.NotFound;
                    message = e.Message;
                    break;
                default:
                    if (env.IsDevelopment())
                    {
                        errors.Add(exception.Message);
                        errors.Add(exception.StackTrace ?? string.Empty);
                    }
                    else
                    {
                        errors.Add("A server error occurred.");
                    }
                    break;
            }

            context.Response.StatusCode = statusCode;

            var response = ApiResponse<object>.FailureResponse(message, errors.Any() ? errors : null);
            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

            return context.Response.WriteAsync(json);
        }
    }
}
