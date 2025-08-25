export default function SettingsSelector({ settings, setSettings }) {
  if (!settings) return null

  return (
    <div>
      <label>
        Number of digits:
        <select
          value={settings.num}
          onChange={(e) =>
            setSettings({ ...settings, num: parseInt(e.target.value) })
          }
        >
          {[4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
      <label>
        Max digits:
        <select
          value={settings.max}
          onChange={(e) =>
            setSettings({ ...settings, max: parseInt(e.target.value) })
          }
        >
          {[7, 8, 9, 10].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
    </div>
  )
}