# Qustodio Apps Card

A custom Lovelace card for **Home Assistant** designed to track your children's daily screen time using the Qustodio integration. 

This enhanced version allows you to set a dynamic quota (via a Home Assistant entity) and features built-in action buttons to grant extra bonus time in a single click.

!

## Features

- 📊 **Clear Visualization**: Displays time used, time remaining, and the overall quota limit.
- 🎨 **Adaptive Design**: Seamlessly blends with your Home Assistant theme (uses `var(--primary-color)` for the most-used app).
- ⚙️ **Dynamic Quota**: Bind the card to an `input_number` helper to manage a custom quota (e.g., bonus screen time).
- 🚀 **Built-in Action Buttons**: Interactive buttons (+15 min, +30 min, +60 min) that directly trigger your Home Assistant script.
- 📱 **Multi-Child Ready**: Automatically extracts the child's first name from the entity ID to run scripts targeted at the correct child.

---

## Installation

### Method 1: Via HACS (Recommended)

1. In Home Assistant, navigate to **HACS** > **Interface**.
2. Click the three dots in the top right corner and select **Custom repositories**.
3. Paste the URL of this GitHub repository: `https://github.com/yossibens/qustodio-apps-card`
4. Select **Lovelace** as the category and click **Add**.
5. Find `Qustodio Apps Card` in the list and click **Download**.

### Method 2: Manual Installation

1. Download the `qustodio-apps-card.js` file.
2. Place the file inside your local configuration folder: `config/www/qustodio_apps_card/qustodio-card.js`.
3. In Home Assistant, go to **Settings** > **Dashboards** > **Three dots (top right)** > **Resources**.
4. Click **Add Resource**:
   - **URL:** `/local/qustodio_apps_card/qustodio-card.js?v=1.0.0`
   - **Resource type:** `JavaScript Module`
5. Restart Home Assistant if you just created the `www` folder for the very first time.

---

## YAML Configuration

Add this card to your dashboard using the code editor (YAML mode):

```yaml
type: custom:qustodio-apps-card
entity: sensor.YOURCHILDNAME
quota_entity: input_number.YOURCHILDNAME_temps_bonus_qustodio
name: "YOURCHILDNAME's Screen Time"


