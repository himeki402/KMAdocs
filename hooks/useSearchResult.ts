import { DocumentService } from "@/services/documentService";
import { Document } from "@/types/document";
import { useEffect, useState } from "react";

interface UseSearchResultProps {
    searchQuery: string;
    page?: number;
    limit?: number;
    shouldSearch?: boolean;
    sortBy?: string;
}

const useSearchResult = ({
    searchQuery,
    page = 1,
    limit = 10,
    shouldSearch = false,
    sortBy = "relevance",
}: UseSearchResultProps) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const performSearch = async (isLoadMore = false) => {
        if (!searchQuery.trim()) return;

        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setCurrentPage(1);
        }
        
        setError(null);
        
        try {
            const response = await DocumentService.FTSDocument({
                search: searchQuery,
                page: isLoadMore ? currentPage + 1 : 1,
                limit,
                sortBy,
            });
            
            if (isLoadMore) {
                setDocuments(prev => [...prev, ...response.data]);
                setCurrentPage(prev => prev + 1);
            } else {
                setDocuments(response.data);
                setCurrentPage(1);
            }
            
            setTotalResults(response.meta.total);
            setHasMore(response.meta.page < response.meta.totalPages);
            
        } catch (err: any) {
            setError(err.message || "Đã xảy ra lỗi");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = async () => {
        if (!hasMore || loadingMore || loading) return;
        await performSearch(true);
    };

    const resetSearch = () => {
        setDocuments([]);
        setError(null);
        setTotalResults(0);
        setCurrentPage(1);
        setHasMore(false);
    };

    useEffect(() => {
        if (!searchQuery || !shouldSearch) return;
        performSearch();
    }, [searchQuery, shouldSearch, sortBy]);

    useEffect(() => {
        if (!searchQuery) {
            resetSearch();
        }
    }, [searchQuery]);

    return {
        documents,
        loading,
        loadingMore,
        error,
        totalResults,
        hasMore,
        currentPage,
        performSearch: () => performSearch(false),
        loadMore,
        resetSearch,
    };
};

export default useSearchResult;