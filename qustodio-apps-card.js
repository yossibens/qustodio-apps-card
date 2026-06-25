class QustodioAppsCard extends HTMLElement {
  setConfig(config) {
    this.config = config;
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  // Fonction pour appeler le script Home Assistant lors du clic sur un bouton
  _addTime(childName, minutes) {
    this._hass.callService('script', 'qustodio_add_extra_time_bonus', {
      enfant: childName,
      minutes: minutes
    });
  }

  _render() {
    const entity = this._hass.states[this.config.entity];
    if (!entity) return;

    // Extraction automatique du prénom (ex: sensor.aron devient aron)
    const childName = this.config.entity.split('.')[1];
	
    // 1. On récupère le nom de l'entité bonus passée dans le YAML (quota_entity)
    const quotaEntityName = this.config.quota_entity;
    const bonusInput = quotaEntityName ? this._hass.states[quotaEntityName] : null;

    // 2. Si le paramètre YAML existe et que l'entité est valide, on prend sa valeur.
    // Sinon, on garde par défaut le quota de l'entité Qustodio.
    const quota = bonusInput ? parseFloat(bonusInput.state) : (entity.attributes.quota_minutes || 0);

    const apps = entity.attributes.apps || [];
    const timeUsed = entity.attributes.time_used_minutes || 0;
    
    // 3. Calcul dynamique : total - utilisé
    const remaining = Math.max(0, quota - timeUsed);
    
    const pct = quota > 0 ? Math.min(100, Math.round(timeUsed / quota * 100)) : 0;
    const pctColor = pct >= 100 ? '#E24B4A' : pct >= 80 ? '#EF9F27' : '#1D9E75';
    const topApp = entity.attributes.top_app || '';
    const name = this.config.name || entity.attributes.friendly_name || 'Apps';

    const appsHtml = apps.length === 0
      ? `<p style="color:#888;font-size:13px;text-align:center;padding:1rem 0">Aucune application utilisée aujourd'hui</p>`
      : apps.map(app => {
          const thumb = app.thumbnail
            ? `<img src="${app.thumbnail}" style="width:32px;height:32px;border-radius:8px;object-fit:cover;flex-shrink:0" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            : '';
          const fallback = `<div style="width:32px;height:32px;border-radius:8px;background:#e0e0e0;display:${thumb ? 'none' : 'flex'};align-items:center;justify-content:center;font-size:14px;flex-shrink:0">📱</div>`;
          const barW = timeUsed > 0 ? Math.round(app.minutes / timeUsed * 100) : 0;
          const isTopApp = app.name === topApp;
          return `
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:0.5px solid rgba(0,0,0,0.06)">
              ${thumb}${fallback}
              <div style="flex:1;min-width:0">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                  <span style="font-size:13px;font-weight:${isTopApp ? '600' : '400'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:250px">${app.name}</span>
                  <span style="font-size:12px;color:#666;flex-shrink:0;margin-left:8px">${app.minutes} min</span>
                </div>
                <div style="height:4px;border-radius:2px;background:#f0f0f0;overflow:hidden">
                  <div style="height:100%;width:${barW}%;background:${isTopApp ? 'var(--primary-color)' : 'var(--info-color)'};border-radius:2px"></div>
                </div>
              </div>
            </div>`;
        }).join('');

    this.innerHTML = `
      <ha-card>
        <div style="padding:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <span style="font-size:15px;font-weight:500">${name}</span>
          </div>

          <div style="display:flex;gap:8px;margin-bottom:14px">
            <div style="flex:1;background:#f7f7f7;border-radius:10px;padding:10px;text-align:center">
              <div style="font-size:11px;color:#888;margin-bottom:2px">Utilisé</div>
              <div style="font-size:20px;font-weight:600;color:#333">${Math.round(timeUsed)}<span style="font-size:12px;font-weight:400"> min</span></div>
            </div>
            <div style="flex:1;background:#f7f7f7;border-radius:10px;padding:10px;text-align:center">
              <div style="font-size:11px;color:#888;margin-bottom:2px">Restant</div>
              <div style="font-size:20px;font-weight:600;color:#E24B4A">${Math.round(remaining)}<span style="font-size:12px;font-weight:400"> min</span></div>
            </div>
            <div style="flex:1;background:#f7f7f7;border-radius:10px;padding:10px;text-align:center">
              <div style="font-size:11px;color:#888;margin-bottom:2px">Quota</div>
              <div style="font-size:20px;font-weight:600;color:#1D9E75">${Math.round(quota)}<span style="font-size:12px;font-weight:400"> min</span></div>
            </div>
          </div>

          <div style="height:4px;background:#f0f0f0;overflow:hidden;margin-bottom:16px">
            <div style="height:100%;width:${pct}%"></div>
          </div>

          <div style="display:flex;gap:8px;margin-bottom:16px;">
            <button id="btn-15" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;background:var(--card-background-color);border:1px solid rgba(0,0,0,0.1);border-radius:10px;padding:10px;cursor:pointer;outline:none;">
              <ha-icon icon="mdi:plus-circle-outline" style="color:#4caf50;--mdc-icon-size:24px;padding:0 0 5px 0;"></ha-icon>
              <span style="font-size:12px;font-weight:bold;color:var(--primary-text-color)">15 min</span>
            </button>
            <button id="btn-30" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;background:var(--card-background-color);border:1px solid rgba(0,0,0,0.1);border-radius:10px;padding:10px;cursor:pointer;outline:none;">
              <ha-icon icon="mdi:plus-circle-outline" style="color:var(--primary-color);--mdc-icon-size:24px;padding:0 0 5px 0;"></ha-icon>
              <span style="font-size:12px;font-weight:bold;color:var(--primary-text-color)">30 min</span>
            </button>
            <button id="btn-60" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;background:var(--card-background-color);border:1px solid rgba(0,0,0,0.1);border-radius:10px;padding:10px;cursor:pointer;outline:none;">
              <ha-icon icon="mdi:plus-circle-outline" style="color:#f44336;--mdc-icon-size:24px;padding:0 0 5px 0;"></ha-icon>
              <span style="font-size:12px;font-weight:bold;color:var(--primary-text-color)">60 min</span>
            </button>
          </div>

          ${appsHtml}
        </div>
      </ha-card>`;

    // Liaison des événements de clic aux boutons injectés
    this.querySelector('#btn-15').addEventListener('click', () => this._addTime(childName, 15));
    this.querySelector('#btn-30').addEventListener('click', () => this._addTime(childName, 30));
    this.querySelector('#btn-60').addEventListener('click', () => this._addTime(childName, 60));
  }

  getCardSize() { return 5; }
  static getConfigElement() { return document.createElement('div'); }
  static getStubConfig() { return { entity: 'sensor.aron', quota_entity: '' }; }
}

customElements.define('qustodio-apps-card', QustodioAppsCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'qustodio-apps-card',
  name: 'Qustodio Apps Card',
  description: 'Affiche le temps d\'écran et le détail des apps Qustodio'
});
