import React from "react";
import { EntityData } from '@/app/Principal/dashboard/types';

interface EntityTableProps {
    entityData: EntityData | null;
}

const EntityTable: React.FC<EntityTableProps> = ({ entityData }) => {
    if (!entityData) {
        return <div>No entity selected</div>;
    }

    return (
        <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead className="bg-[#7A4993] text-white">
                    <tr>
                        <th className="py-2 px-4 border-b w-fixed w-96">Institución</th>
                        <th className="py-2 px-4 border-b">Ciudad</th>
                        <th className="py-2 px-4 border-b">Tipo</th>
                        <th className="py-2 px-4 border-b">Red Social</th>
                        <th className="py-2 px-4 border-b">Seguidores</th>
                        <th className="py-2 px-4 border-b">Videos</th>
                        <th className="py-2 px-4 border-b">Visitas</th>
                        <th className="py-2 px-4 border-b">Visitas por Video</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="py-2 px-4 border-b" rowSpan={5}>{entityData.institucion}</td>
                        <td className="py-2 px-4 border-b" rowSpan={5}>{entityData.ciudad || '-'}</td>
                        <td className="py-2 px-4 border-b" rowSpan={5}>{entityData.tipo}</td>
                        <td className="py-2 px-4 border-b">Facebook</td>
                        <td className="py-2 px-4 border-b">{entityData.facebook.seguidores ?? '-'}</td>
                        <td className="py-2 px-4 border-b">{entityData.facebook.videos ?? '-'}</td>
                        <td className="py-2 px-4 border-b">{entityData.facebook.visitas ?? '-'}</td>
                        <td className="py-2 px-4 border-b">{entityData.facebook.visitasPorVideo ?? '-'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">YouTube</td>
                        <td className="py-2 px-4 border-b">{entityData.youtube.seguidores ?? '-'}</td>
                        <td className="py-2 px-4 border-b">{entityData.youtube.videos ?? '-'}</td>
                        <td className="py-2 px-4 border-b">{entityData.youtube.visitas ?? '-'}</td>
                        <td className="py-2 px-4 border-b">{entityData.youtube.visitasPorVideo ?? '-'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">Twitter</td>
                        <td className="py-2 px-4 border-b">{entityData.twitter.seguidores ?? '-'}</td>
                        <td className="py-2 px-4 border-b">-</td>
                        <td className="py-2 px-4 border-b">-</td>
                        <td className="py-2 px-4 border-b">-</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">Instagram</td>
                        <td className="py-2 px-4 border-b">{entityData.instagram.seguidores ?? '-'}</td>
                        <td className="py-2 px-4 border-b">{entityData.instagram.videos ?? '-'}</td>
                        <td className="py-2 px-4 border-b">{entityData.instagram.visitas ?? '-'}</td>
                        <td className="py-2 px-4 border-b">{entityData.instagram.visitasPorVideo ?? '-'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">TikTok</td>
                        <td className="py-2 px-4 border-b">{entityData.tiktok.seguidores ?? '-'}</td>
                        <td className="py-2 px-4 border-b">-</td>
                        <td className="py-2 px-4 border-b">-</td>
                        <td className="py-2 px-4 border-b">-</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EntityTable;