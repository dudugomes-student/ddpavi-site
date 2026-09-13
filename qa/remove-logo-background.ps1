$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
public static class LogoTransparency {
    public static void Convert(string sourcePath, string outputPath) {
        using (var source = new Bitmap(sourcePath))
        using (var output = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb)) {
            for (int y = 0; y < source.Height; y++) {
                for (int x = 0; x < source.Width; x++) {
                    Color c = source.GetPixel(x, y);
                    int min = Math.Min(c.R, Math.Min(c.G, c.B));
                    int max = Math.Max(c.R, Math.Max(c.G, c.B));
                    // Remove the near-white background and its faint neutral texture.
                    if (min > 235 || (min > 190 && max - min < 25)) {
                        output.SetPixel(x, y, Color.Transparent);
                        continue;
                    }
                    // Unmatte the white in antialiased edges to avoid a white fringe.
                    int alpha = 255 - min;
                    int r = (c.R - min) * 255 / alpha;
                    int g = (c.G - min) * 255 / alpha;
                    int b = (c.B - min) * 255 / alpha;
                    output.SetPixel(x, y, Color.FromArgb(alpha, r, g, b));
                }
            }
            output.Save(outputPath, ImageFormat.Png);
        }
    }
}
'@
$workspace = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $workspace 'assets/img/logo-servicos-integrados.png'
$outputPath = Join-Path $workspace 'assets/img/logo-servicos-integrados-transparente.png'
[LogoTransparency]::Convert($sourcePath, $outputPath)
$image = [System.Drawing.Bitmap]::new($outputPath)
$transparent = 0
$partial = 0
$opaque = 0
for ($y = 0; $y -lt $image.Height; $y += 1) {
    for ($x = 0; $x -lt $image.Width; $x += 1) {
        $alpha = $image.GetPixel($x, $y).A
        if ($alpha -eq 0) { $transparent++ }
        elseif ($alpha -eq 255) { $opaque++ }
        else { $partial++ }
    }
}
if ($transparent -eq 0 -or $opaque -eq 0) { throw 'Invalid alpha channel.' }
[pscustomobject]@{Width=$image.Width;Height=$image.Height;Format=$image.PixelFormat;TransparentPixels=$transparent;EdgePixels=$partial;OpaquePixels=$opaque}
foreach ($name in @('claro','escuro')) {
    $preview = [System.Drawing.Bitmap]::new($image.Width, $image.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($preview)
    $background = if ($name -eq 'claro') { [System.Drawing.Color]::White } else { [System.Drawing.Color]::FromArgb(3,17,31) }
    $graphics.Clear($background)
    $graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)
    $preview.Save((Join-Path $PSScriptRoot "logo-fundo-$name.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $preview.Dispose()
}
$image.Dispose()
