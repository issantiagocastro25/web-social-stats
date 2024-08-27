'use client';
import React, { useState } from 'react';
import { Button, Card, Progress, Table } from 'flowbite-react';
import api from '../../../api/index';
import * as XLSX from 'xlsx';

const YouTubeBulkUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Por favor, selecciona un archivo Excel');
            return;
        }

        setUploading(true);
        setProgress(0);
        setResults([]);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('api/social-metrics/youtube/bulk-statistics/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            });
            if (response.data.channels) {
                setResults(response.data.channels);
            } else {
                setError('No se recibieron datos de canales');
            }
        } catch (error) {
            console.error('Error en la carga masiva:', error);
            setError(error.response?.data?.error || 'Error al procesar la carga masiva');
            if (error.response?.data?.channels) {
                setResults(error.response.data.channels);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleClear = () => {
        setFile(null);
        setResults([]);
        setError('');
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(results);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Canales de YouTube");
        
        // Generar el archivo Excel
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Crear un enlace de descarga y hacer clic en él
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'canales_youtube.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">Carga Masiva de Canales de YouTube</h2>
            <div className="mb-4">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
            </div>
            <div className="flex space-x-2">
                <Button onClick={handleUpload} disabled={!file || uploading}>
                    {uploading ? 'Cargando...' : 'Cargar Archivo'}
                </Button>
                <Button onClick={handleClear} color="light">
                    Limpiar
                </Button>
                {results.length > 0 && (
                    <Button onClick={handleDownloadExcel} color="success">
                        Descargar Excel
                    </Button>
                )}
            </div>
            {uploading && (
                <Progress progress={progress} color="blue" className="mt-4" />
            )}
            {error && (
                <p className="text-red-500 mt-4">{error}</p>
            )}
            {results.length > 0 && (
                <div className="mt-8 overflow-x-auto">
                    <h3 className="text-xl font-semibold mb-2">Resultados:</h3>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Nombre del Canal</Table.HeadCell>
                            <Table.HeadCell>Suscriptores</Table.HeadCell>
                            <Table.HeadCell>Vistas</Table.HeadCell>
                            <Table.HeadCell>Videos</Table.HeadCell>
                            <Table.HeadCell>Descripción</Table.HeadCell>
                            <Table.HeadCell>Miniatura</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {results.map((channel, index) => (
                                <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {channel.channel_name}
                                    </Table.Cell>
                                    <Table.Cell>{channel.subscriber_count}</Table.Cell>
                                    <Table.Cell>{channel.view_count}</Table.Cell>
                                    <Table.Cell>{channel.video_count}</Table.Cell>
                                    <Table.Cell className="max-w-xs truncate" title={channel.description}>
                                        {channel.description}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <img src={channel.thumbnail_url} alt={`${channel.channel_name} thumbnail`} className="w-10 h-10 rounded-full" />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            )}
            {!uploading && results.length === 0 && !error && (
                <p className="text-gray-500 mt-4">No hay resultados para mostrar. Carga un archivo para ver los datos.</p>
            )}
        </Card>
    );
};

export default YouTubeBulkUpload;