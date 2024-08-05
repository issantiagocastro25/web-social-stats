// src/types.ts
export interface SocialMediaStats {
    seguidores: number | null;
    videos?: number | null;
    visitas?: number | null;
    visitasPorVideo?: number | null;
    likes?: number | null;
    suscriptores?: number | null;
}

export interface EntityData {
    institucion: string;
    ciudad: string;
    tipo: string;
    facebook: SocialMediaStats;
    youtube: SocialMediaStats;
    twitter: SocialMediaStats;
    instagram: SocialMediaStats;
    tiktok: SocialMediaStats;
}
