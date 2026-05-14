import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { useWishlist } from "../../context/WishlistContext";

function Favorites() {
  const { wishlistItems } = useWishlist();

  return (
    <section className="bg-[#FFF7D6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
          Favorites
        </p>

        <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
          Your favorite treats.
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="mt-8 rounded-[32px] bg-white p-10 text-center shadow-xl">
            <Heart className="mx-auto text-red-400" size={54} />

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              No favorites yet
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-600">
              Save products you love and access them quickly later.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-[60px] bg-green-500 px-6 py-3 text-sm font-black text-white"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Favorites;