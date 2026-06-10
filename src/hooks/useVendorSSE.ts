import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { VQ } from './useVendorPortal';

/**
 * Opens a single SSE connection to /api/vendor-portal/events.
 * Invalidates React Query caches on incoming events so UI refreshes automatically.
 * Should be mounted once at VendorLayout level.
 */
export function useVendorSSE() {
  const qc = useQueryClient();
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (esRef.current) return; // already open

    const es = new EventSource('/api/vendor-portal/events');
    esRef.current = es;

    es.addEventListener('notification', (e) => {
      const data = JSON.parse(e.data) as { message: string; type?: string };
      qc.invalidateQueries({ queryKey: VQ.notifications });
      qc.invalidateQueries({ queryKey: VQ.dashboard });
      // Show a toast for high-priority types
      if (data.type === 'danger') toast.error(data.message);
      else if (data.type === 'warning') toast.warning(data.message);
    });

    es.addEventListener('dashboard_refresh', () => {
      qc.invalidateQueries({ queryKey: VQ.dashboard });
    });

    es.addEventListener('ticket_reply', (e) => {
      qc.invalidateQueries({ queryKey: VQ.tickets });
      const data = JSON.parse(e.data) as { ticketId: string };
      toast.info(`New reply on ticket ${data.ticketId}`);
    });

    es.onerror = () => {
      // Browser will auto-reconnect on error; just log
      console.warn('[SSE] Connection dropped, browser will retry...');
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [qc]);
}
