@echo off
TITLE Kaushal-Drishti / Centre Sentinel - Production Services Runner
echo =====================================================================
echo    KAUSHAL-DRISHTI / CENTRE SENTINEL (MSDE Problem ID 26245)
echo    Starting Multi-Tier Production Environment
echo =====================================================================
echo.

echo [1/2] Launching Python FastAPI Edge Agent on http://localhost:8000...
start "Kaushal Edge Agent (FastAPI)" cmd /k "cd /d %~dp0edge-agent && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak > nul

echo [2/2] Launching Next.js 14 Production Dashboard on http://localhost:3000...
start "Kaushal SMU Dashboard (Next.js)" cmd /k "cd /d %~dp0frontend && npm run start"

echo.
echo =====================================================================
echo    ALL SERVICES RUNNING:
echo    - Executive Dashboard:   http://localhost:3000
echo    - Edge Inference API:    http://localhost:8000
echo    - API Documentation:     http://localhost:8000/docs
echo =====================================================================
echo.
pause
