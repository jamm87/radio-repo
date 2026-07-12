import re, json, glob, os

# Mapa de fichero -> (tipo, banda)
FUENTES = {
    '1_Repetidores':        ('Repetidor','144 MHz'),
    '2Repetidores':         ('Repetidor','28 MHz'),
    'Repetidores_y_balizas_-':('Repetidor','50 MHz'),   # el sin número
    '5Repetidores':         ('Repetidor','1200 MHz'),
    '6Repetidores':         ('Repetidor','ATV'),
    '7Repetidores':         ('Baliza','28 MHz'),
    '8Repetidores':         ('Baliza','50 MHz'),
    '9Repetidores':         ('Baliza','144 MHz'),
    '10Repetidores':        ('Baliza','432 MHz'),
    '11Repetidores':        ('Baliza','1200 MHz'),
}

def match_fuente(basename):
    # el fichero "Repetidores_y_balizas_-..." sin número es 50 MHz repetidores
    if re.match(r'^Repetidores_y_balizas_-', basename):
        return ('Repetidor','50 MHz')
    for k,(t,b) in FUENTES.items():
        if k=='Repetidores_y_balizas_-': continue
        if basename.startswith(k):
            return (t,b)
    return (None,None)

# subtono CTCSS
def get_subtono(s):
    m=re.search(r'[Ss]ubtono[:\s]*([\d]{2,3}[.,]\d)', s)
    if m: return m.group(1).replace(',','.')
    m=re.search(r'CTSS\s*([\d]{2,3})', s)
    if m: return m.group(1)
    return ''

# locator maidenhead (2 letras + 2 dígitos + 2 letras)
def get_locator(s):
    m=re.search(r'\b([A-R]{2}\d{2}[A-X]{2})\b', s)
    return m.group(1) if m else ''

def get_shift(s):
    m=re.search(r'([+\-]\s?\d+(?:[.,]\d+)?)\s*(kHz|MHz)', s)
    if m: return (m.group(1).replace(' ','')+' '+m.group(2))
    return ''

def get_modo(s):
    for mo in ['C4FM','D-Star','DMR','ATV FM','ATV','FM-N','FM','CW','SSB']:
        if re.search(r'\b'+re.escape(mo)+r'\b', s, re.I):
            return mo
    return ''

def get_canal(s):
    m=re.search(r'\((R[VHFS]?\d+[^\)]*?)\)', s)  # (RV58 - R5), (RF90), (RS20)
    if m: return m.group(1).strip()
    return ''

def get_altitud(s):
    m=re.search(r'[Aa]ltitud[:\s]*([\d.]+)\s*m|\(?[^\(]*?([\d]\.?\d{2,3})\s*m\.?\)?', s)
    if m:
        v=next((g for g in m.groups() if g), '')
        return v.replace('.','') if v else ''
    return ''

def get_titular(s):
    # el titular suele ir tras el locator o al final
    m=re.search(r'[A-R]{2}\d{2}[A-X]{2}\b(.*)$', s)
    tail = m.group(1) if m else s
    tail = re.sub(r'^[\s\-–]+','',tail)
    tail = re.sub(r'https?://\S+','',tail).strip(' -–\t')
    # quitar restos de subtono/altitud sueltos al principio
    return tail[:70]

rows=[]
for f in sorted(glob.glob('ure_txt/*.txt')):
    base=os.path.basename(f).replace('.txt','')
    tipo,banda=match_fuente(base)
    if not tipo:
        continue
    txt=open(f).read()
    for line in txt.split('\n'):
        line=line.strip()
        # callsign en cualquier posición (las líneas empiezan con un icono)
        cm=re.search(r'(E[AD]\d[A-Z]{2,5}(?:_[A-Z])?)\s+(.*)$', line)
        if not cm: continue
        call, rest = cm.groups()
        # descartar líneas de menú/navegación
        if 'MHz' not in rest and 'GHz' not in rest: continue
        # frecuencia: puede venir "145.712,5" (punto=miles, coma=decimal) o "145.725" o "1296.936"
        fm=re.search(r'(\d{1,4}(?:\.\d{3})?(?:,\d{1,4})?|\d{2,4}\.\d{1,4})\s*MHz', rest)
        if not fm:
            fm=re.search(r'(\d{2,4}[.,]\d{1,4})', rest)
        if not fm: continue
        fs=fm.group(1)
        if ',' in fs:
            # "145.712,5" -> el punto separa MHz de kHz, la coma es decimal de kHz
            # tratamos como 145 . 7125  => 145.7125 MHz
            ent, dec = fs.split(',')
            ent = ent.replace('.', '')          # 145712
            # los primeros 3 dígitos son MHz? No: 145 MHz + 712,5 kHz = 145.7125
            partes = fs.split('.')
            if len(partes)==2:                  # 145 . 712,5
                mhz = partes[0]
                khz = partes[1].replace(',', '.')   # 712.5
                freq = float(mhz) + float(khz)/1000
            else:
                freq = float(fs.replace('.','').replace(',','.'))
        else:
            freq=float(fs)
        estado='Activo'
        if re.search(r'[Ff]uera de servicio', rest): estado='Fuera de servicio'
        rows.append({
            'Callsign':call,
            'Frecuencia_MHz':round(freq,4),
            'Tipo':tipo,
            'Banda':banda,
            'Shift':get_shift(rest),
            'Modo':get_modo(rest) or ('FM' if tipo=='Repetidor' else 'CW'),
            'Canal':get_canal(rest),
            'Subtono_CTCSS':get_subtono(rest),
            'Locator':get_locator(rest),
            'Altitud_m':get_altitud(rest),
            'Titular':get_titular(rest),
            'Estado':estado,
            'raw':rest[:120]
        })

# dedup por (callsign, freq, banda)
seen=set(); uniq=[]
for r in rows:
    k=(r['Callsign'],r['Frecuencia_MHz'],r['Banda'])
    if k in seen: continue
    seen.add(k); uniq.append(r)

json.dump(uniq, open('ure_repetidores.json','w'), ensure_ascii=False, indent=1)
from collections import Counter
print(f"Total entradas URE parseadas: {len(uniq)}")
print("Por tipo/banda:")
for k,v in sorted(Counter((r['Tipo'],r['Banda']) for r in uniq).items()):
    print(f"   {k[0]:10} {k[1]:9} : {v}")
print("\nMuestra:")
for r in uniq[:4]:
    print("  ",r['Callsign'],r['Frecuencia_MHz'],r['Shift'],r['Modo'],r['Subtono_CTCSS'],r['Locator'],'|',r['Titular'][:35])
