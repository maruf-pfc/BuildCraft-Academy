namespace VTCLBD.API.DTOs.Payment
{
    public class SSLCommerzSessionResponse
    {
        public string Status { get; set; } = string.Empty;
        public string Sessionkey { get; set; } = string.Empty;
        public string GatewayPageURL { get; set; } = string.Empty;
        public string Failedreason { get; set; } = string.Empty;
    }

    public class SSLCommerzValidationResponse
    {
        public string Status { get; set; } = string.Empty;
        public string Tran_id { get; set; } = string.Empty;
        public string Val_id { get; set; } = string.Empty;
        public string Amount { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
    }
}
