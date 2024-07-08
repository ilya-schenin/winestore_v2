import React, { HTMLAttributes, DetailedHTMLProps } from "react";
import styles from './HeaderButtons.module.css';
import Image from "next/image";
import cart from '../../../../public/media/cart.svg';
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux-toolkit/store";


interface HeaderButtonProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    image: string;
    title: string;
    link?: string
}

export const HeaderButton: React.FC<HeaderButtonProps> = ({image, title, link, ...props}) => {
    return (
        <div className={styles.headerButton} {...props}>
            {link ?
                <>
                    <Link href={link}>
                        <Image src={image} alt={title} />
                    </Link>
                    <Link href={link}>
                        {title}
                    </Link>
                </> :
                <>
                    <Image src={image} alt={title} />
                    {title}
                </>
            }
        </div>
    );
};

export const HeaderButtonCart: React.FC = () => {

    const cartCount = useSelector((state: RootState) => state.userCart);

    return (
        <div className={styles.headerButton}>
            <Image src={cart} alt={'cart'} />
            <div className={styles.cartQuantity}>{cartCount}</div>
            <div>Корзина</div>
        </div>
    );
};