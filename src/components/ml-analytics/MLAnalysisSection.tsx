
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface MLAnalysisSectionProps {
  mlAnalysis: string;
  isLoading: boolean;
  hasData: boolean;
  error: string | null;
  onRunAnalysis: () => void;
}

const MLAnalysisSection: React.FC<MLAnalysisSectionProps> = ({
  mlAnalysis, isLoading, hasData, error, onRunAnalysis
}) => (
  <>
    {mlAnalysis && !isLoading && (
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-medium mb-2 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
          Рекомендации искусственного интеллекта
        </h3>
        <pre className="text-sm whitespace-pre-wrap">{mlAnalysis}</pre>
      </div>
    )}
    {hasData && !isLoading && !error && (
      <Button onClick={onRunAnalysis} variant="outline" className="w-full mt-4">
        Запустить AI-анализ
      </Button>
    )}
  </>
);

export default MLAnalysisSection;
