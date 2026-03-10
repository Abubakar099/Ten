$root = (Get-Location).Path
$files = Get-ChildItem -Recurse -Filter *.html -File

function Convert-Value([string]$val, [string]$prefix, [string]$rootPrefix) {
  if ([string]::IsNullOrWhiteSpace($val)) { return $val }

  # Skip anchors and special schemes
  $lower = $val.ToLowerInvariant()
  if ($lower.StartsWith('#') -or $lower.StartsWith('mailto:') -or $lower.StartsWith('tel:') -or $lower.StartsWith('javascript:') -or $lower.StartsWith('data:') -or $lower.StartsWith('http://') -or $lower.StartsWith('https://')) {
    return $val
  }

  # Handle protocol-relative internal links like //get-started/
  if ($val.StartsWith('//')) {
    $rest = $val.Substring(2)
    $hostName = $rest.Split('/',2)[0]
    if ($hostName -match '\.') { return $val }
    $val = '/' + $rest
  }

  if ($val -eq '/') { return $rootPrefix }

  if ($val.StartsWith('/')) {
    return $prefix + $val.TrimStart('/')
  }

  return $val
}

foreach ($f in $files) {
  $rel = $f.FullName.Substring($root.Length).TrimStart('\','/')
  $dir = Split-Path -Parent $rel
  $depth = 0
  if ($dir -and $dir -ne '.') { $depth = ($dir -split '[\\/]').Count }
  $prefix = if ($depth -eq 0) { '' } else { '../' * $depth }
  $rootPrefix = if ($depth -eq 0) { './' } else { '../' * $depth }

  $text = Get-Content -Raw -Path $f.FullName
  $pattern = "(?i)\b(href|src|data-url)=(`"`|')([^`"`']*)(\2)"
  $text2 = [regex]::Replace($text, $pattern, {
      param($m)
      $attr = $m.Groups[1].Value
      $quote = $m.Groups[2].Value
      $val = $m.Groups[3].Value
      $newVal = Convert-Value $val $prefix $rootPrefix
      return "$attr=$quote$newVal$quote"
    })

  if ($text2 -ne $text) {
    Set-Content -Path $f.FullName -Value $text2
  }
}
