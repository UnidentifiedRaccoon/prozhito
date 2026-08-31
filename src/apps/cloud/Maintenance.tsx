import type { ServiceStatus } from "./api";
import styles from "./Maintenance.module.css";
export function Maintenance({status}:{status:ServiceStatus|null}) {
  const scheduled=status?.mode==="scheduled_maintenance";
  return <main className={styles.page}>
    <p className={styles.brand}>Прожито</p>
    <div className={styles.content} role="status" aria-live="polite">
      <h1>{scheduled?"Проводятся технические работы":"Проверяем доступность сайта"}</h1>
      <p>{scheduled?"Каждый день с 00:00 до 08:00 МСК.":"Запуск может занять немного времени. Страница обновится автоматически после проверки."}</p>
      <p>Сайт доступен в штатном режиме с 08:00 до 00:00 МСК.</p>
      <button type="button" onClick={()=>window.location.reload()}>Проверить снова</button>
    </div>
  </main>;
}
