$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$scriptPath = Join-Path $projectRoot "scripts\update_pricing_data.py"
$bundledPython = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if (Test-Path $bundledPython) {
  & $bundledPython $scriptPath
  exit $LASTEXITCODE
}

if (Get-Command py -ErrorAction SilentlyContinue) {
  & py -3 $scriptPath
  exit $LASTEXITCODE
}

if (Get-Command python -ErrorAction SilentlyContinue) {
  & python $scriptPath
  exit $LASTEXITCODE
}

Write-Error "Não encontrei um Python disponível para atualizar os preços. Use o Python do Codex ou me peça para sincronizar a planilha."
