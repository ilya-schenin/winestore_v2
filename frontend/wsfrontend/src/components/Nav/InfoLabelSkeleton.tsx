import React from "react";
import styles from './InfoLabel.module.css';
import cn from 'classnames';


export const InfoLabelSkeleton: React.FC = () => (
    <div className={styles.InfoLabel}>
    <div className={styles.InfoLabelBody}>
        <div className={styles.skeletonSubtitle} />
        <div className={styles.skeletonTitle} />
        <div className={styles.sortAreaSkeleton}>
            <div className={cn(styles.skeletonSubtitle, styles.sortSkeleton)} />
            <div className={styles.sortBlocks}>
                <div className={cn(styles.skeletonSubtitle, styles.sortBlock)} />
                <div className={cn(styles.skeletonSubtitle, styles.sortBlock)} />
                <div className={cn(styles.skeletonSubtitle, styles.sortBlock)} />
            </div>
        </div>
    </div>
</div>
);
