// Turkey Map Background Animation
const canvas = document.getElementById('turkeyMapCanvas');
const ctx = canvas.getContext('2d');

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
canvas.style.opacity = '0';
canvas.style.transition = 'opacity 2s ease-in-out';

// Alert mode color support
function isAlertMode() {
    return document.body.classList.contains('alert-mode');
}

function getMapColor(opacity = 1) {
    return isAlertMode()
        ? `rgba(255, 0, 0, ${opacity})`   // Red in alert mode
        : `rgba(0, 255, 157, ${opacity})`; // Green in normal mode
}

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('load', () => {
    setTimeout(() => { canvas.style.opacity = '1'; }, 100);
});

let mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

function isMobile() { return window.innerWidth <= 768; }

// Türkiye koordinatlarını ekran koordinatlarına çevir
function geoToScreen(lon, lat) {
    const minLon = 25, maxLon = 45;
    const minLat = 35, maxLat = 43;

    // Mobil için 90 derece döndür
    if (isMobile()) {
        const mapWidth = width * 0.9;
        const mapHeight = height * 0.75;
        const offsetX = (width - mapWidth) / 2;
        const offsetY = (height - mapHeight) / 2;

        // X ve Y eksenlerini değiştir (90 derece dönüş)
        const x = offsetX + mapWidth - ((lat - minLat) / (maxLat - minLat)) * mapWidth;
        const y = offsetY + ((lon - minLon) / (maxLon - minLon)) * mapHeight;

        return { x, y };
    }

    // Desktop için normal
    const mapWidth = width * 0.85;
    const mapHeight = height * 0.7;
    const offsetX = (width - mapWidth) / 2;
    const offsetY = (height - mapHeight) / 2;

    const x = offsetX + ((lon - minLon) / (maxLon - minLon)) * mapWidth;
    const y = offsetY + mapHeight - ((lat - minLat) / (maxLat - minLat)) * mapHeight;

    return { x, y };
}

// Türkiye sınır koordinatları - Detaylı (~150 nokta)
const turkeyMainland = [
    // Karadeniz kıyısı
    [36.91, 41.34], [37.10, 41.32], [37.30, 41.28], [37.50, 41.20], [37.70, 41.10], [37.90, 41.00], [38.10, 40.98], [38.35, 40.95],
    [38.55, 40.98], [38.75, 41.02], [39.00, 41.05], [39.25, 41.08], [39.51, 41.10], [39.75, 41.08], [40.00, 41.02], [40.20, 41.00],
    [40.37, 41.01], [40.55, 41.03], [40.75, 41.08], [41.00, 41.15], [41.20, 41.25], [41.40, 41.38], [41.55, 41.54], [41.70, 41.55],
    [41.90, 41.52], [42.10, 41.50], [42.30, 41.54], [42.50, 41.56], [42.62, 41.58],
    // Gürcistan - Ermenistan
    [42.85, 41.50], [43.00, 41.42], [43.20, 41.30], [43.40, 41.18], [43.58, 41.09], [43.68, 40.95], [43.75, 40.74], [43.75, 40.55],
    [43.72, 40.40], [43.66, 40.25], [43.70, 40.15], [43.85, 40.08], [44.00, 40.00], [44.15, 39.90], [44.30, 39.80], [44.45, 39.85],
    [44.60, 39.78], [44.79, 39.71], [44.75, 39.55], [44.60, 39.45], [44.35, 39.42], [44.11, 39.43],
    // İran sınırı
    [44.18, 39.25], [44.25, 39.05], [44.32, 38.80], [44.38, 38.55], [44.42, 38.28], [44.38, 38.05], [44.28, 37.95], [44.35, 37.75],
    [44.48, 37.50], [44.65, 37.30], [44.77, 37.17], [44.68, 37.08], [44.50, 37.02], [44.29, 37.00],
    // Irak - Suriye sınırı
    [44.05, 37.05], [43.80, 37.15], [43.55, 37.22], [43.30, 37.28], [43.00, 37.32], [42.78, 37.39], [42.55, 37.35], [42.30, 37.25],
    [42.05, 37.18], [41.80, 37.12], [41.55, 37.09], [41.30, 37.07], [41.05, 37.07], [40.80, 37.08], [40.55, 37.08], [40.30, 37.00],
    [40.05, 36.92], [39.80, 36.82], [39.55, 36.74], [39.30, 36.72], [39.05, 36.71], [38.80, 36.70], [38.55, 36.72], [38.30, 36.78],
    [38.17, 36.90],
    // Hatay bölgesi - daha ince
    [37.95, 36.82], [37.70, 36.72], [37.45, 36.65], [37.20, 36.55], [37.00, 36.50], [36.80, 36.55], [36.65, 36.60],
    [36.55, 36.50], [36.50, 36.35], [36.45, 36.20], [36.42, 36.10], [36.38, 36.00], [36.30, 35.90], [36.22, 35.82],
    [36.15, 35.80], [36.05, 35.85], [35.92, 36.00], [35.82, 36.20], [35.80, 36.35], [35.82, 36.50], [35.90, 36.58],
    [35.75, 36.55], [35.55, 36.55],
    // Akdeniz kıyısı
    [35.30, 36.62], [35.05, 36.68], [34.80, 36.75], [34.55, 36.72], [34.30, 36.55], [34.10, 36.35], [34.03, 36.22], [33.80, 36.15],
    [33.55, 36.12], [33.30, 36.10], [33.05, 36.10], [32.80, 36.10], [32.55, 36.10], [32.30, 36.15], [32.05, 36.25], [31.80, 36.42],
    [31.60, 36.58], [31.40, 36.65], [31.15, 36.68], [30.90, 36.68], [30.65, 36.68], [30.45, 36.55], [30.35, 36.35], [30.28, 36.20],
    [30.05, 36.18], [29.80, 36.15], [29.55, 36.18], [29.30, 36.28], [29.05, 36.45], [28.85, 36.58], [28.65, 36.68],
    // Ege kıyısı
    [28.40, 36.68], [28.15, 36.70], [27.90, 36.68], [27.65, 36.66], [27.45, 36.72], [27.30, 36.85], [27.18, 37.05], [27.10, 37.30],
    [27.05, 37.55], [27.02, 37.80], [26.95, 38.05], [26.85, 38.28], [26.72, 38.52], [26.60, 38.78], [26.50, 39.02], [26.38, 39.25],
    [26.25, 39.42], [26.17, 39.46], [26.25, 39.62], [26.38, 39.78], [26.52, 39.92], [26.68, 40.08], [26.85, 40.22], [27.05, 40.35],
    [27.28, 40.42],
    // Marmara bölgesi
    [27.50, 40.42], [27.75, 40.43], [28.00, 40.44], [28.25, 40.45], [28.50, 40.45], [28.75, 40.48], [28.95, 40.65], [29.08, 40.88],
    [29.18, 41.12], [29.24, 41.22],
    // Karadeniz'e dönüş
    [29.45, 41.18], [29.70, 41.12], [30.00, 41.05], [30.30, 41.00], [30.60, 41.02], [30.90, 41.05], [31.15, 41.09], [31.40, 41.18],
    [31.65, 41.32], [31.90, 41.48], [32.12, 41.62], [32.35, 41.74], [32.58, 41.82], [32.85, 41.90], [33.12, 41.97], [33.40, 42.00],
    [33.70, 42.02], [34.00, 42.02], [34.30, 42.02], [34.60, 42.03], [34.90, 42.04], [35.17, 42.04], [35.45, 42.02], [35.72, 41.90],
    [36.00, 41.72], [36.25, 41.58], [36.50, 41.45], [36.75, 41.38], [36.91, 41.34]
];

// Trakya (Avrupa yakası) - Detaylı (~40 nokta)
const turkeyThrace = [
    [27.19, 40.69], [27.05, 40.55], [26.88, 40.38], [26.70, 40.25], [26.52, 40.18], [26.36, 40.15], [26.22, 40.28], [26.12, 40.45],
    [26.05, 40.58], [26.04, 40.72], [26.06, 40.82], [26.12, 40.88], [26.22, 40.93], [26.29, 40.94], [26.38, 41.05], [26.48, 41.22],
    [26.55, 41.38], [26.60, 41.52], [26.58, 41.62], [26.48, 41.72], [26.35, 41.78], [26.20, 41.82], [26.12, 41.83], [26.18, 41.92],
    [26.32, 42.00], [26.52, 42.08], [26.75, 42.12], [27.00, 42.14], [27.25, 42.12], [27.50, 42.08], [27.75, 42.03], [28.00, 42.01],
    [28.08, 41.88], [28.12, 41.70], [28.18, 41.52], [28.35, 41.40], [28.55, 41.32], [28.78, 41.28], [28.92, 41.30], [28.88, 41.18],
    [28.80, 41.05], [28.65, 41.00], [28.42, 40.98], [28.18, 40.97], [27.92, 40.95], [27.68, 40.98], [27.45, 40.92], [27.19, 40.69]
];

// Türkiye şehirleri - doğru koordinatlar
const cities = [
    { name: 'İstanbul', lon: 28.95, lat: 41.02, size: 6 },
    { name: 'Ankara', lon: 32.85, lat: 39.93, size: 5 },
    { name: 'İzmir', lon: 27.15, lat: 38.42, size: 4 },
    { name: 'Bursa', lon: 29.05, lat: 40.20, size: 4 },
    { name: 'Antalya', lon: 30.70, lat: 36.90, size: 4 },
    { name: 'Adana', lon: 35.32, lat: 37.00, size: 3 },
    { name: 'Konya', lon: 32.48, lat: 37.87, size: 3 },
    { name: 'Gaziantep', lon: 37.38, lat: 37.07, size: 3 },
    { name: 'Samsun', lon: 36.33, lat: 41.29, size: 3 },
    { name: 'Trabzon', lon: 39.73, lat: 41.00, size: 3 },
    { name: 'Erzurum', lon: 41.27, lat: 39.90, size: 3 },
    { name: 'Diyarbakır', lon: 40.23, lat: 37.91, size: 3 },
    { name: 'Eskişehir', lon: 30.52, lat: 39.78, size: 3 },
    { name: 'Kayseri', lon: 35.48, lat: 38.73, size: 3 },
    { name: 'Van', lon: 43.38, lat: 38.49, size: 2 }
];

let cityNodes = [];
let connections = [];

class CityNode {
    constructor(city) {
        const pos = geoToScreen(city.lon, city.lat);
        this.x = pos.x;
        this.y = pos.y;
        this.baseSize = city.size;
        this.size = city.size;
        this.name = city.name;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.03 + Math.random() * 0.02;
        this.opacity = 0.7 + Math.random() * 0.3;
    }

    draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.baseSize * 5);
        gradient.addColorStop(0, getMapColor(this.opacity * 0.5));
        gradient.addColorStop(0.5, getMapColor(this.opacity * 0.15));
        gradient.addColorStop(1, getMapColor(0));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.baseSize * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = getMapColor(this.opacity);
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(2, this.size), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.9})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(1, this.size * 0.4), 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.pulsePhase += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulsePhase) * this.baseSize * 0.4;

        if (mouse.x != null && mouse.y != null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                this.opacity = Math.min(1, this.opacity + 0.04);
                this.pulseSpeed = 0.08;
            } else {
                this.opacity = Math.max(0.6, this.opacity - 0.02);
                this.pulseSpeed = 0.03;
            }
        }
    }
}

class NetworkConnection {
    constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.opacity = 0.15 + Math.random() * 0.1;
        this.dataPackets = [];
        this.packetSpawnRate = 0.008 + Math.random() * 0.012;
    }

    draw() {
        ctx.strokeStyle = getMapColor(this.opacity);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.node1.x, this.node1.y);
        ctx.lineTo(this.node2.x, this.node2.y);
        ctx.stroke();

        for (let packet of this.dataPackets) {
            ctx.fillStyle = getMapColor(packet.opacity);
            ctx.beginPath();
            ctx.arc(packet.x, packet.y, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = getMapColor(packet.opacity * 0.3);
            ctx.beginPath();
            ctx.arc(packet.prevX, packet.prevY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    update() {
        // Speed multiplier in alert mode
        const speedMultiplier = isAlertMode() ? 3 : 1;
        const spawnMultiplier = isAlertMode() ? 4 : 1;

        if (Math.random() < this.packetSpawnRate * spawnMultiplier) {
            const reverse = Math.random() > 0.5;
            this.dataPackets.push({
                progress: 0,
                speed: (0.008 + Math.random() * 0.015) * speedMultiplier,
                opacity: 0.7 + Math.random() * 0.3,
                reverse: reverse,
                x: reverse ? this.node2.x : this.node1.x,
                y: reverse ? this.node2.y : this.node1.y,
                prevX: reverse ? this.node2.x : this.node1.x,
                prevY: reverse ? this.node2.y : this.node1.y
            });
        }

        for (let i = this.dataPackets.length - 1; i >= 0; i--) {
            const packet = this.dataPackets[i];
            packet.prevX = packet.x;
            packet.prevY = packet.y;
            packet.progress += packet.speed * (isAlertMode() ? 2 : 1);

            if (packet.reverse) {
                packet.x = this.node2.x + (this.node1.x - this.node2.x) * packet.progress;
                packet.y = this.node2.y + (this.node1.y - this.node2.y) * packet.progress;
            } else {
                packet.x = this.node1.x + (this.node2.x - this.node1.x) * packet.progress;
                packet.y = this.node1.y + (this.node2.y - this.node1.y) * packet.progress;
            }

            if (packet.progress >= 1) {
                this.dataPackets.splice(i, 1);
            }
        }

        if (mouse.x != null && mouse.y != null) {
            const midX = (this.node1.x + this.node2.x) / 2;
            const midY = (this.node1.y + this.node2.y) / 2;
            const dx = mouse.x - midX;
            const dy = mouse.y - midY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                this.opacity = Math.min(0.5, this.opacity + 0.02);
                this.packetSpawnRate = 0.08;
            } else {
                this.opacity = Math.max(0.1, this.opacity - 0.008);
                this.packetSpawnRate = 0.015;
            }
        }
    }
}

function drawTurkeyMap() {
    ctx.strokeStyle = getMapColor(0.25);
    ctx.fillStyle = getMapColor(0.03);
    ctx.lineWidth = 2;

    // Ana kara (Anadolu) çiz
    ctx.beginPath();
    for (let i = 0; i < turkeyMainland.length; i++) {
        const pos = geoToScreen(turkeyMainland[i][0], turkeyMainland[i][1]);
        if (i === 0) ctx.moveTo(pos.x, pos.y);
        else ctx.lineTo(pos.x, pos.y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // Trakya (Avrupa yakası) çiz
    ctx.beginPath();
    for (let i = 0; i < turkeyThrace.length; i++) {
        const pos = geoToScreen(turkeyThrace[i][0], turkeyThrace[i][1]);
        if (i === 0) ctx.moveTo(pos.x, pos.y);
        else ctx.lineTo(pos.x, pos.y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

function createConnections() {
    connections = [];
    const maxConnections = isMobile() ? 30 : 35;
    let count = 0;

    for (let i = 0; i < cityNodes.length && count < maxConnections; i++) {
        let distances = [];
        for (let j = 0; j < cityNodes.length; j++) {
            if (i !== j) {
                const dx = cityNodes[i].x - cityNodes[j].x;
                const dy = cityNodes[i].y - cityNodes[j].y;
                distances.push({ index: j, dist: Math.sqrt(dx * dx + dy * dy) });
            }
        }
        distances.sort((a, b) => a.dist - b.dist);

        for (let k = 0; k < 3 && k < distances.length && count < maxConnections; k++) {
            const j = distances[k].index;
            const exists = connections.some(c =>
                (c.node1 === cityNodes[i] && c.node2 === cityNodes[j]) ||
                (c.node1 === cityNodes[j] && c.node2 === cityNodes[i])
            );
            if (!exists) {
                connections.push(new NetworkConnection(cityNodes[i], cityNodes[j]));
                count++;
            }
        }
    }
}

function init() {
    cityNodes = [];
    connections = [];

    for (let city of cities) {
        cityNodes.push(new CityNode(city));
    }
    createConnections();
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    drawTurkeyMap();

    for (let conn of connections) {
        conn.draw();
        conn.update();
    }

    for (let node of cityNodes) {
        node.draw();
        node.update();
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
});

init();
animate();
