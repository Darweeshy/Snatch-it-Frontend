import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/client';
import ReactMarkdown from 'react-markdown';

import Container from '../components/ui/Container';
import PageHeader from '../components/shared/PageHeader';
import Spinner from '../components/ui/Spinner';

const DynamicPage = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            setIsLoading(true);
            try {
                const response = await API.get(`/api/pages/${slug}`);
                setPage(response.data);
            } catch (error) {
                console.error("Failed to fetch page:", error);
                setPage(null); // Set to null on error to show not found message
            } finally {
                setIsLoading(false);
            }
        };
        fetchPage();
    }, [slug]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
    }

    if (!page) {
        return <div className="text-center py-20">404 - Page Not Found</div>;
    }

    return (
        <Container className="py-12">
            <PageHeader title={page.title} />
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-md">
                <article className="prose max-w-none">
                    <ReactMarkdown>{page.content}</ReactMarkdown>
                </article>
            </div>
        </Container>
    );
};

export default DynamicPage;