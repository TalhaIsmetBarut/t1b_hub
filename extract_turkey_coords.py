"""
Türkiye sınır koordinatlarını Natural Earth datasetinden çeken script.
Geopandas ve matplotlib kullanarak ~300 koordinat noktası çıkarır.
"""

import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np
from shapely.geometry import Polygon, MultiPolygon

# Natural Earth 110m (veya 50m/10m) countries dataset'ini indir
print("Natural Earth dataseti indiriliyor...")
world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))

# Türkiye'yi filtrele
turkey = world[world['name'] == 'Turkey']

if turkey.empty:
    # Alternatif isim dene
    turkey = world[world['iso_a3'] == 'TUR']

print(f"Türkiye bulundu: {not turkey.empty}")

# Geometriyi al
turkey_geom = turkey.geometry.values[0]

# Koordinatları çıkar
def extract_coords(geometry, target_points=300):
    """Geometriden koordinatları çıkar ve hedef sayıya simplify et"""
    coords = []
    
    if isinstance(geometry, Polygon):
        # Dış sınır koordinatlarını al
        exterior_coords = list(geometry.exterior.coords)
        coords.extend(exterior_coords)
    elif isinstance(geometry, MultiPolygon):
        # En büyük polygon'u al (ana kara)
        largest = max(geometry.geoms, key=lambda x: x.area)
        exterior_coords = list(largest.exterior.coords)
        coords.extend(exterior_coords)
    
    # Eğer çok fazla nokta varsa, eşit aralıklarla örnekle
    if len(coords) > target_points:
        step = len(coords) // target_points
        coords = coords[::step]
    
    # Hedef sayıya yaklaştır
    if len(coords) > target_points:
        coords = coords[:target_points]
    
    return coords

# Koordinatları çıkar
coordinates = extract_coords(turkey_geom, target_points=300)

print(f"\nToplam {len(coordinates)} koordinat noktası çıkarıldı.\n")

# Koordinatları [lon, lat] formatında listele
coord_list = [[round(lon, 4), round(lat, 4)] for lon, lat in coordinates]

# JavaScript formatında yazdır
print("// JavaScript için koordinat listesi:")
print("const turkeyBorder = [")
for i, coord in enumerate(coord_list):
    comma = "," if i < len(coord_list) - 1 else ""
    print(f"    [{coord[0]}, {coord[1]}]{comma}")
print("];")

# Matplotlib ile çiz
fig, ax = plt.subplots(1, 1, figsize=(14, 8))

# Türkiye'yi çiz
turkey.plot(ax=ax, color='lightgreen', edgecolor='darkgreen', linewidth=2)

# Koordinat noktalarını çiz
lons = [c[0] for c in coord_list]
lats = [c[1] for c in coord_list]
ax.scatter(lons, lats, c='red', s=10, zorder=5, label=f'{len(coord_list)} nokta')

# Başlık ve etiketler
ax.set_title(f'Türkiye Sınır Koordinatları ({len(coord_list)} nokta)', fontsize=14, fontweight='bold')
ax.set_xlabel('Boylam (Longitude)')
ax.set_ylabel('Enlem (Latitude)')
ax.legend()
ax.grid(True, alpha=0.3)

# Kaydet ve göster
plt.tight_layout()
plt.savefig('turkey_map.png', dpi=150)
print("\nHarita 'turkey_map.png' olarak kaydedildi.")
plt.show()
