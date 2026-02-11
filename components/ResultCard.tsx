
import React from 'react';
import { CoughAnalysisResult } from '../types';

interface ResultCardProps {
  result: CoughAnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-indigo-100 dark:border-slate-800 shadow-2xl animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Analysis Result</h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
              result.severity === 'High' ? 'bg-red-50 text-red-600' :
              result.severity === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
            }`}>
              {result.severity} Severity
            </span>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{result.type}</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <i className="fa-solid fa-lungs text-2xl"></i>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">AI Confidence</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{confidencePercent}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${confidencePercent}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <i className="fa-solid fa-circle-info mr-2 text-indigo-500"></i>
            Description
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs">
            {result.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
            <i className="fa-solid fa-notes-medical mr-2 text-indigo-500"></i>
            Recommendations
          </h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start text-xs text-gray-600 dark:text-gray-400">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[9px] font-bold mr-3 mt-0.5">
                  {idx + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
        <button 
          onClick={() => window.print()}
          className="w-full py-3 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
        >
          <i className="fa-solid fa-download mr-2"></i>
          Save Analysis Report
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
