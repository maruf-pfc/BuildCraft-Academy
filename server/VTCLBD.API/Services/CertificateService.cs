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
            var doc = Document.Create(container =>
            {
                container.Page(page =>
                {
                    // Landscape A4
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(0);

                    page.Content().Element(ComposeContent(request));
                });
            });

            using var ms = new MemoryStream();
            doc.GeneratePdf(ms);
            return ms.ToArray();
        }

        private Action<IContainer> ComposeContent(CertificateRequestDto request)
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

            return c => c
                .Background("#FCFCF9") // Premium soft ivory background
                .DefaultTextStyle(t => t.FontFamily("Helvetica"))
                .Column(col =>
                {
                    // ── Premium Double Border ─────────────────────────────────────────────
                    col.Item().Padding(20).Border(3).BorderColor("#0d4f6b") // Navy outer border
                       .Padding(6).Border(1.5f).BorderColor("#c9a84c") // Gold inner border
                       .Column(inner =>
                       {
                           // ── Header Banner ────────────────────────────────────────────
                           inner.Item()
                               .Background("#0d4f6b")
                               .Padding(18)
                               .Column(header =>
                               {
                                   header.Item().AlignCenter()
                                       .Text("VICTORY TECHNOLOGIES AND CONSTRUCTION LTD")
                                       .FontSize(16)
                                       .Bold()
                                       .FontColor(Colors.White)
                                       .LetterSpacing(0.04f);

                                   header.Item().AlignCenter().PaddingTop(2)
                                       .Text("BuildCraft Academy | Professional Excellence Division")
                                       .FontSize(8.5f)
                                       .FontColor("#a8d8ea")
                                       .LetterSpacing(0.06f);
                               });

                           // ── Gold Divider ─────────────────────────────────────────────
                           inner.Item().Height(3).Background("#c9a84c");

                           // ── Title ────────────────────────────────────────────────────
                           inner.Item().PaddingTop(18).AlignCenter()
                               .Text("CERTIFICATE OF COMPLETION")
                               .FontSize(26)
                               .Bold()
                               .FontColor("#0d4f6b")
                               .LetterSpacing(0.08f);

                           inner.Item().AlignCenter().PaddingTop(3).PaddingBottom(5)
                               .Text("This is to proudly certify that")
                               .FontSize(11)
                               .Italic()
                               .FontColor("#555555");

                           // ── Recipient Name ───────────────────────────────────────────
                           inner.Item().AlignCenter().PaddingVertical(5)
                               .Text(recipientName)
                               .FontSize(32)
                               .Bold()
                               .FontColor("#c9a84c");

                           // ── Decorative Line ──────────────────────────────────────────
                           inner.Item().AlignCenter().Width(280).Height(1.5f).Background("#c9a84c");

                           inner.Item().AlignCenter().PaddingTop(8).PaddingBottom(3)
                               .Text("has successfully completed all requirements of the professional training course")
                               .FontSize(11)
                               .Italic()
                               .FontColor("#555555");

                           // ── Course Title ─────────────────────────────────────────────
                           inner.Item().AlignCenter().PaddingVertical(3)
                               .Text(courseTitle)
                               .FontSize(20)
                               .Bold()
                               .FontColor("#0d4f6b");

                           // ── Footer row with dates, stamp and signature ────────────────
                           inner.Item().PaddingTop(20).PaddingHorizontal(30).Row(row =>
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
                                       .Text("Director, BuildCraft Academy")
                                       .FontSize(10)
                                       .Bold()
                                       .FontColor("#222222");
                               });
                           });

                           // ── Footer Metadata ──────────────────────────────────────────
                           inner.Item().PaddingTop(16)
                               .Background("#f0f8fc")
                               .Padding(6)
                               .AlignCenter()
                               .Text("Eastern Kamalapur Complex, 2nd Floor, Kamalapur, Dhaka 1000  |  +88 01779481486  |  support@vtclbd.com")
                               .FontSize(7.5f)
                               .FontColor("#4a7a8a")
                               .LetterSpacing(0.02f);
                       });
                });
        }
    }
}
