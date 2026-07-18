import { motion } from 'motion/react';
import { Product } from '../types';
import React from 'react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col"
    >
      <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-zinc-100 block mb-4">
        {product.isTrending && (
          <div className="absolute top-3 left-3 z-10 bg-white/90 text-zinc-900 text-xs font-medium px-3 py-1.5 rounded-full tracking-wide shadow-sm">
            Bestseller
          </div>
        )}
        <img 
          src={product.imageUrl} 
          alt={product.title}
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </a>

      <div className="flex flex-col flex-grow text-center px-2">
        <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 transition-colors">
          <h3 className="text-lg font-serif font-normal text-zinc-900 leading-tight mb-1">
            {product.title}
          </h3>
        </a>
        <span className="font-sans text-sm text-zinc-600">{product.price}</span>
      </div>
    </motion.article>
  );
}
