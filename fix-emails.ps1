# Fix all email addresses to morobo.llc@gmail.com
$files = Get-ChildItem -Path . -Recurse -Include *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $updated = $content `
        -replace 'hello@morobo\.com', 'morobo.llc@gmail.com' `
        -replace 'privacy@morobo\.com', 'morobo.llc@gmail.com' `
        -replace 'support@morobo\.com', 'morobo.llc@gmail.com' `
        -replace 'motonia@morobo\.com', 'morobo.llc@gmail.com'
    
    if ($content -ne $updated) {
        Set-Content -Path $file.FullName -Value $updated -NoNewline
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
    }
}

Write-Host "`nAll emails updated to morobo.llc@gmail.com!" -ForegroundColor Cyan
