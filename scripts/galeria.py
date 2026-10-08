#!/usr/bin/env python3
"""Lee fotos/galeria/ y escribe assets/js/galeria.js con la lista de fotos y su tamaño.
GitHub lo corre solo en cada publicación; no hace falta tocarlo.
El tamaño sirve para apartar el espacio de cada foto antes de que cargue."""
import json, os, shutil, subprocess, unicodedata

raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
carpeta = os.path.join(raiz, "fotos", "galeria")
ext = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif")


def medidas(ruta):
    try:
        from PIL import Image, ImageOps
        with Image.open(ruta) as im:
            im = ImageOps.exif_transpose(im)
            return im.size
    except Exception:
        pass
    try:
        if shutil.which("identify"):
            out = subprocess.run(["identify", "-auto-orient", "-format", "%w %h", ruta + "[0]"],
                                 capture_output=True, text=True, timeout=30).stdout.split()
            return int(out[0]), int(out[1])
        if shutil.which("sips"):
            out = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", ruta],
                                 capture_output=True, text=True, timeout=30).stdout
            nums = [int(l.split(":")[1]) for l in out.splitlines() if "pixel" in l]
            return nums[0], nums[1]
    except Exception:
        pass
    return None


nombres = sorted(n for n in os.listdir(carpeta) if n.lower().endswith(ext)) if os.path.isdir(carpeta) else []
# Una foto con acentos puede existir dos veces con el mismo nombre escrito distinto (Mac vs web). Se cuenta una sola vez.
vistos, unicos = set(), []
for n in nombres:
    clave = unicodedata.normalize("NFC", n).lower()
    if clave not in vistos:
        vistos.add(clave); unicos.append(n)
nombres = unicos
fotos = []
for n in nombres:
    m = medidas(os.path.join(carpeta, n))
    item = {"src": f"fotos/galeria/{n}"}
    if m:
        item["w"], item["h"] = m
    fotos.append(item)

with open(os.path.join(raiz, "assets", "js", "galeria.js"), "w", encoding="utf-8") as f:
    f.write("/* Se genera solo a partir de fotos/galeria/. No hace falta editarlo. */\n")
    f.write("window.GALERIA = " + json.dumps(fotos, ensure_ascii=False, indent=1) + ";\n")
print(len(fotos), "fotos en la galería")
