'use client';

import React, { useState } from "react";
import { Button, Card, TextInput, Alert } from "flowbite-react";
import { getYouTubeChannelStats } from '@/api/youtube/findYoutube';

export default function FormYouTube() {
    const [query, setQuery] = useState('');
    const [channelStats, setChannelStats] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError("Por favor, ingrese un nombre de canal o @handle.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setChannelStats(null);

        try {
            const stats = await getYouTubeChannelStats(query);
            setChannelStats(stats);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white">
                <h2 className="text-3xl font-bold text-center mb-6">Buscar Canal de YouTube</h2>
                <form onSubmit={handleSubmit} className="mb-4">
                    <TextInput
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ingrese nombre del canal o @handle"
                        className="mb-3"
                    />
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full"
                        color="blue"
                    >
                        {isLoading ? 'Buscando...' : 'Buscar Canal'}
                    </Button>
                </form>

                {error && <Alert color="failure" className="mb-4">{error}</Alert>}

                {channelStats && (
                    <Card className="mt-4">
                        <h3 className="text-xl font-bold mb-2">{channelStats.channel_name}</h3>
                        <img src={channelStats.thumbnail_url} alt={channelStats.channel_name} className="w-24 h-24 rounded-full mx-auto mb-4"/>
                        <p className="text-sm text-gray-600 mb-4">{channelStats.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">Suscriptores</p>
                                <p>{parseInt(channelStats.subscriber_count).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Vistas Totales</p>
                                <p>{parseInt(channelStats.view_count).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Número de Videos</p>
                                <p>{parseInt(channelStats.video_count).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">ID de Lista de Reproducción</p>
                                <p className="text-xs break-all">{channelStats.playlist_id}</p>
                            </div>
                        </div>
                    </Card>
                )}
            </Card>
        </div>
    );
}