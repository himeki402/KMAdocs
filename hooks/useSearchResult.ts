import { DocumentService } from "@/services/documentService";
import { Document } from "@/types/document";
import { useEffect, useState } from "react";

interface UseSearchResultProps {
    searchQuery: string;
    page?: number;
    limit?: number;
}

const useSearchResult = ({
    searchQuery,    
    page = 1,
    limit = 10,
}: UseSearchResultProps) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!searchQuery) return;

        const fetchDocuments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await DocumentService.FTSDocument({
                    search: searchQuery,
                    page,
                    limit,
                });
                setDocuments(response.data);
            } catch (err: any) {
                setError(err.message || "Đã xảy ra lỗi");
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [searchQuery, page, limit]);

    return { documents, loading, error };
};

export default useSearchResult;
