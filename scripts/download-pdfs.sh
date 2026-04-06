#!/bin/bash
# Downloads theory, practice, and variants PDFs for OGE math tasks 1-25
# Usage: ./scripts/download-pdfs.sh
# Files are saved as: pdfs/<number>-theory.pdf, <number>-practice.pdf, <number>-variants.pdf

set -e

BASE="https://vpr-ege.ru"
OUT="pdfs"
mkdir -p "$OUT"

download() {
  local num="$1" type="$2" path="$3"
  local filename="${OUT}/${num}-${type}.pdf"
  if [ -f "$filename" ]; then
    echo "  SKIP $filename (already exists)"
    return
  fi
  echo "  GET  $filename"
  curl -sL -o "$filename" "${BASE}${path}"
  if [ ! -s "$filename" ] || file "$filename" | grep -qv PDF; then
    echo "  WARN $filename may not be a valid PDF"
  fi
}

echo "=== Tasks 1-5 (combined) ==="
download "1-5" "theory"   "/images/oge/oge2021-ma-list-teor.pdf"
download "1-5" "practice"  "/images/oge/oge2021-ma-list-practika.pdf"
download "1-5" "variants"  "/zagruzki/prakticheskie-oge-ma.pdf"

echo "=== Task 6 ==="
download "6" "theory"   "/images/oge/zad6teor.pdf"
download "6" "practice"  "/images/oge/oge-ma-shir-zad6.pdf"
download "6" "variants"  "/zagruzki/zad6-math100.pdf"

echo "=== Task 7 ==="
download "7" "theory"   "/zagruzki/zad7-oge-ma-shir.pdf"
download "7" "practice"  "/zagruzki/zad7-oge-ma-math100.pdf"
download "7" "variants"  "/zagruzki/zad7-oge-mat1.pdf"

echo "=== Task 8 ==="
download "8" "theory"   "/images/oge/zad8-oge-ma-shir-t.pdf"
download "8" "practice"  "/images/oge/zad8-oge-ma-shir-p.pdf"
download "8" "variants"  "/zagruzki/oge-8ma.pdf"

echo "=== Task 9 ==="
download "9" "theory"   "/images/oge/9-shir-t.pdf"
download "9" "practice"  "/images/oge/9-shir.pdf"
download "9" "variants"  "/zagruzki/oge25-marakulin-9.pdf"

echo "=== Task 10 ==="
download "10" "theory"   "/images/oge/10-oge-ma-shir-t.pdf"
download "10" "practice"  "/images/oge/10-oge-ma-shir.pdf"
download "10" "variants"  "/zagruzki/oge25-marakulin-10.pdf"

echo "=== Task 11 ==="
download "11" "theory"   "/images/oge/11-oge-shir-t.pdf"
download "11" "practice"  "/images/oge/11-oge-shir.pdf"
download "11" "variants"  "/zagruzki/oge25-marakulin-11.pdf"

echo "=== Task 12 ==="
download "12" "theory"   "/images/oge/12-oge-shir-t.pdf"
download "12" "practice"  "/images/oge/12-oge-shir-p.pdf"
download "12" "variants"  "/zagruzki/oge25-marakulin-12.pdf"

echo "=== Task 13 ==="
download "13" "theory"   "/images/oge/13-oge-shir-t.pdf"
download "13" "practice"  "/images/oge/13-oge-shir-p.pdf"
download "13" "variants"  "/zagruzki/oge25-marakulin-13.pdf"

echo "=== Task 14 ==="
download "14" "theory"   "/images/oge/14-oge-shir-t.pdf"
download "14" "practice"  "/images/oge/14-oge-shir-p.pdf"
download "14" "variants"  "/z6/Zadanie_14_OGE_2026_FIPI.pdf"

echo "=== Task 15 ==="
download "15" "theory"   "/images/oge/15-oge-shir-t.pdf"
download "15" "practice"  "/images/oge/15-oge-shir-p.pdf"
download "15" "variants"  "/zagruzki/oge25-zad15.pdf"

echo "=== Task 16 ==="
download "16" "theory"   "/images/oge/16-oge-shir-t.pdf"
download "16" "practice"  "/images/oge/16-oge-shir-p.pdf"
download "16" "variants"  "/images/oge/oge2020-ma-okr-mnoug-1.pdf"

echo "=== Task 17 ==="
download "17" "theory"   "/images/oge/17-oge-shir-t.pdf"
download "17" "practice"  "/images/oge/17-oge-shir-p.pdf"
download "17" "variants"  "/images/oge/oge2020-ma-ploch-4u-1.pdf"

echo "=== Task 18 ==="
download "18" "theory"   "/images/oge/18-oge-shir-t.pdf"
download "18" "practice"  "/images/oge/18-oge-shir-p.pdf"
download "18" "variants"  "/images/oge/oge2020-ma-kv-resh-mnoug-1.pdf"

echo "=== Task 19 ==="
download "19" "theory"   "/images/oge/oge25-math4skill-19-t.pdf"
download "19" "practice"  "/images/oge/oge25-math4skill-19.pdf"
download "19" "variants"  "/images/oge/oge-ma-zadanie19-1.pdf"

echo "=== Task 20 ==="
download "20" "theory"   "/z6/Zadanie_20-ma-o6.pdf"
download "20" "practice"  "/z6/Prototipy_FIPI_OGE_20.pdf"
download "20" "variants"  "/z5/o5-ma-sz20-22.pdf"

echo "=== Task 21 ==="
download "21" "theory"   "/z5/o5ma21y.pdf"
download "21" "practice"  "/z5/o5ma21.pdf"
download "21" "variants"  "/z6/21_Prototipy.pdf"

echo "=== Task 22 ==="
download "22" "theory"   "/images/oge/oge2021-ma-11-22-grf-1.pdf"
download "22" "practice"  "/images/oge/22-oge-shir-p.pdf"
download "22" "variants"  "/images/oge/22-1-oge-math100.pdf"

echo "=== Task 23 ==="
download "23" "theory"   "/z6/Primer_oformlenia_OGE_23-4.pdf"
download "23" "practice"  "/z6/o6-ma-23pr.pdf"
download "23" "variants"  "/images/oge/23-1-oge-math100.pdf"

echo "=== Task 24 ==="
download "24" "theory"   "/z6/OGE_nomer_24.pdf"
download "24" "practice"  "/images/oge/24-oge-shir-p.pdf"
download "24" "variants"  "/images/oge/24-1-oge-math100.pdf"

echo "=== Task 25 ==="
download "25" "theory"   "/z6/e6-Zadanie_25_Ravnobedrennaya_trapetsia.pdf"
download "25" "practice"  "/images/oge/25-oge-shir-p.pdf"
download "25" "variants"  "/z5/o5-ma-sz23-25.pdf"

echo ""
echo "Done! Downloaded to ./$OUT/"
ls -lh "$OUT"/*.pdf 2>/dev/null | wc -l | xargs -I{} echo "{} PDF files total"
