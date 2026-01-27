
$map = @{
    "ï¿½" = "";
    "Ã³" = "ó";
    "Ãº" = "ú";
    "Ã¡" = "á";
    "Ã©" = "é";
    "Ã­" = "í";
    "Ã§" = "ç";
    "Ã£" = "ã";
    "Ãª" = "ê";
    "Ãµ" = "õ";
    "Ã€" = "À"
}

$green = "#00C853"

Get-ChildItem -Path "." -Recurse -Include *.tsx,*.html,*.css -Exclude node_modules,*dist* | ForEach-Object {
    if ($_.FullName -match "node_modules") { return }
    $path = $_.FullName
    try {
        $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
        $original = $content

        foreach ($key in $map.Keys) {
            if ($content.Contains($key)) {
                $content = $content.Replace($key, $map[$key])
            }
        }

        $yellows = @("#FFD814", "#FFC107", "#F7CA00", "#FCD200", "#FEF9E7", "#E77600")
        foreach ($y in $yellows) {
            if ($content.Contains($y)) {
                $content = $content.Replace($y, $green)
            }
        }

        if ($content -ne $original) {
            [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Processado: $path" -ForegroundColor Green
        }
    } catch {
        Write-Host "Erro: $path"
    }
}
