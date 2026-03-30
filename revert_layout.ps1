$content = Get-Content 'h:\Analysis\saajiidi.github.io\index.html' -Raw
# Remove sidebar aside
$content = $content -replace '(?s)  <aside class="tactical-sidebar" id="fileTreeSidebar">.*?</aside>\s*', ''
# Remove main wrapper tags but keep inner content
$content = $content -replace '  <main class="main-content-wrapper">\r?\n\s*', ''
$content = $content -replace '\s*</main>\s*<!-- Sidebar Toggle', "`n`n  <!-- Sidebar Toggle"
# Remove sidebar toggle button
$content = $content -replace '(?s)  <!-- Sidebar Toggle \(Mobile Only\) -->.*?  </button>', ''
# Fix double HR
$content = $content -replace '(?s)    <hr class="m-0 border-secondary opacity-10">\s*<hr class="m-0 border-secondary opacity-10">', '    <hr class="m-0 border-secondary opacity-10">'

$content | Set-Content 'h:\Analysis\saajiidi.github.io\index.html'
