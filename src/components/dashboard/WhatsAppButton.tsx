'use client';

import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export function WhatsAppButton() {
    const { data: session } = useSession();
    const t = useTranslations('Dashboard.WhatsApp');

    // @ts-ignore - estas propiedades se agregarán en el futuro
    const hasAIAccess = session?.user?.hasAccessToWhatsappBotWithAI || false;

    const handleClick = () => {
        const message = encodeURIComponent(t('defaultMessage'));
        const whatsappUrl = `https://wa.me/+5491127277627?text=${message}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <Button
            className="relative h-9 gap-2 bg-green-600 hover:bg-green-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
            onClick={handleClick}
        >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline-block text-sm font-medium">
                {t('buttonText')}
            </span>

            {/* Badge de IA si tiene acceso */}
            {hasAIAccess && (
                <Badge className="ml-1 h-5 px-1.5 gap-1 bg-purple-600 hover:bg-purple-600 border-2 border-white">
                    <Sparkles className="h-3 w-3" />
                    <span className="text-[10px] font-semibold">IA</span>
                </Badge>
            )}
        </Button>
    );
}
