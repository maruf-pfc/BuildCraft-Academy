using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using VTCLBD.API.Common.Exceptions;
using VTCLBD.API.DTOs.Auth;
using VTCLBD.API.Helpers;
using VTCLBD.API.Models;
using VTCLBD.API.Services;
using Xunit;

namespace VTCLBD.Tests
{
    public class AuthServiceTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<RoleManager<IdentityRole>> _mockRoleManager;
        private readonly JwtHelper _jwtHelper;
        private readonly AuthService _authService;
        private readonly List<ApplicationUser> _usersList;

        public AuthServiceTests()
        {
            _usersList = new List<ApplicationUser>();

            // Mock User Store & User Manager
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(
                userStoreMock.Object, null, null, null, null, null, null, null, null);

            // Mock Role Store & Role Manager
            var roleStoreMock = new Mock<IRoleStore<IdentityRole>>();
            _mockRoleManager = new Mock<RoleManager<IdentityRole>>(
                roleStoreMock.Object, null, null, null, null);

            // Mock Configuration for JwtHelper
            var inMemorySettings = new Dictionary<string, string> {
                {"Jwt:Key", "SuperSecretKeyForVictoryTechnologiesAndConstructionLtd123!"},
                {"Jwt:Issuer", "VTCLBD.API"},
                {"Jwt:Audience", "VTCLBD.Client"},
                {"Jwt:ExpireDays", "7"}
            };
            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings!)
                .Build();

            _jwtHelper = new JwtHelper(configuration);
            _authService = new AuthService(_mockUserManager.Object, _mockRoleManager.Object, _jwtHelper);
        }

        [Fact]
        public async Task LoginAsync_WithValidCredentials_ReturnsAuthResponse()
        {
            // Arrange
            var testUser = new ApplicationUser
            {
                Email = "test@example.com",
                UserName = "test@example.com",
                FullName = "Test User",
                IsActive = true
            };

            _mockUserManager.Setup(m => m.FindByEmailAsync("test@example.com"))
                .ReturnsAsync(testUser);
            _mockUserManager.Setup(m => m.CheckPasswordAsync(testUser, "Password123!"))
                .ReturnsAsync(true);
            _mockUserManager.Setup(m => m.GetRolesAsync(testUser))
                .ReturnsAsync(new List<string> { "User" });

            var loginRequest = new LoginRequestDto
            {
                Email = "test@example.com",
                Password = "Password123!"
            };

            // Act
            var result = await _authService.LoginAsync(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test@example.com", result.Email);
            Assert.Equal("Test User", result.FullName);
            Assert.Equal("User", result.Role);
            Assert.False(string.IsNullOrEmpty(result.Token));
        }

        [Fact]
        public async Task LoginAsync_WithInactiveUser_ThrowsForbiddenException()
        {
            // Arrange
            var testUser = new ApplicationUser
            {
                Email = "inactive@example.com",
                UserName = "inactive@example.com",
                FullName = "Inactive User",
                IsActive = false
            };

            _mockUserManager.Setup(m => m.FindByEmailAsync("inactive@example.com"))
                .ReturnsAsync(testUser);

            var loginRequest = new LoginRequestDto
            {
                Email = "inactive@example.com",
                Password = "Password123!"
            };

            // Act & Assert
            var exception = await Assert.ThrowsAsync<ApiException>(() => _authService.LoginAsync(loginRequest));
            Assert.Equal(403, exception.StatusCode);
            Assert.Contains("deactivated", exception.Message);
        }

        [Fact]
        public async Task GoogleLoginAsync_NewUser_RegistersAndReturnsToken()
        {
            // Arrange
            _mockUserManager.Setup(m => m.FindByEmailAsync("google@example.com"))
                .ReturnsAsync((ApplicationUser?)null);

            _mockUserManager.Setup(m => m.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            _mockRoleManager.Setup(r => r.RoleExistsAsync("User"))
                .ReturnsAsync(true);

            _mockUserManager.Setup(m => m.AddToRoleAsync(It.IsAny<ApplicationUser>(), "User"))
                .ReturnsAsync(IdentityResult.Success);

            _mockUserManager.Setup(m => m.GetRolesAsync(It.IsAny<ApplicationUser>()))
                .ReturnsAsync(new List<string> { "User" });

            var googleRequest = new GoogleLoginRequestDto
            {
                Email = "google@example.com",
                FullName = "Google User",
                IdToken = "valid-google-oauth-token-12345"
            };

            // Act
            var result = await _authService.GoogleLoginAsync(googleRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("google@example.com", result.Email);
            Assert.Equal("Google User", result.FullName);
            Assert.Equal("User", result.Role);
            Assert.False(string.IsNullOrEmpty(result.Token));
        }

        [Fact]
        public async Task GoogleLoginAsync_EmptyToken_ThrowsBadRequest()
        {
            // Arrange
            var googleRequest = new GoogleLoginRequestDto
            {
                Email = "google@example.com",
                FullName = "Google User",
                IdToken = ""
            };

            // Act & Assert
            var exception = await Assert.ThrowsAsync<ApiException>(() => _authService.GoogleLoginAsync(googleRequest));
            Assert.Equal(400, exception.StatusCode);
            Assert.Contains("Invalid Google", exception.Message);
        }
    }
}
