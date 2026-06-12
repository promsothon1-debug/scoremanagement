import React, { useState } from 'react';
import { SheetConfig } from '../types';
import { Settings, CheckCircle2, AlertTriangle, HelpCircle, ExternalLink, RefreshCw, Key } from 'lucide-react';

interface SheetsConfigPanelProps {
  config: SheetConfig;
  onConfigChange: (newConfig: SheetConfig) => void;
  onSyncPush: (accessToken?: string) => Promise<void>;
  onSyncPull: (accessToken?: string) => Promise<void>;
}

export default function SheetsConfigPanel({
  config,
  onConfigChange,
  onSyncPush,
  onSyncPull,
}: SheetsConfigPanelProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [syncDirection, setSyncDirection] = useState<'none' | 'push' | 'pull'>('none');
  const [syncStatus, setSyncStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onConfigChange({ ...config, [name]: checked });
    } else {
      onConfigChange({ ...config, [name]: value });
    }
  };

  const handleTestSync = async (direction: 'push' | 'pull') => {
    setSyncDirection(direction);
    setSyncStatus({ type: 'loading', message: direction === 'push' ? 'កំពុងបញ្ជូនទិន្នន័យទៅ Google Sheets...' : 'កំពុងទាញយកទិន្នន័យពី Google Sheets...' });
    
    try {
      if (direction === 'push') {
        const tokenToUse = accessToken || undefined;
        await onSyncPush(tokenToUse);
        setSyncStatus({ type: 'success', message: 'រក្សាទុក និងបញ្ជូនទិន្នន័យទៅកាន់ Google Sheet ជោគជ័យ!' });
      } else {
        const tokenToUse = accessToken || undefined;
        await onSyncPull(tokenToUse);
        setSyncStatus({ type: 'success', message: 'បានទាញយកទិន្នន័យពី Google Sheet និងបញ្ចូលមកវិញដោយជោគជ័យ!' });
      }
    } catch (error: any) {
      console.error(error);
      setSyncStatus({
        type: 'error',
        message: error.message || 'ការតភ្ជាប់បរាជ័យ។ សូមប្រាកដថា ID ស្ពៀតស៊ិតត្រឹមត្រូវ និងបានបើកការប្រើប្រាស់ access token។',
      });
    } finally {
      setSyncDirection('none');
    }
  };

  // Helper to extract Spreadsheet ID from URL
  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (val.includes('docs.google.com/spreadsheets')) {
      const match = val.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        onConfigChange({ ...config, spreadsheetId: match[1] });
      }
    }
  };

  return (
    <div id="sheets-config-panel" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-500" />
          <h2 className="font-bold text-sm text-slate-900">ការកំណត់ Google Sheets</h2>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>របៀបភ្ជាប់</span>
        </button>
      </div>

      {showHelp && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 leading-relaxed text-blue-900 animate-fadeIn">
          <h3 className="font-bold border-b border-blue-100 pb-1 mb-2">របៀបភ្ជាប់ជាមួយ Google Sheets៖</h3>
          <ol className="list-decimal list-inside space-y-1 bg-white/40 p-2 rounded">
            <li>បង្កើត Google Sheet ថ្មីមួយនៅក្នុងគណនីរបស់អ្នក។</li>
            <li>ចម្លង <strong>Spreadsheet URL</strong> រួចផាស្ត (Paste) ក្នុងប្រអប់ខាងក្រោម។</li>
            <li>ចែករំលែកសន្លឹកកិច្ចការនោះទៅជា <span className="underline">Anyone with the link can edit</span> (ឬប្រើប្រាស់ Access Token)។</li>
            <li>ចុចប៊ូតុង <strong>បញ្ជូនទៅ Google Sheets</strong> ដើម្បីរក្សាទុកទុកជាផ្លូវការនៅក្នុង Cloud!</li>
          </ol>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
            លីង ឬ ID ស្ពៀតស៊ិត (Spreadsheet ID/URL)
          </label>
          <input
            type="text"
            name="spreadsheetId"
            value={config.spreadsheetId}
            onChange={handleInputChange}
            onBlur={handleUrlBlur}
            placeholder="បញ្ចូល Spreadsheet URL ឬ ID របស់អ្នក..."
            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:ring-1 focus:ring-blue-500 hover:border-slate-300 outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
              ឈ្មោះសន្លឹកកិច្ចការ (Sheet Name)
            </label>
            <input
              type="text"
              name="sheetName"
              value={config.sheetName}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:ring-1 focus:ring-blue-500 hover:border-slate-300 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
              ថ្នាក់រៀន
            </label>
            <input
              type="text"
              name="className"
              value={config.className}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:ring-1 focus:ring-blue-500 hover:border-slate-300 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">ស្វ័យប្រវត្តិកំណត់ការបញ្ជូន (Auto-Sync)</span>
            <input
              type="checkbox"
              name="isAutoSync"
              checked={config.isAutoSync}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 accent-blue-600 cursor-pointer"
            />
          </div>
          <p className="text-[10px] text-slate-400">
            រាល់ការបន្ថែម និងកែប្រែពិន្ទុសិស្សនឹងត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិ។
          </p>
        </div>

        {/* Optional Access Token Configuration */}
        <div className="border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors font-semibold"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{showTokenInput ? 'លាក់ជម្រើស Access Token' : 'បន្ថែម Google OAuth Access Token'}</span>
          </button>

          {showTokenInput && (
            <div className="mt-2 bg-slate-50 p-2.5 rounded border border-slate-200">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Access Token
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="បញ្ចូល OAuth token របស់អ្នក (ស្រេចចិត្ត)..."
                className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
              />
              <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                ប្រើដើម្បីអនុញ្ញាតឲ្យសម្មវិធីអាចសរសេរលើសន្លឹកកិច្ចការស្ពៀតស៊ិតដែលមានការការពារ (Protected sheets)។
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-slate-100 pt-3 flex gap-2">
          <button
            onClick={() => handleTestSync('push')}
            disabled={syncDirection !== 'none'}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncDirection === 'push' ? 'animate-spin' : ''}`} />
            <span>បញ្ជូនទៅ Sheet</span>
          </button>
          <button
            onClick={() => handleTestSync('pull')}
            disabled={syncDirection !== 'none'}
            className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md transition-all border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncDirection === 'pull' ? 'animate-spin' : ''}`} />
            <span>ទាញយកពី Sheet</span>
          </button>
        </div>

        {/* Sync Status Banner */}
        {syncStatus.type !== 'idle' && (
          <div
            className={`p-2.5 rounded border flex gap-1.5 items-start ${
              syncStatus.type === 'loading'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : syncStatus.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {syncStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
            ) : (
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${syncStatus.type === 'loading' ? 'text-amber-500' : 'text-red-500'}`} />
            )}
            <div className="flex-1">
              <p className="font-semibold">{syncStatus.message}</p>
              {config.spreadsheetId && syncStatus.type === 'success' && (
                <a
                  href={`https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline mt-1 font-semibold"
                >
                  <span>បើកមើលលើ Google Sheets</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
