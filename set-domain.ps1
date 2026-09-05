# 换网址用。把 index.html、sitemap.xml、robots.txt、llms.txt 里现在的站点地址整体换成新的，可以反复运行。
# 用法（在本目录打开 PowerShell）：
#   .\set-domain.ps1 -Domain https://www.你的域名.com
# 如果站点放在子目录（比如 https://xxx.github.io/ai-jiedan），把完整路径传进来，末尾不要加斜杠。

param(
  [Parameter(Mandatory = $true)]
  [string]$Domain
)

$Domain = $Domain.TrimEnd('/')
if ($Domain -notmatch '^https?://') {
  Write-Error "请带上 https:// 前缀，例如 https://www.example.cn"
  exit 1
}

$indexPath = Join-Path $PSScriptRoot 'index.html'
$index = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
$m = [regex]::Match($index, '<link rel="canonical" href="([^"]+?)/?"')
if (-not $m.Success) {
  Write-Error "index.html 里找不到 canonical 标签，无法确定当前地址"
  exit 1
}
$current = $m.Groups[1].Value.TrimEnd('/')
if ($current -eq $Domain) {
  Write-Output "当前地址已经是 $Domain，无需修改"
  exit 0
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$files = @('index.html', 'sitemap.xml', 'robots.txt', 'llms.txt')

foreach ($name in $files) {
  $path = Join-Path $PSScriptRoot $name
  if (-not (Test-Path $path)) { continue }
  $text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
  $count = ([regex]::Matches($text, [regex]::Escape($current))).Count
  $text = $text.Replace($current, $Domain)
  [System.IO.File]::WriteAllText($path, $text, $utf8NoBom)
  Write-Output ("{0}: 替换了 {1} 处" -f $name, $count)
}

Write-Output "完成：$current -> $Domain"
Write-Output "上线后到 百度搜索资源平台 / Google Search Console / Bing Webmaster 提交 $Domain/sitemap.xml"
