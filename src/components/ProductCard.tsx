import { motion } from 'motion/react';
import { Product } from '../types';
import React from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const getHighResImageUrl = (url: string) => {
    if (!url) return url;
    if (url.includes('amazon') || url.includes('media-amazon')) {
      return url.replace(/\._[A-zA-Z0-9_,-]+_\./, '.');
    }
    return url;
  };

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ 
        opacity: { duration: 0.3, ease: "linear" },
        layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      }}
      className="group flex flex-col bg-zinc-900/40 rounded-3xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors"
    >
      <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-square overflow-hidden bg-zinc-100 rounded-2xl p-6 sm:p-8 block mb-6 shadow-inner">
        {product.isTrending && (
          <div className="absolute top-4 left-4 z-10 bg-amber-500 text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-full tracking-wide shadow-sm border border-amber-400">
            Bestseller
          </div>
        )}
        <img 
          src={getHighResImageUrl(product.imageUrl)} 
          alt={product.title}
          loading="lazy"
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-300" />
      </a>
      <div className="flex flex-col flex-grow text-center px-4 pb-2">
        <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
          <h3 className="text-lg md:text-xl font-serif font-normal text-zinc-100 leading-tight mb-2">
            {product.title}
          </h3>
        </a>
        <span className="font-sans text-sm md:text-base text-zinc-400 font-light">{product.price}</span>
      </div>
    </motion.article>
  );
}
