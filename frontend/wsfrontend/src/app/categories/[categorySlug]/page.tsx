import React from "react";
import { Nav } from "@/components/Nav/Nav";
import styles from './style.module.css';
import { InfoLabel } from "@/components/Nav/InfoLabel";
import { Products } from "@/components/Products/Products";
import { Metadata } from "next/types";


interface ProductsPageProps {
    params: {
      categorySlug: string;
    };
  }

export const metadata: Metadata = {
  title: "Категории",
};

  
export default function ProductsPage({ params }: ProductsPageProps) {
    return (
      <div className={styles.content}>
        <Nav />
        <InfoLabel />
        <Products category={params.categorySlug} />
      </div>
    );
  };