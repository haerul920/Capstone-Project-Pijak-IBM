"use client";
import { useEffect, useState } from "react";
import LandingHeader from "../../components/HeaderLanding";
import { Star } from "lucide-react";
import CheckoutStep from "../../components/CheckoutStep";
import { useRouter } from "next/navigation";

export default function ReviewProducts() {
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);

  const [quality, setQuality] = useState(0);
  const [priceRate, setPriceRate] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [packaging, setPackaging] = useState(0);

  const [isEdit, setIsEdit] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("reviewItem"));
    setItem(data);

    const user = JSON.parse(localStorage.getItem("currentUser"));
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    // 🔥 FIX: pakai orderId
    const existing = reviews.find(
      (r) =>
        r.product === data?.name &&
        r.orderId === data?.orderId &&
        r.user === user?.username,
    );

    if (existing) {
      setIsEdit(true);
      setReview(existing.comment);
      setRating(existing.rating);
      setQuality(existing.quality || 0);
      setPriceRate(existing.priceRate || 0);
      setShipping(existing.shipping || 0);
      setPackaging(existing.packaging || 0);
      setImagePreview(existing.imageProof || null);
      setHasEdited(existing.edited || false);
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (rating === 0 || review.trim() === "") {
      alert("Rating dan review wajib diisi!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("currentUser"));
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    let sentiment = "neutral";
    if (rating >= 4) sentiment = "positive";
    else if (rating <= 2) sentiment = "negative";

    const newData = {
      product: item.name,
      orderId: item.orderId, // 🔥 KUNCI
      image: item.image,
      price: item.selling,
      user: user?.username || "Guest",

      rating: Number(rating),
      comment: review,
      imageProof: imagePreview,
      sentiment,
      date: new Date().toLocaleString(),

      // 🔥 tambahan detail rating
      quality,
      priceRate,
      shipping,
      packaging,

      edited: true,
    };

    if (isEdit) {
      if (hasEdited) {
        alert("Review hanya bisa diedit 1x!");
        return;
      }

      // 🔥 FIX: update berdasarkan orderId
      reviews = reviews.map((r) =>
        r.product === item.name &&
        r.orderId === item.orderId &&
        r.user === user.username
          ? newData
          : r,
      );
    } else {
      reviews.push(newData);
    }

    localStorage.setItem("reviews", JSON.stringify(reviews));
    window.dispatchEvent(new Event("reviewsUpdated"));

    alert(isEdit ? "Review berhasil diupdate ✏️" : "Review berhasil ⭐");


router.push("/user/OrdersPage");
  };

  if (!item) return <p className="p-10">Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <LandingHeader />

      <CheckoutStep currentStep={3} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* 🔥 IMAGE */}
          <div className="md:w-1/2 flex items-center justify-center p-10 min-h-[550px]">
            <img src={item.image} className="h-[550px] object-contain" />
          </div>

          {/* 🔥 FORM */}
          <div className="md:w-1/2 p-8 text-black flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Review Product</h2>
              <p className="text-gray-500 mb-6">
                Share your experience with this product
              </p>

              {/* PRODUCT */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-purple-600 text-sm">
                  {item.category || "Product Category"}
                </p>
              </div>

              <hr className="mb-6" />

              {/* ⭐ MAIN RATING */}
              <p className="mb-2 font-medium">Your Rating</p>
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={26}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>

              {/* 🔥 DETAIL RATING */}
              <div className="space-y-4 mb-6">
                {[
                  { label: "Quality", state: quality, set: setQuality },
                  { label: "Price", state: priceRate, set: setPriceRate },
                  { label: "Shipping", state: shipping, set: setShipping },
                  { label: "Packaging", state: packaging, set: setPackaging },
                ].map((r, i) => (
                  <div key={i}>
                    <p className="text-sm mb-1">{r.label}</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          onClick={() => r.set(star)}
                          className={`cursor-pointer ${
                            star <= r.state
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 📷 UPLOAD */}
              <p className="mb-2 font-medium">
                Upload proof <span className="text-gray-400">(optional)</span>
              </p>

              <label className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer mb-6">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <p className="text-sm text-gray-500">Click to upload image</p>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* ✍️ REVIEW */}
              <p className="mb-2 font-medium">Your Review</p>
              <textarea
                placeholder="Write your review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full h-40 border border-gray-300 rounded-xl p-4 mb-6 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* 🔘 BUTTON */}
            <button
              onClick={handleSubmit}
              className={`w-full py-3 rounded-xl font-semibold ${
                isEdit
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white`}
            >
              {isEdit ? "Edit Ulasan" : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
