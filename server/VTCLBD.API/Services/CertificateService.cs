using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using VTCLBD.API.Models;

namespace VTCLBD.API.Services
{
    public interface ICertificateService
    {
        Task<byte[]> GenerateAsync(CertificateRequestDto request);
    }

    public class CertificateService : ICertificateService
    {
        public CertificateService()
        {
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public Task<byte[]> GenerateAsync(CertificateRequestDto request)
        {
            var pdf = BuildPdf(request);
            return Task.FromResult(pdf);
        }

        private byte[] BuildPdf(CertificateRequestDto request)
        {
            var recipientName = string.IsNullOrWhiteSpace(request.RecipientName)
                ? "Recipient"
                : request.RecipientName;

            var courseTitle = string.IsNullOrWhiteSpace(request.CourseTitle)
                ? "Professional Training Program"
                : request.CourseTitle;

            var certNumber = string.IsNullOrWhiteSpace(request.CertificateNumber)
                ? ""
                : request.CertificateNumber;

            var issuedDate = request.IssuedAt.ToString("MMMM dd, yyyy");

            var doc = Document.Create(container =>
            {
                container.Page(page =>
                {
                    // Landscape A4
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(36);
                    page.DefaultTextStyle(t => t.FontFamily("Helvetica"));

                    page.Background()
                        .Padding(20)
                        .Border(3)
                        .BorderColor("#0d4f6b") // Navy outer border
                        .Padding(6)
                        .Border(1.5f)
                        .BorderColor("#c9a84c") // Gold inner border
                        .Background("#FCFCF9"); // Premium soft ivory background color

                    // ── Header Banner ────────────────────────────────────────────
                    page.Header()
                        .Background("#0d4f6b")
                        .Padding(18)
                        .Column(header =>
                        {
                            header.Item().AlignCenter()
                                .Text("VICTORY DESIGN & CONSTRUCTION LTD")
                                .FontSize(16)
                                .Bold()
                                .FontColor(Colors.White)
                                .LetterSpacing(0.04f);

                            header.Item().AlignCenter().PaddingTop(2)
                                .Text("Professional Excellence & Training Division")
                                .FontSize(8.5f)
                                .FontColor("#a8d8ea")
                                .LetterSpacing(0.06f);
                        });

                    // ── Main Content Area ─────────────────────────────────────────
                    page.Content()
                        .Column(col =>
                        {
                            // ── Gold Divider ─────────────────────────────────────────────
                            col.Item().Height(3).Background("#c9a84c");

                            // ── Main Body (fills the remaining space between header and footer)
                            col.Item().ExtendVertical().AlignMiddle().Column(midCol =>
                            {
                                midCol.Item().AlignCenter()
                                    .Text("CERTIFICATE OF COMPLETION")
                                    .FontSize(24)
                                    .Bold()
                                    .FontColor("#0d4f6b")
                                    .LetterSpacing(0.08f);

                                midCol.Item().AlignCenter().PaddingTop(4).PaddingBottom(6)
                                    .Text("This is to proudly certify that")
                                    .FontSize(11)
                                    .Italic()
                                    .FontColor("#555555");

                                // ── Recipient Name ───────────────────────────────────────────
                                midCol.Item().AlignCenter().PaddingVertical(4)
                                    .Text(recipientName)
                                    .FontSize(30)
                                    .Bold()
                                    .FontColor("#c9a84c");

                                // ── Decorative Line ──────────────────────────────────────────
                                midCol.Item().AlignCenter().Width(240).Height(1.5f).Background("#c9a84c");

                                midCol.Item().AlignCenter().PaddingTop(8).PaddingBottom(4)
                                    .Text("has successfully completed all requirements of the professional training course")
                                    .FontSize(11)
                                    .Italic()
                                    .FontColor("#555555");

                                // ── Course Title ─────────────────────────────────────────────
                                midCol.Item().AlignCenter().PaddingVertical(2)
                                    .Text(courseTitle)
                                    .FontSize(18)
                                    .Bold()
                                    .FontColor("#0d4f6b");
                            });
                        });

                    // ── Footer ────────────────────────────────────────────────────
                    page.Footer()
                        .Column(footer =>
                        {
                            // ── Footer row with dates, stamp and signature ────────────────
                            footer.Item().PaddingBottom(12).PaddingHorizontal(30).Row(row =>
                            {
                                // Issue Date
                                row.RelativeItem().Column(lc =>
                                {
                                    lc.Item()
                                        .Text("Date of Issue")
                                        .FontSize(8)
                                        .Bold()
                                        .FontColor("#888888")
                                        .LetterSpacing(0.05f);
                                    lc.Item().Height(1).Background("#c9a84c");
                                    lc.Item().PaddingTop(3)
                                        .Text(issuedDate)
                                        .FontSize(10)
                                        .Bold()
                                        .FontColor("#222222");
                                });

                                // Verified Stamp in the center
                                row.RelativeItem().AlignCenter().Column(cc =>
                                {
                                    cc.Item().AlignCenter()
                                        .Text("★   VTCLBD   ★")
                                        .FontSize(11)
                                        .Bold()
                                        .FontColor("#c9a84c");

                                    if (!string.IsNullOrEmpty(certNumber))
                                    {
                                        cc.Item().AlignCenter().PaddingTop(2)
                                            .Text($"Cert No: {certNumber}")
                                            .FontSize(7.5f)
                                            .FontColor("#777777")
                                            .LetterSpacing(0.03f);
                                    }
                                });

                                // Signature
                                row.RelativeItem().AlignRight().Column(rc =>
                                {
                                    rc.Item().AlignRight()
                                        .Text("Authorised By")
                                        .FontSize(8)
                                        .Bold()
                                        .FontColor("#888888")
                                        .LetterSpacing(0.05f);
                                    rc.Item().AlignRight().Height(1).Background("#c9a84c");
                                    rc.Item().AlignRight().PaddingTop(3)
                                        .Text("Director, Victory Design & Construction Ltd")
                                        .FontSize(10)
                                        .Bold()
                                        .FontColor("#222222");
                                });
                            });

                            // ── Footer Metadata ──────────────────────────────────────────
                            footer.Item()
                                .Background("#f0f8fc")
                                .Padding(5)
                                .AlignCenter()
                                .Text("Eastern Kamalapur Complex, 2nd Floor, Kamalapur, Dhaka 1000  |  +88 01779481486  |  support@vtclbd.com")
                                .FontSize(7.5f)
                                .FontColor("#4a7a8a")
                                .LetterSpacing(0.02f);
                        });
                });
            });

            using var ms = new MemoryStream();
            doc.GeneratePdf(ms);
            return ms.ToArray();
        }
    }
}
