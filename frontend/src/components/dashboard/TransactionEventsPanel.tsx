import styles from './TransactionEventsPanel.module.css';
import { TransactionEvent, TransactionEventsByClient } from '../../types/transactions';

interface TransactionEventsPanelProps {
  eventsByClient: TransactionEventsByClient;
  onAddClick: () => void;
  onView: (event: TransactionEvent) => void;
  onEdit: (event: TransactionEvent) => void;
}

const formatTimestamp = (isoString: string) =>
  new Date(isoString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export const TransactionEventsPanel = ({ eventsByClient, onAddClick, onView, onEdit }: TransactionEventsPanelProps) => {
  const entries = Object.entries(eventsByClient).sort(([a], [b]) => a.localeCompare(b));

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Transaction events</p>
          <h2 className={styles.title}>Connect transaction codes to the right projects.</h2>
          <p className={styles.description}>
            Keep a single source of truth for transaction identifiers so your teams avoid duplicate work.
          </p>
        </div>
        <button type="button" className="btn btn--filled" onClick={onAddClick}>
          Add transaction event
        </button>
      </header>

      {entries.length === 0 && (
        <div className={styles.emptyState}>
          <p>No transaction events yet.</p>
          <p className={styles.emptyStateHint}>Add your first event to reserve a transaction code.</p>
        </div>
      )}

      <div className={styles.grid}>
        {entries.map(([client, clientEvents]) => {
          const displayName = clientEvents[0]?.projectName || client;
          return (
            <article key={client} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <p className={styles.cardKicker}>Project</p>
                  <h3 className={styles.cardTitle}>{displayName}</h3>
                  {displayName !== client && <p className={styles.cardSubtitle}>{client}</p>}
                </div>
                <span className={styles.cardCount}>{clientEvents.length} events</span>
              </div>
              <ul className={styles.eventList}>
                {clientEvents.map((event) => (
                  <li key={event.id} className={styles.eventRow}>
                    <div className={styles.eventMain}>
                      <span className={styles.codeBadge}>{event.code}</span>
                      <p className={styles.eventDescription}>{event.description}</p>
                    </div>
                    <div className={styles.eventMetaRow}>
                      <p className={styles.eventMeta}>Created {formatTimestamp(event.createdAt)}</p>
                      <div className={styles.eventActions}>
                        <button type="button" onClick={() => onView(event)}>
                          View
                        </button>
                        <button type="button" onClick={() => onEdit(event)}>
                          Edit
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
};
