
import React from "react";

interface Props {
  error: string | null;
}

const MLErrorBlock: React.FC<Props> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="mt-6 p-4 border rounded-lg bg-red-50 text-red-800">
      <div className="font-medium mb-2">Ошибка:</div>
      <div>{error}</div>
      {error.includes('localStorage') && (
        <div className="mt-3 text-sm">
          <p className="font-medium">Как исправить:</p>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Откройте DevTools (F12)</li>
            <li>Перейдите в Application → Local Storage</li>
            <li>Удалите все данные или выполните localStorage.clear()</li>
            <li>Обновите страницу и войдите заново</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default MLErrorBlock;
