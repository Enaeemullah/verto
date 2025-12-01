import { FormEvent, useState } from 'react';
import styles from './TransactionEventForm.module.css';
import { normalizeKey } from '../../utils/releases';

interface TransactionEventFormProps {
  onSubmit: (client: string, code: string, description: string) => Promise<void> | void;
  onCancel: () => void;
}

export const TransactionEventForm = ({ onSubmit, onCancel }: TransactionEventFormProps) => {
  const [client, setClient] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!client.trim() || !code.trim() || !description.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(normalizeKey(client), code.trim(), description.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div>
        <label className={styles.label} htmlFor="transaction-client">
          Project slug
        </label>
        <input
          id="transaction-client"
          type="text"
          value={client}
          onChange={(event) => setClient(event.target.value)}
          placeholder="acme"
        />
        <p className={styles.helperText}>Use the client slug you already track in releases.</p>
      </div>

      <div>
        <label className={styles.label} htmlFor="transaction-code">
          Transaction code
        </label>
        <input
          id="transaction-code"
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="TRX-001"
        />
      </div>

      <div>
        <label className={styles.label} htmlFor="transaction-description">
          Description
        </label>
        <textarea
          id="transaction-description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Outline what this transaction event represents for the project"
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btn--filled" disabled={isSubmitting}>
          Add transaction event
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
