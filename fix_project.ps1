
$map = @{
    "ï¿½" = "";
    "ðŸ‡¦ðŸ‡´" = "🇦🇴";
    "Ã³" = "ó";
    "Ãº" = "ú";
    "Ã¡" = "á";
    "Ã©" = "é";
    "Ã­" = "í";
    "Ã§" = "ç";
    "Ã£" = "ã";
    "Ãª" = "ê";
    "Ãµ" = "õ";
    "Ã€" = "À";
    "ðŸ”’" = "🔒";
    "ðŸ’°" = "💰";
    "ðŸš€" = "🚀"
}

$green = "#00C853"
$primaryGreen = "#1B5E20"

Get-ChildItem -Path "." -Recurse -Include *.tsx,*.html,*.css | ForEach-Object {
    $path = $_.FullName
    try {
        $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
        $original = $content

        # Fix Encoding
        foreach ($key in $map.Keys) {
            if ($content.Contains($key)) {
                $content = $content.Replace($key, $map[$key])
            }
        }

        # Fix Colors (Yellow to Green)
        $yellows = @("#FFD814", "#FFC107", "#F7CA00", "#FCD200", "#FEF9E7", "#E77600")
        foreach ($y in $yellows) {
            $content = $content.Replace($y, $green)
        }

        # Ensure icons are green
        # Match material icons and add/replace color classes
        if ($content.Contains("material-symbols-outlined")) {
            # This is a bit complex for a simple replace, but let's target common patterns
            $content = $content.Replace("text-amber-500", "text-[#00C853]")
            $content = $content.Replace("text-yellow-600", "text-[#00C853]")
        }

        if ($content -ne $original) {
            [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Processado: $path" -ForegroundColor Green
        }
    } catch {
        Write-Host "Erro ao processar $path : $_" -ForegroundColor Red
    }
}
