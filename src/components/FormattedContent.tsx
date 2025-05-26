
import React from 'react';

interface FormattedContentProps {
  content: string;
}

const FormattedContent: React.FC<FormattedContentProps> = ({ content }) => {
  const renderContent = (text: string) => {
    // Разбиваем текст на части и обрабатываем markdown-подобный синтаксис
    const parts = text.split(/(```[\s\S]*?```|\*\*.*?\*\*)/);
    
    return parts.map((part, index) => {
      // Обработка блоков кода
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).trim();
        const language = code.split('\n')[0];
        const codeContent = code.includes('\n') ? code.split('\n').slice(1).join('\n') : code;
        
        return (
          <div key={index} className="my-4">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{codeContent}</code>
            </pre>
          </div>
        );
      }
      
      // Обработка жирного текста
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      
      // Обычный текст с переносами строк
      return (
        <span key={index}>
          {part.split('\n').map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {line}
              {lineIndex < part.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    });
  };

  return (
    <div className="prose max-w-none text-gray-700 leading-relaxed">
      {renderContent(content)}
    </div>
  );
};

export default FormattedContent;
