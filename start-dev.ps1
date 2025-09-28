# Script para iniciar o servidor de desenvolvimento com variáveis de ambiente
$env:DATABASE_URL="postgresql://postgres.zdgcstskzmkluylxfymb:eDcMlmRSjLxnpzgp@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
$env:DIRECT_URL="postgresql://postgres.zdgcstskzmkluylxfymb:eDcMlmRSjLxnpzgp@aws-1-eu-west-2.pooler.supabase.com:5432/postgres"
$env:NEXT_PUBLIC_SUPABASE_URL="https://zdgcstskzmkluylxfymb.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZ2NzdHNrem1rbHV5bHhmeW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NzA1NTAsImV4cCI6MjA3NDE0NjU1MH0.KxDlxTdU3WMpATSeNjgU5RuHp0PSq8er8kssnl427rc"

Write-Host "Variáveis de ambiente definidas. Iniciando servidor..."
npm run dev
