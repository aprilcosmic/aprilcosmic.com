#!/usr/bin/env python3
"""Arma la carpeta _site para publicar: copia el sitio, reduce las fotos de la
galería (máximo 1600 px, calidad 82, sin metadatos) y genera la lista de la galería.
Solo necesita Python y Pillow, así no depende de programas del servidor de GitHub."""
import os, shutil, subprocess, sys
from PIL import Image, ImageOps

raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
destino = os.path.join(raiz, "_site")
fuera = {".git", ".github", "_site", "config-github"}

if os.path.exists(destino):
    shutil.rmtree(destino)
shutil.copytree(raiz, destino, ignore=lambda d, nombres: [n for n in nombres if d == raiz and n in fuera])

carpeta = os.path.join(destino, "fotos", "galeria")
if os.path.isdir(carpeta):
    for n in os.listdir(carpeta):
        ruta = os.path.join(carpeta, n)
        ext = n.lower().rsplit(".", 1)[-1]
        if ext not in ("jpg", "jpeg", "png", "webp"):
            continue
        try:
            with Image.open(ruta) as im:
                im = ImageOps.exif_transpose(im)
                im.thumbnail((1600, 1600))
                if ext in ("jpg", "jpeg"):
                    im.convert("RGB").save(ruta, quality=82, optimize=True)
                elif ext == "webp":
                    im.save(ruta, quality=82)
                else:
                    im.save(ruta, optimize=True)
        except Exception as e:
            print("No se pudo reducir", n, e)

subprocess.run([sys.executable, os.path.join(destino, "scripts", "galeria.py")], check=True)
shutil.rmtree(os.path.join(destino, "scripts"), ignore_errors=True)
leeme = os.path.join(carpeta, "LEEME.txt")
if os.path.exists(leeme):
    os.remove(leeme)
print("Sitio listo en _site")
