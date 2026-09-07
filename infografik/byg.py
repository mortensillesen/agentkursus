#!/usr/bin/env python3
"""Tegner kursets 15 infografikker som SVG (1600x900) i kursets farver.

Koer:  python3 infografik/byg.py
Skriver infografik/svg/<slug>.svg og infografik/html/<slug>.html (til PDF og Canva-import).
Kun standardbiblioteket. Ingen afhaengigheder.
"""
import os

ROD = os.path.dirname(os.path.abspath(__file__))
W, H = 1600, 900

BG, INK, FLADE, DAEMP, LINJE = "#fbfaf7", "#1b1f24", "#ffffff", "#5b6470", "#d8d5cf"
ACC, ACCBG = "#1f4e8c", "#e8eef8"
OK, OKBG = "#1e6b3a", "#e4f2e8"
FEJL, FEJLBG = "#9b2c2c", "#f9e5e5"
ADV, ADVBG = "#8a6100", "#fbf1d6"
KODE = "#f0eee9"
FONT = "Arial, Helvetica, sans-serif"
SW = 6  # stregtykkelse for ikoner


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


# ---------- primitiver ----------
def text(x, y, s, size=26, weight="normal", fill=INK, anchor="start", italic=False, spacing=None):
    st = f' font-style="italic"' if italic else ""
    sp = f' letter-spacing="{spacing}"' if spacing else ""
    return (f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}"{st}{sp}>{esc(s)}</text>')


def lines(x, y, rows, size=24, fill=INK, anchor="start", lh=1.3, weight="normal"):
    return "".join(text(x, y + i * size * lh, r, size, weight, fill, anchor) for i, r in enumerate(rows))


def rect(x, y, w, h, fill=FLADE, stroke=LINJE, r=12, sw=3, dash=None, op=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    o = f' opacity="{op}"' if op is not None else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}{o}/>'


def circle(cx, cy, r, fill=FLADE, stroke=ACC, sw=SW):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'


def path(d, fill="none", stroke=ACC, sw=SW, dash=None, marker=None):
    ds = f' stroke-dasharray="{dash}"' if dash else ""
    m = f' marker-end="url(#pil-{marker})"' if marker else ""
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"{ds}{m}/>'


def line(x1, y1, x2, y2, stroke=ACC, sw=5, dash=None, pil=None):
    return path(f"M{x1} {y1} L{x2} {y2}", "none", stroke, sw, dash, pil)


def pil(x1, y1, x2, y2, stroke=ACC, sw=5, dash=None):
    """Lige pil. Markoer-navnet foelger farven."""
    return line(x1, y1, x2, y2, stroke, sw, dash, farvenavn(stroke))


def bue(x1, y1, x2, y2, r, stroke=ACC, sw=5, sweep=1, pil_=True):
    m = farvenavn(stroke) if pil_ else None
    return path(f"M{x1} {y1} A{r} {r} 0 0 {sweep} {x2} {y2}", "none", stroke, sw, None, m)


def farvenavn(c):
    return {ACC: "acc", INK: "ink", OK: "ok", FEJL: "fejl", DAEMP: "daemp", ADV: "adv"}.get(c, "acc")


def pille(cx, cy, s, size=22, fill=ACCBG, stroke=ACC, farve=None, weight="bold", pad=22):
    w = len(s) * size * 0.58 + pad * 2
    h = size * 1.8
    return (rect(cx - w / 2, cy - h / 2, w, h, fill, stroke, h / 2, 2.5) +
            text(cx, cy + size * 0.36, s, size, weight, farve or stroke, "middle"))


def etiket(cx, y, s, size=22, fill=INK, weight="bold"):
    return text(cx, y, s, size, weight, fill, "middle")


# ---------- ikoner (centreret i cx, cy; s er skala, 1 = ca. 100 px) ----------
def person(cx, cy, s=1.0, col=ACC, fill=ACCBG):
    r = 15 * s
    return (circle(cx, cy - 30 * s, r, fill, col, SW * s) +
            path(f"M{cx - 30 * s} {cy + 40 * s} V{cy + 15 * s} A{30 * s} {30 * s} 0 0 1 {cx + 30 * s} {cy + 15 * s} V{cy + 40 * s} Z", fill, col, SW * s))


def dok(x, y, w=80, h=100, col=ACC, fill=FLADE, linjer=3, sw=SW):
    f = w * 0.28
    d = f"M{x} {y} H{x + w - f} L{x + w} {y + f} V{y + h} H{x} Z"
    out = path(d, fill, col, sw) + path(f"M{x + w - f} {y} V{y + f} H{x + w}", "none", col, sw * 0.7)
    for i in range(linjer):
        ly = y + h * 0.45 + i * h * 0.17
        out += path(f"M{x + w * 0.2} {ly} H{x + w * 0.8}", "none", col, sw * 0.6)
    return out


def mappe(x, y, w=110, h=80, col=ACC, fill=ACCBG, sw=SW):
    d = f"M{x} {y + 14} V{y + h} H{x + w} V{y + 6} H{x + w * 0.5} L{x + w * 0.42} {y - 8} H{x + 8} A8 8 0 0 0 {x} {y}Z"
    return path(d, fill, col, sw)


def lastbil(cx, cy, s=1.0, col=ACC, fill=ACCBG):
    k = lambda v: v * s
    out = rect(cx - k(90), cy - k(45), k(115), k(65), fill, col, 6, SW * s)
    out += path(f"M{cx + k(25)} {cy - k(25)} H{cx + k(65)} L{cx + k(90)} {cy + k(5)} V{cy + k(20)} H{cx + k(25)} Z", FLADE, col, SW * s)
    out += circle(cx - k(55), cy + k(25), k(16), FLADE, col, SW * s) + circle(cx + k(55), cy + k(25), k(16), FLADE, col, SW * s)
    return out


def palle(cx, cy, s=1.0, col=ACC, fill=ACCBG):
    k = lambda v: v * s
    out = rect(cx - k(50), cy + k(20), k(100), k(14), KODE, col, 2, SW * s * 0.7)
    out += rect(cx - k(42), cy - k(30), k(40), k(50), fill, col, 4, SW * s * 0.8)
    out += rect(cx + k(2), cy - k(30), k(40), k(50), fill, col, 4, SW * s * 0.8)
    out += rect(cx - k(20), cy - k(65), k(40), k(35), fill, col, 4, SW * s * 0.8)
    return out


def flueben(cx, cy, r=24, col=OK, bg=OKBG):
    return circle(cx, cy, r, bg, col, SW * 0.8) + path(f"M{cx - r * 0.45} {cy} L{cx - r * 0.1} {cy + r * 0.35} L{cx + r * 0.5} {cy - r * 0.35}", "none", col, SW * 0.9)


def kryds(cx, cy, r=24, col=FEJL, bg=FEJLBG):
    k = r * 0.42
    return circle(cx, cy, r, bg, col, SW * 0.8) + path(f"M{cx - k} {cy - k} L{cx + k} {cy + k} M{cx + k} {cy - k} L{cx - k} {cy + k}", "none", col, SW * 0.9)


def bom(cx, cy, s=1.0, aaben=False, col=ACC):
    k = lambda v: v * s
    out = rect(cx - k(12), cy - k(20), k(24), k(70), ACCBG, col, 4, SW * s)
    if aaben:
        out += path(f"M{cx} {cy - k(10)} L{cx + k(60)} {cy - k(110)}", "none", col, SW * s * 1.3)
    else:
        out += path(f"M{cx} {cy - k(10)} H{cx + k(150)}", "none", col, SW * s * 1.3)
        for i in range(4):
            x = cx + k(25) + i * k(35)
            out += path(f"M{x} {cy - k(10)} l{k(10)} 0", "none", FLADE, SW * s * 1.3)
    return out


def ur(cx, cy, r=45, t=16, m=0, col=ACC):
    import math
    a1 = math.radians((t % 12) * 30 + m * 0.5 - 90)
    a2 = math.radians(m * 6 - 90)
    out = circle(cx, cy, r, FLADE, col, SW)
    out += path(f"M{cx} {cy} L{cx + r * 0.5 * math.cos(a1)} {cy + r * 0.5 * math.sin(a1)}", "none", col, SW)
    out += path(f"M{cx} {cy} L{cx + r * 0.78 * math.cos(a2)} {cy + r * 0.78 * math.sin(a2)}", "none", col, SW * 0.8)
    return out


def noegle(cx, cy, s=1.0, col=ACC):
    k = lambda v: v * s
    out = circle(cx - k(30), cy, k(22), ACCBG, col, SW * s)
    out += path(f"M{cx - k(8)} {cy} H{cx + k(60)} V{cy + k(18)} M{cx + k(38)} {cy} V{cy + k(14)}", "none", col, SW * s)
    return out


def stik(cx, cy, s=1.0, col=ACC):
    k = lambda v: v * s
    out = rect(cx - k(35), cy - k(25), k(70), k(50), ACCBG, col, 8, SW * s)
    out += path(f"M{cx - k(15)} {cy - k(25)} V{cy - k(55)} M{cx + k(15)} {cy - k(25)} V{cy - k(55)}", "none", col, SW * s)
    out += path(f"M{cx} {cy + k(25)} V{cy + k(55)}", "none", col, SW * s)
    return out


def maaler(cx, cy, r=70, andel=0.6, col=ACC, fyld=None):
    import math
    fyld = fyld or col
    a0, a1 = math.pi, math.pi + math.pi * andel
    x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0)
    x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
    stor = 1 if andel > 0.5 else 0
    out = path(f"M{x0} {y0} A{r} {r} 0 0 1 {cx + r} {cy}", "none", LINJE, SW * 1.6)
    out += path(f"M{x0} {y0} A{r} {r} 0 {stor} 1 {x1} {y1}", "none", fyld, SW * 1.6)
    out += path(f"M{cx} {cy} L{x1} {y1}", "none", INK, SW * 0.7) + circle(cx, cy, 7, INK, INK, 1)
    return out


def maal(cx, cy, r=45, col=ACC):
    return circle(cx, cy, r, FLADE, col, SW) + circle(cx, cy, r * 0.6, ACCBG, col, SW) + circle(cx, cy, r * 0.2, col, col, 1)


def telefon(cx, cy, s=1.0, col=ACC):
    k = lambda v: v * s
    return (rect(cx - k(25), cy - k(45), k(50), k(90), ACCBG, col, 10, SW * s) +
            path(f"M{cx - k(10)} {cy + k(32)} H{cx + k(10)}", "none", col, SW * s))


def boble(x, y, w, h, s, size=22, col=ACC, fill=FLADE, hale="v", weight="normal"):
    if hale == "v":
        d = f"M{x + 12} {y} H{x + w - 12} A12 12 0 0 1 {x + w} {y + 12} V{y + h - 12} A12 12 0 0 1 {x + w - 12} {y + h} H{x + 50} L{x + 30} {y + h + 22} L{x + 34} {y + h} H{x + 12} A12 12 0 0 1 {x} {y + h - 12} V{y + 12} A12 12 0 0 1 {x + 12} {y} Z"
    else:
        d = f"M{x + 12} {y} H{x + w - 12} A12 12 0 0 1 {x + w} {y + 12} V{y + h - 12} A12 12 0 0 1 {x + w - 12} {y + h} H{x + w - 34} L{x + w - 30} {y + h + 22} L{x + w - 50} {y + h} H{x + 12} A12 12 0 0 1 {x} {y + h - 12} V{y + 12} A12 12 0 0 1 {x + 12} {y} Z"
    rows = s if isinstance(s, list) else [s]
    ty = y + h / 2 - (len(rows) - 1) * size * 0.65 + size * 0.36
    return path(d, fill, col, 3) + lines(x + w / 2, ty, rows, size, INK, "middle", 1.3, weight)


def vaegt(cx, cy, s=1.0, col=ACC):
    k = lambda v: v * s
    out = path(f"M{cx} {cy + k(50)} V{cy - k(40)} M{cx - k(45)} {cy + k(50)} H{cx + k(45)}", "none", col, SW * s)
    out += path(f"M{cx - k(70)} {cy - k(40)} H{cx + k(70)}", "none", col, SW * s)
    for dx in (-70, 70):
        out += path(f"M{cx + k(dx)} {cy - k(40)} L{cx + k(dx) - k(25)} {cy + k(5)} M{cx + k(dx)} {cy - k(40)} L{cx + k(dx) + k(25)} {cy + k(5)}", "none", col, SW * s * 0.7)
        out += path(f"M{cx + k(dx) - k(30)} {cy + k(5)} A{k(30)} {k(30)} 0 0 0 {cx + k(dx) + k(30)} {cy + k(5)} Z", ACCBG, col, SW * s * 0.8)
    return out


def chip(cx, cy, s=1.0, col=ACC, tekst=None):
    k = lambda v: v * s
    out = rect(cx - k(40), cy - k(40), k(80), k(80), ACCBG, col, 10, SW * s)
    out += rect(cx - k(22), cy - k(22), k(44), k(44), FLADE, col, 4, SW * s * 0.7)
    for i in (-24, 0, 24):
        out += path(f"M{cx + k(i)} {cy - k(40)} V{cy - k(56)} M{cx + k(i)} {cy + k(40)} V{cy + k(56)}", "none", col, SW * s * 0.8)
        out += path(f"M{cx - k(40)} {cy + k(i)} H{cx - k(56)} M{cx + k(40)} {cy + k(i)} H{cx + k(56)}", "none", col, SW * s * 0.8)
    if tekst:
        out += text(cx, cy + k(90), tekst, 22 * s, "bold", col, "middle")
    return out


def stempel(cx, cy, s=1.0, col=OK, fill=OKBG):
    k = lambda v: v * s
    out = rect(cx - k(18), cy - k(60), k(36), k(35), fill, col, 6, SW * s)
    out += path(f"M{cx - k(50)} {cy - k(25)} H{cx + k(50)} V{cy} H{cx - k(50)} Z", fill, col, SW * s)
    out += rect(cx - k(55), cy + k(20), k(110), k(28), fill, col, 4, SW * s * 0.7)
    return out


def kalender(cx, cy, s=1.0, col=ACC, tekst=""):
    k = lambda v: v * s
    out = rect(cx - k(50), cy - k(40), k(100), k(90), FLADE, col, 8, SW * s)
    out += rect(cx - k(50), cy - k(40), k(100), k(24), col, col, 8, 1)
    out += rect(cx - k(50), cy - k(28), k(100), k(12), col, col, 0, 1)
    out += path(f"M{cx - k(25)} {cy - k(55)} V{cy - k(30)} M{cx + k(25)} {cy - k(55)} V{cy - k(30)}", "none", col, SW * s)
    if tekst:
        out += text(cx, cy + k(22), tekst, 24 * s, "bold", INK, "middle")
    return out


def server(cx, cy, s=1.0, col=ACC):
    k = lambda v: v * s
    out = ""
    for i in range(3):
        y = cy - k(50) + i * k(34)
        out += rect(cx - k(50), y, k(100), k(28), ACCBG, col, 5, SW * s * 0.8)
        out += circle(cx + k(34), y + k(14), k(5), col, col, 1)
    return out


def skuffe(x, y, w, h, s, col=ACC, size=20):
    return (rect(x, y, w, h, FLADE, col, 6, 3) +
            rect(x + w / 2 - 18, y + 10, 36, 7, col, col, 3, 1) +
            text(x + w / 2, y + h - 14, s, size, "bold", INK, "middle"))


def gnist(x, y, w, h, pts, col=ACC, sw=4):
    n = len(pts)
    mx = max(pts) or 1
    d = " ".join(("M" if i == 0 else "L") + f"{x + i * w / (n - 1)} {y + h - p / mx * h}" for i, p in enumerate(pts))
    return path(d, "none", col, sw)


def tragt(cx, cy, s=1.0, col=ACC):
    k = lambda v: v * s
    return path(f"M{cx - k(90)} {cy - k(60)} H{cx + k(90)} L{cx + k(20)} {cy + k(20)} V{cy + k(70)} H{cx - k(20)} V{cy + k(20)} Z", ACCBG, col, SW * s)


def bord(x, y, w, col=ACC):
    return (rect(x, y, w, 16, ACCBG, col, 4, SW * 0.8) +
            path(f"M{x + 20} {y + 16} V{y + 70} M{x + w - 20} {y + 16} V{y + 70}", "none", col, SW * 0.8))


def tjekliste(x, y, w=90, h=110, col=ACC, n=4, ok_=True):
    out = rect(x, y, w, h, FLADE, col, 8, SW * 0.8)
    for i in range(n):
        ly = y + 22 + i * (h - 30) / n
        out += rect(x + 12, ly - 8, 16, 16, OKBG if ok_ else FLADE, OK if ok_ else col, 3, 2)
        if ok_:
            out += path(f"M{x + 15} {ly} L{x + 19} {ly + 4} L{x + 25} {ly - 4}", "none", OK, 2.5)
        out += path(f"M{x + 38} {ly} H{x + w - 14}", "none", col, 3)
    return out


def tavle(x, y, w, h, col=ACC):
    return rect(x, y, w, h, FLADE, col, 10, SW * 0.8) + rect(x, y, w, 30, col, col, 10, 1) + rect(x, y + 15, w, 15, col, col, 0, 1)


def skjold(cx, cy, s=1.0, col=ACC):
    k = lambda v: v * s
    return path(f"M{cx} {cy - k(45)} L{cx + k(40)} {cy - k(30)} V{cy} A{k(40)} {k(50)} 0 0 1 {cx} {cy + k(50)} A{k(40)} {k(50)} 0 0 1 {cx - k(40)} {cy} V{cy - k(30)} Z", ACCBG, col, SW * s)


def haandtryk(cx, cy, s=1.0, col=ACC):
    k = lambda v: v * s
    return path(f"M{cx - k(60)} {cy - k(10)} L{cx - k(15)} {cy - k(30)} L{cx + k(15)} {cy - k(5)} L{cx + k(60)} {cy - k(25)} "
                f"M{cx - k(15)} {cy - k(30)} L{cx + k(10)} {cy + k(20)} M{cx + k(15)} {cy - k(5)} L{cx - k(5)} {cy + k(25)} M{cx - k(60)} {cy - k(10)} L{cx - k(20)} {cy + k(20)}",
                "none", col, SW * s)


def database(cx, cy, s=1.0, col=ACC):
    k = lambda v: v * s
    out = path(f"M{cx - k(40)} {cy - k(35)} V{cy + k(35)} A{k(40)} {k(14)} 0 0 0 {cx + k(40)} {cy + k(35)} V{cy - k(35)}", ACCBG, col, SW * s)
    out += path(f"M{cx - k(40)} {cy - k(35)} A{k(40)} {k(14)} 0 0 0 {cx + k(40)} {cy - k(35)} A{k(40)} {k(14)} 0 0 0 {cx - k(40)} {cy - k(35)}", FLADE, col, SW * s)
    out += path(f"M{cx - k(40)} {cy} A{k(40)} {k(14)} 0 0 0 {cx + k(40)} {cy}", "none", col, SW * s * 0.7)
    return out


def hue(cx, cy, s=1.0, col=ACC):
    k = lambda v: v * s
    return (path(f"M{cx - k(60)} {cy - k(10)} L{cx} {cy - k(40)} L{cx + k(60)} {cy - k(10)} L{cx} {cy + k(20)} Z", ACCBG, col, SW * s) +
            path(f"M{cx - k(35)} {cy + k(2)} V{cy + k(30)} A{k(35)} {k(20)} 0 0 0 {cx + k(35)} {cy + k(30)} V{cy + k(2)}", "none", col, SW * s) +
            path(f"M{cx + k(60)} {cy - k(10)} V{cy + k(30)}", "none", col, SW * s * 0.7))


def kasse(cx, cy, s=1.0, col=ACC):
    k = lambda v: v * s
    return (rect(cx - k(55), cy - k(20), k(110), k(70), ACCBG, col, 6, SW * s) +
            rect(cx - k(62), cy - k(45), k(124), k(28), FLADE, col, 6, SW * s))


def nummer(cx, cy, n, r=22, col=ACC, bg=ACCBG, size=22):
    return circle(cx, cy, r, bg, col, 3) + text(cx, cy + size * 0.36, str(n), size, "bold", col, "middle")


# ---------- ramme ----------
def ramme(kicker, titel, bund, scene):
    defs = "".join(
        f'<marker id="pil-{n}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">'
        f'<path d="M0 0 L10 5 L0 10 Z" fill="{c}"/></marker>'
        for n, c in (("acc", ACC), ("ink", INK), ("ok", OK), ("fejl", FEJL), ("daemp", DAEMP), ("adv", ADV)))
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
           f"<title>{esc(titel)}</title>", f"<defs>{defs}</defs>",
           f'<rect width="{W}" height="{H}" fill="{BG}"/>',
           rect(60, 52, 10, 78, ACC, ACC, 5, 1),
           text(92, 82, kicker, 24, "bold", ACC, spacing="2"),
           text(92, 126, titel, 44, "bold", INK),
           text(1540, 82, "Agentkursus", 22, "normal", DAEMP, "end"),
           scene,
           line(60, 800, 1540, 800, LINJE, 2),
           text(60, 852, bund, 30, "normal", INK, italic=True),
           "</svg>"]
    return "\n".join(out)


# ---------- scener ----------
def s00():
    o = ""
    # Du, bestilleren
    o += person(190, 300, 1.4) + etiket(190, 400, "Du")
    o += dok(255, 200, 70, 85, ACC, FLADE, 3, 4)
    o += pil(290, 300, 430, 300)
    o += text(360, 335, "bestilling", 22, "normal", DAEMP, "middle")
    # loekken
    cx, cy, r = 680, 360, 135
    import math
    noder = ["Mål", "Kontekst", "Handling", "Observation", "Vurdering"]
    pts = [(cx + r * math.cos(math.radians(-90 + i * 72)), cy + r * math.sin(math.radians(-90 + i * 72))) for i in range(5)]
    for i in range(5):
        x1, y1 = pts[i]; x2, y2 = pts[(i + 1) % 5]
        # forkort buen, saa pilen stopper ved naeste node
        ang = math.atan2(y2 - cy, x2 - cx) - math.radians(14)
        ex, ey = cx + r * math.cos(ang), cy + r * math.sin(ang)
        ang0 = math.atan2(y1 - cy, x1 - cx) + math.radians(14)
        sx, sy = cx + r * math.cos(ang0), cy + r * math.sin(ang0)
        o += bue(sx, sy, ex, ey, r, ACC, 5, 1)
    for (x, y), n in zip(pts, noder):
        o += circle(x, y, 34, ACCBG, ACC, 4) + text(x, y + 8, n[0], 26, "bold", ACC, "middle")
        dy = -52 if y < cy - 20 else (60 if y > cy + 20 else 8)
        ax = x + (70 if x > cx + 20 else (-70 if x < cx - 20 else 0))
        anc = "start" if x > cx + 20 else ("end" if x < cx - 20 else "middle")
        o += text(x if anc == "middle" else (x + 44 if anc == "start" else x - 44), y + dy, n, 22, "bold", INK, anc)
    o += chip(cx, cy, 0.8, ACC, "Agent")
    # bevis og dom
    o += pil(860, 300, 990, 300)
    o += bom(1060, 330, 1.0, aaben=True) + text(1090, 405, "Port", 22, "bold", INK, "middle")
    o += stempel(1230, 320, 0.9) + text(1230, 400, "Bevis", 22, "bold", INK, "middle")
    o += pil(1300, 300, 1400, 300)
    o += person(1450, 300, 1.2) + etiket(1450, 390, "Din dom")
    # 14 moduler, 4 dele
    dele = [("Fundament", 1, 2), ("Kernefærdigheder", 3, 6), ("Avancerede mønstre", 7, 10), ("Organisation og skala", 11, 14)]
    x0, dx = 130, 98
    o += path(f"M{x0 - 30} 640 H{x0 + 13 * dx + 30}", "none", LINJE, 8)
    for i in range(14):
        o += nummer(x0 + i * dx, 640, f"{i + 1:02d}", 26, ACC, FLADE, 20)
    for navn, a, b in dele:
        xa, xb = x0 + (a - 1) * dx - 30, x0 + (b - 1) * dx + 30
        o += path(f"M{xa} 690 V705 H{xb} V690", "none", DAEMP, 3)
        o += text((xa + xb) / 2, 740, navn, 22, "bold", DAEMP, "middle")
    o += text(x0 + 2.5 * dx, 585, "Dag 1", 24, "bold", ACC, "middle") + text(x0 + 9.5 * dx, 585, "Dag 2", 24, "bold", ACC, "middle")
    o += path(f"M{x0 + 5.5 * dx} 560 V760", "none", LINJE, 3, "10 10")
    return ramme("HVAD ER AGENTIC ENGINEERING?", "Du bestiller, agenten arbejder, du dømmer på bevis", "Fjorten moduler om at bestille, følge med og bedømme.", o)


def s01():
    import math
    o = ""
    cx, cy, r = 760, 470, 215
    noder = ["Mål", "Kontekst", "Handling", "Observation", "Vurdering", "Gentag"]
    ik = [lambda x, y: maal(x, y, 34), lambda x, y: mappe(x - 42, y - 30, 84, 62, ACC, ACCBG, 4),
          lambda x, y: telefon(x, y, 0.75), lambda x, y: boble(x - 60, y - 34, 120, 62, ["ingen plads", "før mandag"], 17, ACC, FLADE, "v"),
          lambda x, y: vaegt(x, y, 0.55), lambda x, y: path(f"M{x + 26} {y - 6} A26 26 0 1 1 {x + 22} {y - 20}", "none", ACC, SW, None, "acc")]
    pts = [(cx + r * math.cos(math.radians(-90 + i * 60)), cy + r * math.sin(math.radians(-90 + i * 60))) for i in range(6)]
    for i in range(6):
        x1, y1 = pts[i]; x2, y2 = pts[(i + 1) % 6]
        a0 = math.atan2(y1 - cy, x1 - cx) + math.radians(17)
        a1 = math.atan2(y2 - cy, x2 - cx) - math.radians(17)
        o += bue(cx + r * math.cos(a0), cy + r * math.sin(a0), cx + r * math.cos(a1), cy + r * math.sin(a1), r, ACC, 5, 1)
    for i, ((x, y), n) in enumerate(zip(pts, noder)):
        o += circle(x, y, 58, FLADE, ACC, 4) + ik[i](x, y)
        ang = math.radians(-90 + i * 60)
        lx, ly = cx + (r + 95) * math.cos(ang), cy + (r + 95) * math.sin(ang) + 8
        o += text(lx, ly, n, 24, "bold", INK, "middle")
    o += text(cx, cy - 10, "Mål nået?", 26, "bold", ACC, "middle")
    o += flueben(cx - 40, cy + 40, 26) + kryds(cx + 40, cy + 40, 26)
    # brudpunkter
    brud = [(0, "ingen målestok"), (1, "forurenet kontekst"), (3, "sprunget over"), (4, "ingen stopbetingelse")]
    for i, t in brud:
        x, y = pts[i]
        ang = math.radians(-90 + i * 60)
        bx, by = x + 62 * math.cos(ang + 0.9), y + 62 * math.sin(ang + 0.9)
        o += kryds(bx, by, 16)
    o += text(1290, 300, "Fire brudpunkter", 24, "bold", FEJL)
    o += lines(1290, 340, ["ingen målestok", "forurenet kontekst", "sprunget observation", "ingen stopbetingelse"], 22, INK, "start", 1.4)
    for i in range(4):
        o += kryds(1270, 332 + i * 30.8, 11)
    # disponenten
    o += person(200, 330, 1.3) + etiket(200, 420, "Disponenten")
    o += lastbil(230, 560, 0.9) + text(230, 640, "Hamborg fredag", 22, "bold", INK, "middle")
    return ramme("MODUL 01", "Den agentiske løkke", "Gentag, til målet er nået, og bevis det.", o)


def s02():
    o = ""
    # ny elev
    o += person(200, 380, 1.4) + etiket(200, 470, "Den nye elev")
    o += dok(260, 240, 70, 85, ACC, FLADE, 3, 4)
    o += pil(300, 400, 420, 400)
    # harness-ramme
    o += rect(440, 200, 1000, 560, FLADE, ACC, 24, 4, "18 12")
    o += text(470, 245, "Harness: alt uden om modellen", 26, "bold", ACC)
    o += chip(940, 480, 1.4, ACC, "Modellen")
    # dele rundt om
    o += dok(560, 330, 90, 110, ACC, ACCBG, 4) + text(605, 480, "Instruks", 22, "bold", INK, "middle") + text(605, 508, "CLAUDE.md", 20, "normal", DAEMP, "middle")
    o += noegle(1300, 380, 1.1) + text(1300, 480, "Permissions", 22, "bold", INK, "middle") + text(1300, 508, "hvad den må", 20, "normal", DAEMP, "middle")
    o += stik(605, 640, 0.9) + text(605, 730, "Værktøjer", 22, "bold", INK, "middle")
    o += server(1300, 640, 0.9) + text(1300, 730, "Systemer og filer", 22, "bold", INK, "middle")
    for (x1, y1) in ((690, 400), (1180, 400), (690, 620), (1180, 620)):
        o += line(x1, y1, 940 + (x1 - 940) * 0.35, 480 + (y1 - 480) * 0.35, LINJE, 4)
    return ramme("MODUL 02", "Opsætning af miljø", "Modellen er lille. Alt udenom bestemmer, hvad den kan.", o)


def s03():
    o = ""
    # venstre: alt paa bordet
    o += bord(120, 520, 520)
    for i in range(7):
        o += mappe(140 + i * 62, 300 + (i % 3) * 55, 90, 70, DAEMP, KODE, 3)
    o += mappe(560, 430, 110, 80, FEJL, FEJLBG, 4)
    o += person(380, 660, 1.0, DAEMP, KODE)
    o += kryds(600, 250, 30)
    o += text(380, 760, "Hele arkivskabet på bordet", 24, "bold", FEJL, "middle")
    # hoejre: peg
    o += bord(940, 520, 520)
    o += mappe(1140, 420, 120, 90, ACC, ACCBG, 4)
    o += path("M1080 300 L1150 405", "none", ACC, SW, None, "acc")
    o += person(1200, 660, 1.0)
    o += flueben(1400, 250, 30)
    o += text(1200, 760, "Ét dokument, peget ud", 24, "bold", OK, "middle")
    # midt: maaler
    o += maaler(800, 330, 90, 0.9, ACC, FEJL) + text(800, 375, "kontekstvindue", 20, "normal", DAEMP, "middle")
    o += pille(800, 470, "/clear", 20, KODE, INK, INK, "bold", 14)
    o += pille(800, 530, "/compact", 20, KODE, INK, INK, "bold", 14)
    o += pille(800, 590, "/context", 20, KODE, INK, INK, "bold", 14)
    o += path("M720 580 H 300 V 580", "none", LINJE, 0)
    return ramme("MODUL 03", "Kontekst-engineering", "Peg på det rigtige. Hæld ikke skabet ud.", o)


def s04():
    o = ""
    # venstre: sedlen
    o += path("M200 300 L470 285 L480 520 L215 540 Z", ADVBG, ADV, 4)
    o += text(340, 400, "Send det", 30, "bold", INK, "middle") + text(340, 445, "til Tyskland", 30, "bold", INK, "middle")
    o += kryds(470, 285, 30)
    o += text(340, 620, "En instruks", 24, "bold", FEJL, "middle")
    o += lastbil(340, 720, 0.7, DAEMP, KODE) + text(400, 745, "?", 40, "bold", FEJL, "middle")
    # pil
    o += pil(560, 430, 700, 430)
    # hoejre: fragtordre
    o += rect(760, 220, 620, 500, FLADE, ACC, 10, 4)
    o += rect(760, 220, 620, 60, ACC, ACC, 10, 1) + rect(760, 250, 620, 30, ACC, ACC, 0, 1)
    o += text(1070, 262, "FRAGTORDRE", 26, "bold", FLADE, "middle", spacing="3")
    felter = ["Gods og vægt", "Mål", "Adresser", "Leveringsdag", "Færdig-signal"]
    for i, f in enumerate(felter):
        y = 330 + i * 72
        o += rect(800, y - 26, 26, 26, OKBG, OK, 5, 3) + path(f"M{806} {y - 13} L{812} {y - 7} L{821} {y - 20}", "none", OK, 3)
        o += text(850, y - 5, f, 26, "bold" if i == 4 else "normal", ACC if i == 4 else INK)
        o += path(f"M1080 {y - 12} H1340", "none", LINJE, 3)
    o += flueben(1380, 220, 30)
    o += text(1070, 760, "En opgave, agenten kan afslutte", 24, "bold", OK, "middle")
    return ramme("MODUL 04", "Effektiv prompting til agenter", "En opgave, ikke en instruks. Med et færdig-signal.", o)


def s05():
    o = ""
    # venstre: prisliste fra i fjor
    o += dok(180, 300, 200, 250, DAEMP, KODE, 6, 4)
    o += ur(440, 330, 40, 9, 0, FEJL) + text(440, 405, "i fjor", 22, "bold", FEJL, "middle")
    o += text(300, 620, "Indsat i teksten", 24, "bold", INK, "middle") + text(300, 652, "gammel, tavs, aldrig spurgt igen", 20, "normal", DAEMP, "middle")
    # midt: forbindelsen
    o += chip(640, 430, 1.0, ACC, "Agent")
    o += stik(760, 430, 0.8)
    o += path("M820 430 H 900", "none", ACC, SW)
    o += rect(900, 400, 40, 60, ACCBG, ACC, 8, SW * 0.8) + path("M915 415 V445 M925 415 V445", "none", ACC, 4)
    o += pille(780, 300, "tool call = ét kald", 20)
    o += server(1200, 430, 1.1) + text(1200, 530, "Bookingsystemet", 24, "bold", INK, "middle") + text(1200, 560, "svarer nu, også på det du ikke spurgte om", 20, "normal", DAEMP, "middle")
    o += pil(985, 405, 1110, 405, OK) + pil(1110, 455, 985, 455, OK)
    o += text(1048, 390, "spørg", 18, "normal", OK, "middle") + text(1048, 485, "svar", 18, "normal", OK, "middle")
    # tillid
    o += rect(1230, 600, 280, 170, ADVBG, ADV, 10, 2)
    o += noegle(1370, 650, 0.8) + text(1370, 718, "En server er kode med adgang", 20, "bold", ADV, "middle") + text(1370, 746, "til dine ting. Tillid før tilslutning.", 19, "normal", DAEMP, "middle")
    return ramme("MODUL 05", "Værktøjer, MCP og forbindelser", "En forbindelse svarer på det, du spørger om nu.", o)


def s06():
    o = ""
    # rampen
    o += path("M100 560 H1500", "none", LINJE, 6)
    o += lastbil(230, 500, 1.0) + text(230, 620, "Klar til afgang?", 22, "bold", INK, "middle")
    o += bom(430, 500, 1.0, aaben=False)
    # fire porte
    porte = [("I bestillingen", lambda x, y: dok(x - 30, y - 40, 60, 75, ACC, FLADE, 3, 4)),
             ("Før commit", lambda x, y: bom(x - 10, y + 5, 0.6, aaben=False)),
             ("I harnessen", lambda x, y: chip(x, y, 0.65)),
             ("På GitHub", lambda x, y: server(x, y, 0.65))]
    for i, (navn, ik) in enumerate(porte):
        x = 700 + i * 210
        o += rect(x - 85, 260, 170, 200, FLADE, ACC, 12, 3)
        o += ik(x, 350)
        o += flueben(x + 70, 275, 20)
        o += text(x, 500, navn, 22, "bold", INK, "middle")
    o += pil(500, 360, 600, 360) + text(1120, 230, "Fire slags port", 24, "bold", ACC, "middle")
    # bevis vs paastand
    o += boble(560, 610, 250, 70, "Det virker.", 22, DAEMP, KODE, "v") + kryds(810, 610, 26) + text(685, 745, "Påstand", 22, "bold", FEJL, "middle")
    o += stempel(1120, 650, 1.0) + text(1120, 745, "Bevis: testen bestået", 22, "bold", OK, "middle")
    o += flueben(1230, 600, 26)
    return ramme("MODUL 06", "Verifikation og kvalitetsporte", "Bevis, ikke påstand. Porten siger nej uden dig.", o)


def s07():
    o = ""
    o += person(800, 250, 1.2) + text(800, 340, "Én disponent, fire sager", 24, "bold", INK, "middle")
    farver = [ACC, OK, ADV, DAEMP]
    fylder = [ACCBG, OKBG, ADVBG, KODE]
    for i in range(4):
        x = 330 + i * 313
        o += line(800, 360, x, 430, LINJE, 4, None, "daemp")
        o += bord(x - 110, 560, 220, farver[i])
        o += person(x - 40, 500, 0.8, farver[i], fylder[i])
        o += mappe(x + 10, 495, 80, 55, farver[i], fylder[i], 3)
        o += text(x, 680, f"Sag {i + 1}", 22, "bold", farver[i], "middle")
        o += line(x, 690, x, 720, LINJE, 3)
    o += path("M330 725 H1269", "none", LINJE, 4)
    o += pil(800, 725, 800, 745, ACC) + text(800, 780, "Samlet resultat", 22, "bold", INK, "middle")
    # kollision
    o += rect(1230, 190, 310, 150, FEJLBG, FEJL, 10, 2)
    o += mappe(1340, 250, 90, 60, FEJL, FLADE, 3)
    o += pil(1270, 225, 1335, 255, FEJL) + pil(1500, 225, 1435, 255, FEJL)
    o += text(1385, 325, "Samme fil: sidste version vinder", 18, "bold", FEJL, "middle")
    # pris
    o += maaler(150, 300, 60, 0.75, ACC, ADV) + text(150, 340, "tokens ×4", 20, "bold", ADV, "middle")
    return ramme("MODUL 07", "Subagenter og parallelitet", "Hver sin sag, hvert sit skrivebord.", o)


def s08():
    o = ""
    o += ur(800, 280, 60, 16, 0) + text(800, 375, "Vagtskifte kl. 16", 24, "bold", INK, "middle")
    o += person(420, 300, 1.3) + etiket(420, 390, "Dagvagt")
    o += person(1180, 300, 1.3) + etiket(1180, 390, "Aftenvagt")
    o += pil(520, 470, 1060, 470, ACC, 6)
    o += dok(750, 420, 80, 100, ACC, FLADE, 4, 4) + text(790, 555, "Overdragelsen", 22, "bold", ACC, "middle")
    o += boble(500, 200, 230, 60, "det ved jeg jo", 20, DAEMP, KODE, "v") + kryds(730, 200, 22)
    o += text(615, 305, "forsvinder", 18, "normal", FEJL, "middle")
    o += text(800, 625, "Det, der overlever", 24, "bold", DAEMP, "middle")
    sk = ["Instruks", "Auto memory", "Statusfil", "Git-historik"]
    for i, s in enumerate(sk):
        o += skuffe(300 + i * 260, 650, 220, 110, s, ACC, 22)
    return ramme("MODUL 08", "Langtkørende agenter og hukommelse", "Kun det, der er skrevet ned, overlever vagtskiftet.", o)


def s09():
    o = ""
    # pipeline
    trin = [("Udløser", 330), ("Port", 800), ("Deploy", 1270)]
    for navn, x in trin:
        o += rect(x - 170, 260, 340, 330, FLADE, ACC, 14, 3)
        o += text(x, 300, navn, 26, "bold", ACC, "middle")
    o += pil(500, 430, 630, 430, ACC, 6) + pil(970, 430, 1100, 430, ACC, 6)
    # udloeser: push
    o += path("M330 520 V370 M290 410 L330 370 L370 410", "none", ACC, SW)
    o += text(330, 565, "push til GitHub", 22, "normal", INK, "middle")
    # port: vaegt med palle
    o += vaegt(800, 440, 0.9) + palle(800, 390, 0.5)
    o += circle(930, 340, 16, OK, OK, 1) + circle(930, 380, 16, FEJLBG, FEJL, 3)
    o += text(800, 565, "hver palle vejes, hver gang", 22, "normal", INK, "middle")
    # deploy
    o += lastbil(1270, 440, 1.0) + bom(1400, 470, 0.8, aaben=True)
    o += text(1270, 565, "bilen frigives på grønt", 22, "normal", INK, "middle")
    # menneske ved review-port
    o += person(800, 690, 0.9) + text(800, 760, "Review-porten: her sidder et menneske", 22, "bold", INK, "middle")
    o += line(800, 600, 800, 640, LINJE, 3, "8 8")
    o += ur(150, 700, 40, 7, 0) + ur(250, 700, 40, 17, 0) + text(200, 770, "kl. 7 som kl. 17", 20, "normal", DAEMP, "middle")
    return ramme("MODUL 09", "Produktions-workflows", "Samme kontrol hver gang. Grønt før bilen kører.", o)


def s10():
    o = ""
    o += rect(120, 190, 1360, 590, FLADE, LINJE, 20, 3)
    o += text(150, 235, "Det lille speditionskontor", 24, "bold", DAEMP)
    st = [("Instruks", "CLAUDE.md", 300, 380, lambda x, y: dok(x - 40, y - 55, 80, 100, ACC, ACCBG, 4)),
          ("Procedure", "skill", 560, 380, lambda x, y: tjekliste(x - 45, y - 55, 90, 110, ACC, 4, False)),
          ("Opslag", "MCP", 820, 380, lambda x, y: stik(x, y, 0.9)),
          ("Automatisk kontrol", "hook", 1080, 380, lambda x, y: bom(x - 30, y + 10, 0.7, aaben=False)),
          ("Kollega, der regner efter", "subagent", 1340, 380, lambda x, y: person(x, y, 1.0))]
    for navn, rolle, x, y, ik in st:
        o += circle(x, y, 80, ACCBG, ACC, 3)
        o += ik(x, y)
        o += text(x, 500, navn, 21, "bold", INK, "middle") + pille(x, 545, rolle, 18, KODE, INK, INK, "bold", 12)
    for i in range(4):
        o += pil(390 + i * 260, 380, 470 + i * 260, 380, ACC, 5)
    o += person(160, 660, 0.9) + text(160, 735, "Du", 22, "bold", INK, "middle")
    o += pil(420, 640, 520, 470, ACC, 4) + pille(300, 660, "/takstopdatering 5", 20, KODE, INK, INK, "bold", 14)
    o += pil(1340, 470, 1340, 620, ACC, 4) + dok(1300, 630, 80, 100, OK, OKBG, 4) + text(1340, 760, "Én oversigt", 22, "bold", OK, "middle")
    return ramme("MODUL 10", "Byg dit eget agent-system", "Fem dele, én bestilling, ét system.", o)


def s11():
    o = ""
    # sky
    o += path("M170 400 A60 60 0 0 1 250 330 A80 80 0 0 1 400 320 A60 60 0 0 1 480 400 A50 50 0 0 1 440 480 H200 A50 50 0 0 1 170 400 Z", KODE, DAEMP, 4)
    o += lines(325, 395, ["Bedre overblik", "over forsendelser"], 22, INK, "middle", 1.3, "bold")
    o += text(325, 540, "Et ønske", 22, "bold", DAEMP, "middle")
    # fire skridt
    skridt = ["Behov", "Opgave", "Acceptkriterium", "Bevis"]
    for i, s in enumerate(skridt):
        x = 590 + i * 170
        o += nummer(x, 400, i + 1, 30, ACC, ACCBG, 26) + text(x, 460, s, 20, "bold", INK, "middle")
        if i < 3:
            o += pil(x + 40, 400, x + 130, 400, ACC, 5)
    o += pil(500, 400, 550, 400, ACC, 5)
    # tre kort
    for i in range(3):
        x = 1250
        y = 250 + i * 110
        o += rect(x, y, 260, 85, FLADE, OK, 10, 3)
        o += flueben(x + 40, y + 42, 22)
        o += path(f"M{x + 80} {y + 32} H{x + 230} M{x + 80} {y + 56} H{x + 190}", "none", LINJE, 5)
    o += text(1380, 600, "Tre ændringer", 22, "bold", OK, "middle") + text(1380, 628, "en fremmed kan afgøre er lavet", 20, "normal", DAEMP, "middle")
    o += pil(1140, 400, 1235, 400, OK, 5)
    # graensen
    o += path("M150 680 H1100", "none", DAEMP, 3, "14 10")
    o += person(220, 740, 0.7, DAEMP, KODE) + text(280, 745, "Skøn og forhandling bliver hos mennesker", 22, "normal", DAEMP)
    o += text(150, 662, "grænsen", 18, "bold", DAEMP)
    return ramme("MODUL 11", "Fra forretningskontekst til agent-opgaver", "Fra ønske til opgave, en fremmed kan efterprøve.", o)


def s12():
    o = ""
    # oeverst: alle mandag
    o += kalender(200, 280, 0.9, FEJL, "Man") + text(200, 380, "Hele afdelingen", 22, "bold", FEJL, "middle")
    for i in range(12):
        o += person(340 + (i % 6) * 62, 250 + (i // 6) * 85, 0.55, FEJL, FEJLBG)
    o += path("M800 210 L760 300 H795 L775 370 L840 270 H805 L825 210 Z", FEJLBG, FEJL, 4)
    o += kryds(880, 220, 28)
    # nederst: tre i seks uger
    o += kalender(200, 560, 0.9, OK, "6 uger") + text(200, 660, "Tre disponenter", 22, "bold", OK, "middle")
    for i in range(3):
        o += person(340 + i * 70, 560, 0.7, OK, OKBG)
    o += pil(580, 560, 700, 560, OK, 5)
    for i in range(12):
        o += person(740 + (i % 6) * 55, 530 + (i // 6) * 75, 0.5, OK, OKBG)
    o += flueben(1080, 500, 28)
    o += text(880, 680, "så alle", 20, "normal", DAEMP, "middle")
    # fem felter
    felter = [("Permissions", lambda x, y: noegle(x, y, 0.7)), ("Data", lambda x, y: database(x, y, 0.7)),
              ("Godkendelse", lambda x, y: stempel(x, y + 10, 0.6)), ("Kompetence", lambda x, y: hue(x, y, 0.7)),
              ("Tillid", lambda x, y: skjold(x, y, 0.7))]
    o += text(1330, 235, "Fem felter i lærredet", 22, "bold", ACC, "middle")
    for i, (navn, ik) in enumerate(felter):
        y = 270 + i * 100
        o += rect(1190, y, 280, 84, FLADE, ACC, 10, 2)
        o += ik(1240, y + 42)
        o += text(1300, y + 50, navn, 22, "bold", INK)
    return ramme("MODUL 12", "Enterprise-adoption", "Tre disponenter i seks uger slår hele afdelingen mandag.", o)


def s13():
    o = ""
    o += tavle(120, 200, 900, 560) + text(570, 222, "KPI-tavlen", 20, "bold", FLADE, "middle")
    maal_ = [("Forsøg per opgave", [5, 4, 4, 3, 3, 2, 2]), ("Røde kørsler på GitHub", [4, 4, 3, 3, 2, 2, 1]),
             ("Pris per løst opgave", [6, 5, 5, 4, 4, 3, 3]), ("Løst uden indgriben", [1, 2, 2, 3, 4, 4, 5])]
    for i, (navn, pts) in enumerate(maal_):
        x = 160 + (i % 2) * 440
        y = 260 + (i // 2) * 245
        o += rect(x, y, 400, 215, BG, LINJE, 10, 2)
        o += text(x + 20, y + 40, navn, 22, "bold", INK)
        o += gnist(x + 30, y + 70, 340, 110, pts, ACC, 5)
        o += path(f"M{x + 30} {y + 190} H{x + 370}", "none", LINJE, 2)
    o += text(570, 745, "uge for uge", 20, "normal", DAEMP, "middle")
    # en god dag vs trend
    o += rect(1060, 200, 420, 240, FLADE, ACC, 12, 3)
    o += text(1270, 240, "Én god dag", 22, "bold", FEJL, "middle")
    o += gnist(1090, 270, 360, 120, [3, 4, 3, 9, 3, 4, 3], DAEMP, 4)
    o += circle(1270, 275, 12, FEJLBG, FEJL, 3)
    o += text(1270, 425, "Tal over tid, ikke ét udsving", 20, "normal", DAEMP, "middle")
    # kilder
    o += text(1270, 500, "Kilder", 20, "bold", DAEMP, "middle")
    o += pille(1160, 545, "/usage", 18, KODE, INK, INK, "bold", 12) + pille(1330, 545, "/context", 18, KODE, INK, INK, "bold", 12)
    o += pille(1245, 600, "transkript og repo", 18, KODE, INK, INK, "normal", 12)
    # pension
    o += kasse(1270, 700, 0.8, DAEMP) + text(1380, 705, "pensionér", 20, "bold", DAEMP) + text(1380, 730, "det, der ikke måler bedre", 17, "normal", DAEMP)
    return ramme("MODUL 13", "Observability og livscyklus", "Tal over tid, ikke én god dag.", o)


def s14():
    o = ""
    # venstre: systemet fra modul 10
    o += rect(120, 220, 480, 400, FLADE, ACC, 14, 3) + text(360, 262, "Systemet fra modul 10", 22, "bold", ACC, "middle")
    ik = [lambda x, y: dok(x - 25, y - 30, 50, 60, ACC, ACCBG, 3, 3), lambda x, y: tjekliste(x - 25, y - 30, 50, 60, ACC, 3, False),
          lambda x, y: stik(x, y, 0.5), lambda x, y: bom(x - 15, y + 5, 0.4, False), lambda x, y: person(x, y, 0.6)]
    for i, f in enumerate(ik):
        o += circle(190 + i * 85, 360, 40, ACCBG, ACC, 2) + f(190 + i * 85, 360)
    o += text(360, 470, "×100 kørsler, samme resultat", 22, "bold", INK, "middle")
    o += gnist(170, 500, 380, 80, [5, 3, 3, 3, 3, 3, 3, 3], OK, 4) + text(360, 605, "stabilt", 18, "normal", DAEMP, "middle")
    # tragt
    o += pil(620, 420, 690, 420, ACC, 6)
    o += tragt(800, 420, 1.0) + text(800, 530, "Destillér", 24, "bold", ACC, "middle")
    o += pil(910, 420, 980, 420, ACC, 6)
    # hoejre: script og en atomar agent
    o += rect(1000, 220, 480, 400, FLADE, OK, 14, 3) + text(1240, 262, "Destillatet", 22, "bold", OK, "middle")
    o += tjekliste(1080, 300, 110, 140, OK, 4, True) + text(1135, 480, "Script eller skill", 20, "bold", INK, "middle") + text(1135, 506, "rutinen", 18, "normal", DAEMP, "middle")
    o += chip(1360, 360, 0.7, ACC, "") + person(1360, 470, 0.6) + text(1360, 530, "Én atomar agent", 20, "bold", INK, "middle") + text(1360, 556, "skønnet", 18, "normal", DAEMP, "middle")
    o += text(1240, 600, "færre dele, færre kald, billigere, forudsigeligt", 19, "normal", DAEMP, "middle")
    # bund: regel
    o += text(800, 700, "Rutine kan skrives ned. Skøn kan ikke.", 26, "bold", INK, "middle")
    o += path("M560 720 H1040", "none", ACC, 4)
    return ramme("MODUL 14", "Atomare agenter og software-distillation", "Rutine bliver script. Skønnet bliver hos den erfarne.", o)


SCENER = [
    ("00-hvad-er-agentic-engineering", s00),
    ("01-den-agentiske-loekke", s01),
    ("02-opsaetning-af-miljoe", s02),
    ("03-kontekst-engineering", s03),
    ("04-effektiv-prompting", s04),
    ("05-vaerktoejer-mcp-forbindelser", s05),
    ("06-verifikation-og-kvalitetsporte", s06),
    ("07-subagenter-og-parallelitet", s07),
    ("08-langtkoerende-agenter-og-hukommelse", s08),
    ("09-produktions-workflows", s09),
    ("10-byg-dit-eget-agent-system", s10),
    ("11-fra-forretningskontekst-til-opgaver", s11),
    ("12-enterprise-adoption", s12),
    ("13-observability-og-livscyklus", s13),
    ("14-atomare-agenter", s14),
]

HTML = """<!doctype html>
<html lang="da"><head><meta charset="utf-8"><title>{titel}</title>
<style>@page {{ size: {w}px {h}px; margin: 0; }} html, body {{ margin: 0; padding: 0; background: {bg}; }} svg {{ display: block; width: {w}px; height: {h}px; }}</style>
</head><body>
<div data-document-role="page" data-label="{titel}">
{svg}
</div>
</body></html>
"""


def main():
    os.makedirs(os.path.join(ROD, "svg"), exist_ok=True)
    os.makedirs(os.path.join(ROD, "html"), exist_ok=True)
    for slug, fn in SCENER:
        svg = fn()
        with open(os.path.join(ROD, "svg", slug + ".svg"), "w", encoding="utf-8") as f:
            f.write(svg + "\n")
        titel = svg.split("<title>")[1].split("</title>")[0]
        with open(os.path.join(ROD, "html", slug + ".html"), "w", encoding="utf-8") as f:
            f.write(HTML.format(titel=titel, w=W, h=H, bg=BG, svg=svg))
        print("skrev", slug)


if __name__ == "__main__":
    main()
