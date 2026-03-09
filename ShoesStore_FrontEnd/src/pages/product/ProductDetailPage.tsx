import { productApi } from "@/api/product.api";
import { orderApi } from "@/api/order.api";
import ReviewItem from "@/components/review/ReviewItem";
import type { ProductDetail } from "@/types/product.type";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    const fetchProductDetail = async (productId: string) => {
      const data = await productApi.getProductDetailById(productId);
      console.log("Fetched product detail:", data);
      setProduct(data);
    };
    fetchProductDetail(id!);
  }, [id]);
  return (
    <>
      <div className="max-w-300 mx-auto px-4 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-4">
              <div className="w-full aspect-square rounded-xl bg-gray-100 overflow-hidden">
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover"
                  data-alt="Main product view of orange and grey running shoe"
                  style={{
                    backgroundImage: `url(${product?.mainImageUrl})`,
                  }}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product?.imageUrls.slice(0, 4).map((url) => (
                  <div className="aspect-square rounded-lg border border-transparent hover:border-gray-300 overflow-hidden cursor-pointer">
                    <div
                      className="w-full h-full bg-center bg-cover"
                      data-alt="Back heel view"
                      style={{
                        backgroundImage: `url("${url}")`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right: Product Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-primary font-bold tracking-widest text-xs uppercase">
                {product?.brand}
              </span>
              <h1 className="text-4xl font-extrabold text-background-dark dark:text-white mt-2 mb-4 leading-tight">
                {product?.name}
              </h1>
              <div className="flex items-center gap-4">
                {product?.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      {product?.discountPrice.toLocaleString("vi-VN")}
                    </span>
                    <span className="text-3xl font-bold line-through text-gray-500">
                      {product?.price.toLocaleString("vi-VN")}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    {product?.price.toLocaleString("vi-VN")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex text-primary">
                {Array.from({ length: 5 }, (_, i) => {
                  const rating = product?.averageRating ?? 0;
                  if (i + 1 <= rating) {
                    return (
                      <span
                        key={i}
                        className="material-symbols-outlined text-lg!"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        star
                      </span>
                    );
                  } else if (i < rating) {
                    return (
                      <span
                        key={i}
                        className="material-symbols-outlined text-lg!"
                        style={{ fontVariationSettings: '"FILL" 0.5' }}
                      >
                        star_half
                      </span>
                    );
                  } else {
                    return (
                      <span
                        key={i}
                        className="material-symbols-outlined text-lg!"
                        style={{ fontVariationSettings: '"FILL" 0' }}
                      >
                        star
                      </span>
                    );
                  }
                })}
              </div>
              <span className="text-sm font-medium ml-2">
                {product?.averageRating.toFixed(1)} ({product?.totalRatings}{" "}
                reviews)
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product?.description ||
                "Experience the perfect blend of style and performance with our latest running shoe. Engineered for comfort and designed to turn heads, this shoe features a breathable mesh upper, responsive cushioning, and a durable outsole for traction on any surface. Whether you're hitting the track or the streets, elevate your run with unmatched support and a bold look."}
            </p>
            {/* Size Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm">Select Size</h3>
                <a
                  className="text-xs text-primary font-bold underline"
                  href="#"
                >
                  Size Guide
                </a>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product?.sizes?.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => {
                      setSelectedSize(s.size);
                      setQuantity(1);
                    }}
                    className={`h-12 border rounded-lg flex flex-col items-center justify-center font-bold text-sm transition-all
      ${
        s.stock === 0
          ? "border-gray-200 text-gray-400 cursor-not-allowed"
          : selectedSize === s.size
            ? "border-primary bg-primary/10 text-primary"
            : "border-gray-200 hover:border-primary"
      }`}
                  >
                    {s.size}
                    <span className="text-xs font-normal">({s.stock})</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Quantity and CTA */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg h-14 bg-white dark:bg-gray-900">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-full flex items-center justify-center hover:text-primary disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => {
                      const maxStock =
                        product?.sizes?.find((s) => s.size === selectedSize)
                          ?.stock ?? 1;
                      setQuantity((q) => Math.min(maxStock, q + 1));
                    }}
                    disabled={
                      !selectedSize ||
                      quantity >=
                        (product?.sizes?.find((s) => s.size === selectedSize)
                          ?.stock ?? 1)
                    }
                    className="w-12 h-full flex items-center justify-center hover:text-primary disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <button
                  disabled={!selectedSize}
                  onClick={async () => {
                    if (!product || !selectedSize) return;
                    await orderApi.addToCart({
                      productId: product.id,
                      size: selectedSize,
                      quantity,
                    });
                    alert("Added to cart!");
                  }}
                  className="flex-1 bg-primary text-white font-extrabold rounded-lg h-14 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">
                    shopping_bag
                  </span>
                  ADD TO CART
                </button>
              </div>
              <button
                disabled={!selectedSize}
                onClick={async () => {
                  if (!product || !selectedSize) return;
                  const orderId = await orderApi.buyNow({
                    productId: product.id,
                    size: selectedSize,
                    quantity,
                  });
                  navigate(`/order/checkout/${orderId}`);
                }}
                className="w-full border-2 border-gray-900 dark:border-white text-background-dark dark:text-white font-extrabold rounded-lg h-14 flex items-center justify-center hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                BUY IT NOW
              </button>
            </div>
            {/* Accordion Details */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-4">
              <details className="group cursor-pointer">
                <summary className="flex items-center justify-between list-none font-bold text-sm">
                  MATERIALS &amp; CARE
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="pt-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>Upper: Breathable engineered mesh</p>
                  <p>Midsole: CloudForm Responsive Foam</p>
                  <p>Outsole: High-abrasion rubber</p>
                  <p>Wipe clean with a damp cloth. Do not machine wash.</p>
                </div>
              </details>
              <div className="h-px bg-gray-200 dark:bg-gray-800" />
              <details className="group cursor-pointer">
                <summary className="flex items-center justify-between list-none font-bold text-sm">
                  SHIPPING &amp; RETURNS
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="pt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Free standard shipping on orders over $150. Easy returns
                    within 30 days of purchase.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
        <section className="mt-24 border-t border-gray-200 dark:border-gray-800 pt-16">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-extrabold mb-4">Customer Reviews</h2>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-6xl font-black">
                  {product?.averageRating.toFixed(1)}
                </span>
                <div className="flex flex-col mb-1">
                  <div className="flex text-primary">
                    {Array.from({ length: 5 }, (_, i) => {
                      const rating = product?.averageRating ?? 0;
                      if (i + 1 <= rating) {
                        return (
                          <span
                            key={i}
                            className="material-symbols-outlined !text-xl"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                          >
                            star
                          </span>
                        );
                      } else if (i < rating) {
                        return (
                          <span
                            key={i}
                            className="material-symbols-outlined !text-xl"
                            style={{ fontVariationSettings: '"FILL" 0.5' }}
                          >
                            star_half
                          </span>
                        );
                      } else {
                        return (
                          <span
                            key={i}
                            className="material-symbols-outlined !text-xl"
                            style={{ fontVariationSettings: '"FILL" 0' }}
                          >
                            star
                          </span>
                        );
                      }
                    })}
                  </div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Based on {product?.totalRatings} reviews
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {product?.ratings?.map((count, i) => {
                  const total = product?.totalRatings || 1;
                  const percent = Math.round((count / total) * 100);
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-xs font-bold w-4">{5 - i}</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>
              <button className="w-full mt-8 py-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all uppercase tracking-widest text-sm">
                Write a Review
              </button>
            </div>
            <div className="md:w-2/3 space-y-8">
              {product?.reviews === null ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              ) : (
                product?.reviews
                  ?.slice(0, visibleReviews)
                  .map((r) => <ReviewItem key={r.id} {...r} />)
              )}
              {product?.reviews && product.reviews.length > visibleReviews && (
                <button
                  onClick={() => setVisibleReviews((prev) => prev + 3)}
                  className="font-bold text-sm text-primary flex items-center gap-2"
                >
                  View More Reviews
                  <span className="material-symbols-outlined text-sm">
                    keyboard_arrow_down
                  </span>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
      <footer className="bg-gray-900 text-white mt-24 py-16 px-4 md:px-20">
        <div className="max-w-300 mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg
                className="size-6 text-primary"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                  fill="currentColor"
                />
              </svg>
              <h2 className="text-lg font-bold">StridePro</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The destination for high-performance sneakers and urban footwear
              since 2012.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Men's Sneakers
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Women's Sneakers
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  New Arrivals
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Best Sellers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Our Story
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Sustainability
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-xs text-gray-400 mb-4">
              Join our list for exclusive drops and 10% off your first order.
            </p>
            <div className="flex">
              <input
                className="bg-gray-800 border-none rounded-l-lg text-sm w-full px-4 focus:ring-primary"
                placeholder="Email Address"
                type="email"
              />
              <button className="bg-primary px-4 py-2 rounded-r-lg font-bold text-sm">
                JOIN
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2024 StridePro Footwear. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-500">
            <span className="material-symbols-outlined cursor-pointer hover:text-white">
              social_leaderboard
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-white">
              social_distance
            </span>
            <span className="material-symbols-outlined cursor-pointer hover:text-white">
              movie
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ProductDetailPage;
