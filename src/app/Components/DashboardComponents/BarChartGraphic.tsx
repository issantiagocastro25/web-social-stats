"use client";

import { BarChart } from '@tremor/react';

const chartdata = [
  {
    name: 'Instagram',
    Views: 1500,
    Likes: 1200,
    Followers: 1300,
    Videos: 50,
    Posts: 300,
  },
  {
    name: 'Facebook',
    Views: 2000,
    Likes: 1800,
    Followers: 1700,
    Videos: 70,
    Posts: 400,
  },
  {
    name: 'X',
    Views: 1100,
    Likes: 900,
    Followers: 950,
    Videos: 40,
    Posts: 200,
  },
  {
    name: 'YouTube',
    Views: 2500,
    Likes: 2300,
    Followers: 2200,
    Videos: 100,
    Posts: 500,
  },
];

const dataFormatter = (number) =>
  Intl.NumberFormat('us').format(number).toString();

export function BarChartExampleWithGroups() {
  return (
    <>
      <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Social Media Metrics
      </h3>
      <BarChart
        className="mt-6"
        data={chartdata}
        index="name"
        categories={[
          'Views',
          'Likes',
          'Followers',
          'Videos',
          'Posts',
        ]}
        colors={['blue', 'teal', 'amber', 'rose', 'indigo']}
        valueFormatter={dataFormatter}
        yAxisWidth={48}
      />
    </>
  );
}
