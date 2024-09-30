"use client"
import { useState, useEffect } from 'react';
import PopulationCard from "@/app/Components/MainComponents/PopulationCard";

// Simular llamada a la API para obtener fechas
const fetchDates = async () => {
  // En un entorno real, esto sería una llamada fetch a tu API
  return [
    { date: "2024-08-31" },
    { date: "2021-06-30" },
    { date: "2020-12-30" },
    { date: "2020-06-30" },
    { date: "2019-12-30" },
    { date: "2019-06-30" },
    { date: "2018-12-30" },
    { date: "2017-12-30" },
    { date: "2016-12-30" }
  ];
};

// Simular llamada a la API para obtener datos de población
const fetchPopulationData = async (date: string) => {
  // En un entorno real, esto sería una llamada fetch a tu API con la fecha como parámetro
  return {
    population: Math.floor(Math.random() * 10000000) + 40000000, // Población entre 40M y 50M
    uniqueFollowers: Math.floor(Math.random() * 1000000) + 500000, // Seguidores entre 500K y 1.5M
    penetrationRate: Math.random() * 5 + 1 // Tasa entre 1% y 6%
  };
};

export default function LoginPage() {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [populationData, setPopulationData] = useState({
    population: 0,
    uniqueFollowers: 0,
    penetrationRate: 0
  });

  useEffect(() => {
    const loadDates = async () => {
      const datesData = await fetchDates();
      const dateStrings = datesData.map(d => d.date);
      setDates(dateStrings);
      setSelectedDate(dateStrings[0]); // Seleccionar la primera fecha por defecto
    };
    loadDates();
  }, []);

  useEffect(() => {
    const loadPopulationData = async () => {
      if (selectedDate) {
        const data = await fetchPopulationData(selectedDate);
        setPopulationData(data);
      }
    };
    loadPopulationData();
  }, [selectedDate]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <>
      <PopulationCard
        dates={dates}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        population={populationData.population}
        uniqueFollowers={populationData.uniqueFollowers}
        penetrationRate={populationData.penetrationRate}
      />
    </>
  );
}