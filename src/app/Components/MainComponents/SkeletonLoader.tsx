import React from 'react';
import { Card } from '@tremor/react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Skeleton for SummaryCards */}
      <div className="overflow-x-auto">
        <div className="flex space-x-10 pb-4" style={{ minWidth: 'max-content' }}>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Card key={index} className="w-64 flex-shrink-0">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Skeleton for GroupSummaryTable */}
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>

      {/* Skeleton for InteractiveDataTable */}
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SkeletonLoader;