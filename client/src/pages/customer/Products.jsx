import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "../../components/product/ProductCard";
import { useProducts } from "../../context/ProductContext";

function Products() {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((product) => product.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  return (
    <section className="bg-[#FFF7D6] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
              Our Menu
            </p>

            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
              Pick your favorite treat.
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Browse freshly baked cakes, cupcakes, pastries, doughnuts, and
              dessert boxes made with love.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search cakes, cupcakes..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-[60px] border border-yellow-200 bg-white px-12 py-4 text-sm font-bold outline-none focus:border-green-400"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 rounded-[32px] bg-white p-2 shadow-md">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-[60px] px-5 py-2.5 text-sm font-black transition ${
                activeCategory === category
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-yellow-50 text-slate-700 hover:bg-yellow-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-600">
            Showing{" "}
            <span className="font-black text-green-700">
              {filteredProducts.length}
            </span>{" "}
            item{filteredProducts.length === 1 ? "" : "s"}
          </p>

          <p className="rounded-full bg-green-50 px-4 py-2 text-sm font-black text-green-700">
            {activeCategory}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-[40px] bg-white p-10 text-center shadow-xl">
            <h2 className="text-3xl font-black text-slate-900">
              No products found
            </h2>
            <p className="mt-2 text-slate-600">
              Try another search or category.
            </p>
          </div>
        ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
        )}
      </div>
    </section>
  );
}

export default Products;