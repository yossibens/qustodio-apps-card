# Qustodio Apps Card

A custom Lovelace card for **Home Assistant** designed to track your children's daily screen time using the Qustodio integration.

This enhanced version allows you to set a dynamic quota (via a Home Assistant entity) and features built-in action buttons to grant extra bonus time with a single click.

<!-- Add a screenshot here -->

<!-- ![Qustodio Apps Card](images/screenshot.png) -->

## Features

* 📊 **Clear Visualization**: Displays time used, time remaining, and the overall quota limit.
* 🎨 **Adaptive Design**: Seamlessly blends with your Home Assistant theme (uses `var(--primary-color)` for the most-used app).
* ⚙️ **Dynamic Quota**: Bind the card to an `input_number` helper to manage a custom quota (e.g. bonus screen time).
* 🚀 **Built-in Action Buttons**: Interactive buttons (+15 min, +30 min, +60 min) that directly trigger your Home Assistant script.
* 📱 **Multi-Child Ready**: Automatically extracts the child's first name from the entity ID to run scripts targeted at the correct child.

---

## Installation

### Method 1: Via HACS (Recommended)

1. In Home Assistant, navigate to **HACS** → **Frontend**.

2. Click the three dots in the top-right corner and select **Custom repositories**.

3. Paste the URL of this GitHub repository:

   ```
   https://github.com/yossibens/qustodio-apps-card
   ```

4. Select **Lovelace** as the category and click **Add**.

5. Find **Qustodio Apps Card** in the list and click **Download**.

### Method 2: Manual Installation

1. Download the `qustodio-apps-card.js` file.

2. Place it in:

   ```
   config/www/qustodio_apps_card/qustodio-card.js
   ```

3. In Home Assistant, go to **Settings** → **Dashboards** → **Resources**.

4. Click **Add Resource**:

   * **URL:** `/local/qustodio_apps_card/qustodio-card.js?v=1.0.0`
   * **Resource Type:** `JavaScript Module`

5. Restart Home Assistant if you created the `www` folder for the first time.

---

## YAML Configuration

Add this card to your dashboard using the YAML editor:

```yaml
type: custom:qustodio-apps-card
entity: sensor.YOURCHILDNAME
quota_entity: input_number.YOURCHILDNAME_temps_bonus_qustodio
name: "YOURCHILDNAME's Screen Time"
```

---

## Configuration Options

| Parameter      | Type   | Required | Description                                                                                                                                               |
| -------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`         | String | ✅ Yes    | Must be `custom:qustodio-apps-card`                                                                                                                       |
| `entity`       | String | ✅ Yes    | The Qustodio sensor entity for the child (e.g. `sensor.julien`)                                                                                             |
| `quota_entity` | String | ❌ No     | An `input_number` entity containing the total quota in minutes (managed by your automations). If omitted, the card defaults to the native Qustodio quota. |
| `name`         | String | ❌ No     | Custom title displayed at the top of the card.                                                                                                            |

---

## Script Requirements for Action Buttons

For the **15 min**, **30 min**, and **60 min** buttons to work, you must create a Home Assistant script named exactly:

```yaml
script.qustodio_add_extra_time_bonus
```

This script must accept the following variables:

| Variable  | Description                                       | Example             |
| --------- | ------------------------------------------------- | ------------------- |
| `enfant`  | Receives the extracted child name from the entity | `julien`              |
| `minutes` | Number of minutes to add                          | `15`, `30`, or `60` |

### Example Script

```yaml
qustodio_add_extra_time_bonus:
  alias: "Qustodio - Add Extra Time Bonus"

  fields:
    enfant:
      description: "The name of the child"
      example: "julien"

    minutes:
      description: "Minutes to add"
      example: 15

  sequence:
    - service: input_number.set_value
      target:
        entity_id: "input_number.{{ enfant }}_temps_bonus_qustodio"
      data:
        value: >
          {{ states('input_number.' ~ enfant ~ '_temps_bonus_qustodio') | float + minutes }}
```
