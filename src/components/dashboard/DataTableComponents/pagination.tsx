"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface PaginationTableProps {
    totalPages: number; // Total number of pages
    onPageChange: (page: number) => void; // Callback to notify table of the page change
}

export function PaginationTable({ totalPages, onPageChange }: PaginationTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);

    // Sync current page with query params
    useEffect(() => {
        const pageParam = parseInt(searchParams.get("page") || "1", 10);
        if (pageParam !== currentPage) {
            setCurrentPage(pageParam);
        }
    }, [searchParams, currentPage]);

    // Update the query params and notify parent about page change
    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams as any);
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
        setCurrentPage(page);
        onPageChange(page);
    };

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={() => !isFirstPage && handlePageChange(currentPage - 1)}
                        isActive={isFirstPage}
                    />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                        <PaginationLink
                            href="#"
                            onClick={() => handlePageChange(index + 1)}
                            isActive={currentPage === index + 1}
                        >
                            {index + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {totalPages > 5 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={() => !isLastPage && handlePageChange(currentPage + 1)}
                        isActive={isLastPage}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
