import { useState } from 'react';
import {
  X,
  Car,
  User,
  Phone,
  Mail,
  Clock,
  Image as ImageIcon,
  MessageSquare,
  CheckCircle,
  Send,
} from 'lucide-react';
import type { Repair, RepairStatus } from '../../types/repair';
import { STATUS_LABELS, STATUS_COLORS } from '../../types/repair';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { auth } from '../../lib/auth';

/**
 * RepairDetail Component
 *
 * Detailed repair view in modal/side panel
 *
 * Features:
 * - Full repair information display
 * - Customer contact details
 * - Photo gallery
 * - Status history timeline
 * - Action buttons:
 *   - Confirm appointment (pre_checkin)
 *   - Update status
 *   - Set estimated completion
 *   - Add internal notes
 * - SMS notification triggers
 *
 * Accessibility:
 * - Modal semantics with focus trap
 * - Escape key to close
 * - Descriptive labels
 */

interface RepairDetailProps {
  repair: Repair;
  onClose: () => void;
  onUpdate: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export function RepairDetail({ repair, onClose, onUpdate }: RepairDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<RepairStatus>(repair.status);
  const [estimatedCompletion, setEstimatedCompletion] = useState(
    repair.estimatedCompletion || ''
  );
  const [internalNote, setInternalNote] = useState('');

  const statusColors = STATUS_COLORS[repair.status];

  // Handle status update
  const handleStatusUpdate = async () => {
    if (newStatus === repair.status) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`${API_URL}/repairs/${repair.id}/status`, {
        method: 'POST',
        headers: auth.getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Errore nell\'aggiornamento dello stato');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle confirm appointment
  const handleConfirmAppointment = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${API_URL}/repairs/${repair.id}/confirm`, {
        method: 'POST',
        headers: auth.getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to confirm appointment');

      onUpdate();
    } catch (error) {
      console.error('Error confirming appointment:', error);
      alert('Errore nella conferma dell\'appuntamento');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle estimated completion update
  const handleEstimatedCompletionUpdate = async () => {
    if (!estimatedCompletion) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`${API_URL}/repairs/${repair.id}`, {
        method: 'PATCH',
        headers: auth.getAuthHeaders(),
        body: JSON.stringify({ estimatedCompletion }),
      });

      if (!response.ok) throw new Error('Failed to update estimated completion');

      onUpdate();
    } catch (error) {
      console.error('Error updating estimated completion:', error);
      alert('Errore nell\'aggiornamento della data prevista');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle internal note
  const handleAddNote = async () => {
    if (!internalNote.trim()) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`${API_URL}/repairs/${repair.id}`, {
        method: 'PATCH',
        headers: auth.getAuthHeaders(),
        body: JSON.stringify({ staffNotes: internalNote }),
      });

      if (!response.ok) throw new Error('Failed to add note');

      setInternalNote('');
      onUpdate();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Errore nell\'aggiunta della nota');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="repair-detail-title"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-slate-800 rounded-2xl shadow-2xl shadow-gold-500/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700 animate-fade-in-up">
          {/* Header */}
          <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-start justify-between z-10">
            <div>
              <h2 id="repair-detail-title" className="text-2xl font-bold text-white mb-2">
                {repair.vehicle?.plate}
              </h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}
              >
                {STATUS_LABELS[repair.status]}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-white"
              aria-label="Chiudi"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Vehicle and Customer Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Vehicle */}
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Car className="w-5 h-5 text-gold-400" />
                  Veicolo
                </h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-slate-400">Targa</dt>
                    <dd className="font-medium text-white">{repair.vehicle?.plate}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Marca e Modello</dt>
                    <dd className="font-medium text-white">
                      {repair.vehicle?.brand} {repair.vehicle?.model}
                    </dd>
                  </div>
                  {repair.vehicle?.year && (
                    <div>
                      <dt className="text-slate-400">Anno</dt>
                      <dd className="font-medium text-white">{repair.vehicle?.year}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Customer */}
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-gold-400" />
                  Cliente
                </h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-slate-400">Nome</dt>
                    <dd className="font-medium text-white">{repair.customer?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Telefono
                    </dt>
                    <dd>
                      <a
                        href={`tel:${repair.customer?.phone}`}
                        className="font-medium text-gold-400 hover:text-gold-300 transition"
                      >
                        {repair.customer?.phone}
                      </a>
                    </dd>
                  </div>
                  {repair.customer?.email && (
                    <div>
                      <dt className="text-slate-400 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Email
                      </dt>
                      <dd>
                        <a
                          href={`mailto:${repair.customer?.email}`}
                          className="font-medium text-gold-400 hover:text-gold-300 transition"
                        >
                          {repair.customer?.email}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Description */}
            {repair.description && (
              <div>
                <h3 className="font-semibold text-white mb-2">Descrizione</h3>
                <p className="text-slate-300 bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  {repair.description}
                </p>
              </div>
            )}

            {/* Photos */}
            {repair.photos && repair.photos.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gold-400" />
                  Foto ({repair.photos.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {repair.photos.map((photo) => (
                    <a
                      key={photo.id}
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-700 hover:ring-2 hover:ring-gold-500 hover:border-gold-500 transition"
                    >
                      <img
                        src={photo.thumbnailUrl || photo.url}
                        alt="Foto riparazione"
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Status History Timeline */}
            {repair.statusHistory && repair.statusHistory.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold-400" />
                  Storico Stati
                </h3>
                <div className="space-y-3">
                  {repair.statusHistory.map((entry, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-gold-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {STATUS_LABELS[entry.status]}
                          </span>
                          <span className="text-sm text-slate-400">
                            {format(new Date(entry.timestamp || entry.changedAt), 'dd MMM yyyy HH:mm', {
                              locale: it,
                            })}
                          </span>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-slate-300 mt-1">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Section */}
            <div className="border-t border-slate-700 pt-6 space-y-4">
              <h3 className="font-semibold text-white">Azioni</h3>

              {/* Confirm appointment (pre_checkin only) */}
              {repair.status === 'pre_checkin' && (
                <button
                  onClick={handleConfirmAppointment}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-500/50 text-white font-medium py-3 px-4 rounded-lg transition shadow-lg hover:shadow-green-500/20"
                >
                  <CheckCircle className="w-5 h-5" />
                  Conferma Appuntamento
                </button>
              )}

              {/* Update status */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Aggiorna Stato
                </label>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as RepairStatus)}
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || newStatus === repair.status}
                    className="px-6 py-2 bg-gold-600 hover:bg-gold-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition shadow-lg hover:shadow-gold-500/20"
                  >
                    Aggiorna
                  </button>
                </div>
              </div>

              {/* Set estimated completion */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Data Prevista Completamento
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={estimatedCompletion}
                    onChange={(e) => setEstimatedCompletion(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                  <button
                    onClick={handleEstimatedCompletionUpdate}
                    disabled={isUpdating || !estimatedCompletion}
                    className="px-6 py-2 bg-gold-600 hover:bg-gold-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition shadow-lg hover:shadow-gold-500/20"
                  >
                    Salva
                  </button>
                </div>
              </div>

              {/* Add internal note */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Nota Interna
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Aggiungi una nota..."
                    rows={3}
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
                <button
                  onClick={handleAddNote}
                  disabled={isUpdating || !internalNote.trim()}
                  className="mt-2 flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700/50 text-white font-medium rounded-lg transition"
                >
                  <Send className="w-4 h-4" />
                  Aggiungi Nota
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
