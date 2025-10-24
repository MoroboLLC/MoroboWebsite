# URL Structure Update Script
# This updates all links to use clean URLs without .html extensions

Write-Host "Updating URL structure for clean URLs..." -ForegroundColor Cyan

# Update main pages
Write-Host "Updating main index.html..." -ForegroundColor Yellow
(Get-Content "index.html") -replace 'apps/indecision/index\.html', 'apps/indecision/' -replace 'apps/motonia/index\.html', 'apps/motonia/' | Set-Content "index.html"

# Update apps.html
Write-Host "Updating apps.html..." -ForegroundColor Yellow
(Get-Content "apps.html") -replace 'apps/indecision/index\.html', 'apps/indecision/' -replace 'apps/indecision/support\.html', 'apps/indecision/support/' -replace 'apps/motonia/index\.html', 'apps/motonia/' -replace 'apps/motonia/support\.html', 'apps/motonia/support/' | Set-Content "apps.html"

# Update Motonia pages
Write-Host "Updating Motonia app pages..." -ForegroundColor Yellow
(Get-Content "apps\motonia\index.html") -replace 'support\.html', 'support/' -replace 'legal/privacy-policy\.html', 'privacypolicy/' | Set-Content "apps\motonia\index.html"

# Update support pages
Write-Host "Updating support pages..." -ForegroundColor Yellow
(Get-Content "apps\indecision\support\index.html") -replace 'legal/privacy-policy\.html', '../privacypolicy/' -replace '\.\./', '../../' | Set-Content "apps\indecision\support\index.html"

(Get-Content "apps\motonia\support\index.html") -replace 'legal/privacy-policy\.html', '../privacypolicy/' -replace '\.\./', '../../' | Set-Content "apps\motonia\support\index.html"

# Update privacy policy pages
Write-Host "Updating privacy policy pages..." -ForegroundColor Yellow
(Get-Content "apps\indecision\privacypolicy\index.html") -replace '\.\./index\.html', '../../indecision/' -replace '\.\./support\.html', '../../indecision/support/' -replace '\.\./', '../../../' | Set-Content "apps\indecision\privacypolicy\index.html"

(Get-Content "apps\motonia\privacypolicy\index.html") -replace '\.\./index\.html', '../../motonia/' -replace '\.\./support\.html', '../../motonia/support/' -replace '\.\./', '../../../' | Set-Content "apps\motonia\privacypolicy\index.html"

Write-Host "URL structure updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "New URL Structure:" -ForegroundColor Cyan
Write-Host "  morobo.org/apps/indecision/" -ForegroundColor White
Write-Host "  morobo.org/apps/indecision/support/" -ForegroundColor White
Write-Host "  morobo.org/apps/indecision/privacypolicy/" -ForegroundColor White
Write-Host "  morobo.org/apps/motonia/" -ForegroundColor White
Write-Host "  morobo.org/apps/motonia/support/" -ForegroundColor White
Write-Host "  morobo.org/apps/motonia/privacypolicy/" -ForegroundColor White
