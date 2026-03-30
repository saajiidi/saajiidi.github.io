/**
 * TACTICAL WIDGETS - v1.0
 * Live KPIs and Geospatial Impact Map
 */

class TacticalWidgets {
    static init() {
        this.renderLiveMetrics();
        this.renderImpactMap();
    }

    static renderLiveMetrics() {
        const html = `
            <div class="data-viz-widget card-glass draggable-widget" id="metricsWidget" style="top: 150px; right: 20px; width: 220px;">
                <div class="viz-header p-2 border-bottom border-primary border-opacity-10 d-flex justify-content-between align-items-center bg-dark bg-opacity-50">
                    <span class="font-mono small opacity-50">OPERATIONAL_KPI</span>
                    <i class="fas fa-chart-line text-primary small"></i>
                </div>
                <div class="p-3">
                    <div class="metric-item mb-3">
                        <div class="d-flex justify-content-between small mb-1">
                            <span class="opacity-50">DATA_FLOW</span>
                            <span class="text-primary font-mono" id="kpi-flow">1.2k/s</span>
                        </div>
                        <div class="progress" style="height: 2px; background: rgba(255,255,255,0.05)">
                            <div class="progress-bar bg-primary" id="pb-flow" style="width: 65%"></div>
                        </div>
                    </div>
                    <div class="metric-item mb-3">
                        <div class="d-flex justify-content-between small mb-1">
                            <span class="opacity-50">OPTIMIZATION</span>
                            <span class="text-primary font-mono">98.4%</span>
                        </div>
                        <div class="progress" style="height: 2px; background: rgba(255,255,255,0.05)">
                            <div class="progress-bar bg-primary" id="pb-opt" style="width: 98%"></div>
                        </div>
                    </div>
                    <div class="text-center mt-3 pt-2 border-top border-primary border-opacity-10">
                        <span class="font-mono" style="font-size: 0.6rem; color: var(--primary-color)">[STATUS: OPTIMAL]</span>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        this.startKPIAnimation();
    }

    static startKPIAnimation() {
        setInterval(() => {
            const flow = (Math.random() * 2 + 1).toFixed(1);
            const flowEl = document.getElementById('kpi-flow');
            if (flowEl) flowEl.innerText = `${flow}k/s`;
            
            const pb = document.getElementById('pb-flow');
            if (pb) pb.style.width = `${40 + Math.random() * 40}%`;
        }, 3000);
    }

    static renderImpactMap() {
        const container = document.getElementById('geospatial-impact');
        if (!container) return;

        const svgMap = `
            <div class="impact-map-container mt-5">
                <label class="section-label mb-4">GEOSPATIAL_OPERATIONAL_IMPACT</label>
                <div class="card-glass p-0 overflow-hidden" style="height: 400px; position: relative;">
                    <div class="map-overlay">
                        <div class="map-node node-dhaka" title="Home Base: Dhaka"></div>
                        <div class="map-pulse pulse-1"></div>
                        <div class="map-line line-1"></div>
                    </div>
                    <svg viewBox="0 0 1000 500" class="world-map-svg" style="width: 100%; height: 100%; opacity: 0.1; filter: grayscale(1) invert(1);">
                        <path fill="currentColor" d="M150,200 L160,210 L170,205 Z M800,250 L810,260 ..."></path>
                        <!-- Simple mockup path, in real use we'd use a proper GeoJSON path -->
                        <rect x="0" y="0" width="1000" height="500" fill="none" />
                        <image href="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" width="1000" height="500" />
                    </svg>
                    <div class="map-details p-3 position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-75 font-mono small">
                        <div class="d-flex justify-content-between">
                            <span>PRIMARY_NODE: DHAKA_HQ</span>
                            <span class="text-primary">LAT: 23.81 LNG: 90.41</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = svgMap;
    }
}

document.addEventListener('DOMContentLoaded', () => TacticalWidgets.init());
