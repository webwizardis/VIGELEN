import React from 'react';
import { X, Bell, AlertTriangle, Flame, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { NotificationItem } from '../../types';
import { NavTabId } from '../layout/Sidebar';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (tab: NavTabId) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/50 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-sm flex-col border-l border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3.5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-neutral-500" />
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Notification Center
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="mono text-[10px] text-[#1a1a1a] font-bold border border-[#1a1a1a] px-2 py-0.5 bg-white hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              aria-label="Close notification center"
              className="flex h-6 w-6 items-center justify-center border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white cursor-pointer transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 p-2 text-xs dark:divide-neutral-800">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">
              No recent notifications.
            </div>
          ) : (
            notifications.map((item) => {
              const isHigh = item.type === 'HIGH_RISK';
              const isTxn = item.type === 'SUSPICIOUS_TRANSACTION';

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.linkTab) onSelectNotification(item.linkTab as NavTabId);
                    onClose();
                  }}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    !item.read
                      ? 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100">
                      {isHigh ? (
                        <Flame className="h-3.5 w-3.5 text-red-500" />
                      ) : isTxn ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      ) : (
                        <Info className="h-3.5 w-3.5 text-neutral-400" />
                      )}
                      <span>{item.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-600 leading-normal dark:text-neutral-400">
                    {item.description}
                  </p>
                  {item.linkTab && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                      <span>Inspect Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
