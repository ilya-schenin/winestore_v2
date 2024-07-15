import React, { useEffect, useState } from "react";
import styles from './Pagination.module.css';
import cn from 'classnames';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
    total: number
}

const areEqual = (prevProps: PaginationProps, nextProps: PaginationProps) => {    
    return prevProps.total === nextProps.total;
};


const Pagination: React.FC<PaginationProps> = ({ total }) => {

    const [currentPage, setCurrentPage] = useState<number>(1);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const handlePage = (page: number) => {
        const newPage = new URLSearchParams(searchParams.toString());
        newPage.set('page', page.toString());
        router.push(pathname + '?' + newPage);
        setCurrentPage(page);        
    };

    useEffect(() => {
        const page = searchParams.get('page');
        page && setCurrentPage(Number(page));
    }, [searchParams]);

    return (
        <div className={styles.pagination}>
            <div className={styles.paginationBody}>
                {currentPage - 1 > 0 && 
                    <div 
                        className={styles.pageElement} 
                        onClick={() => handlePage(currentPage - 1)}
                    >{'<'}</div>
                }
                 {[...Array(3)].map((_, i) => currentPage - (3 - i) > 0 && (
                    <div 
                        key={i} 
                        className={styles.pageElement} 
                        onClick={() => handlePage(currentPage - (3 - i))}
                    >{currentPage - (3 - i)}</div>
                 ))}
                <div className={cn(styles.pageElement, styles.current)}>
                    {currentPage} из {total}
                </div>
                {[...Array(3)].map((_, i) => currentPage + (i + 1) <= total && (
                    <div 
                        key={i} 
                        className={styles.pageElement} 
                        onClick={() => handlePage(currentPage  + (i + 1))}
                    >{currentPage  + (i + 1)}</div>
                 ))}
                {currentPage + 1 <= total && 
                    <div 
                        className={styles.pageElement} 
                        onClick={() => handlePage(currentPage + 1)}
                    >{'>'}</div>
                }
            </div>
        </div>
    );
};

export default React.memo(Pagination, areEqual);