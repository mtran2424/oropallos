import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  categoryOptions,
  Product, wineSubcategoryOptions,
  liquorSubcategoryOptions,
  otherWineSubcategoryOptions,
  sparklingWineSubcategoryOptions,
  blushWineSubcategoryOptions
} from "@/components/global.utils";
import { editProduct } from "@/app/api/productapi";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdModeEditOutline } from "react-icons/md";
import Image from "next/image";
import { IoIosCloseCircle } from "react-icons/io";

// This component is a button that opens a modal for adding a product
const EditProduct = ({ product, onEditProduct }: { product: Product, onEditProduct: () => void; }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [edit, setEdit] = useState(false);

  // States for form fields
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState<number>(product.price);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [subcategory, setSubcategory] = useState(product.subcategory);
  const [type, setType] = useState(product.type);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Step 1: Get the signature and timestamp from your API route
    const response = await fetch('/api/cloudinary-signature', {
      method: 'POST',
    });
    const data = await response.json();

    // Step 2: Prepare the FormData for the image upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', data.apiKey); // Cloudinary API Key
    formData.append('signature', data.signature); // Signed signature
    formData.append('timestamp', data.timestamp.toString()); // Timestamp
    formData.append('upload_preset', 'ml_default'); // Your upload preset
    formData.append('folder', 'oropallos'); // (Optional) Specify folder in Cloudinary

    // Step 3: Upload the image to Cloudinary
    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const uploadData = await uploadRes.json();

    // Step 4: Get the secure URL from Cloudinary and set it
    if (uploadData.secure_url) {
      setImageUrl(uploadData.secure_url); // Cloudinary's public image URL
      console.log('Image uploaded successfully:', uploadData.secure_url);
    } else {
      console.error('Error uploading image:', uploadData.error);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  // Upon form submission, validate the input and send it to the backend
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input fields
    if (!name || !price || !category || !subcategory) {
      alert(`Please fill in all required fields.`);
      return;
    }

    // Construct product data object to be sent to the API
    const productData = {
      name: name,
      description: description,
      price: price,
      category: category,
      subcategory: subcategory,
      type: type,
      imageUrl: imageUrl,
    };

    if (product.id) {
      editProduct(product.id, productData)
        .then(() => {
          onEditProduct();
        }).then(() => {
          // Show success message
          toast.success(`Product ${name} edited successfully!`);

          // Close the modal after submission
          setEdit(false);
        });
    } else {
      toast.error("Product ID is undefined.");
    }
  };

  // Open the modal for adding a product
  const openEventModal = () => {
    setEdit(true);
  };

  // Close the modal for adding a product
  const closeEventModal = () => {
    setEdit(false);
  };

  // Close the modal when clicking outside of it
  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeEventModal();
    }
  }, []);

  // Add event listener for closing the modal when clicking outside of it
  useEffect(() => {
    if (edit) {
      document.addEventListener('mousedown', closeModalOnOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', closeModalOnOutsideClick);
    };
  }, [closeModalOnOutsideClick, edit]);

  return (
    <>
      {/* Edit event button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-xl text-blue-500 hover:text-zinc-200 p-1"
        onClick={openEventModal}>
        <MdModeEditOutline size={25} />
      </motion.button>

      {/* Modal for adding event */}
      <AnimatePresence mode="wait">
        {edit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "0" }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              ref={modalRef}
              className="relative bg-white p-6 rounded-2xl max-w-2xl w-full shadow-lg max-h-[70vh] overflow-auto border-1 border-zinc-500"
            >
              {/* Modal Header */}
              <h3 className="text-2xl text-zinc-900 mb-4 mt-2 text-left">Edit Product</h3>

              {/* Close Modal Button */}
              <div className="absolute top-4 right-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-lg text-blue-500 hover:text-zinc-200"
                  onClick={closeEventModal}
                >
                  Close
                </motion.button>
              </div>

              {/* Form for adding event */}
              <div className="mt-6 w-full border-t-1 border-zinc-500 text-sm sm:text-md rounded-lg p-4">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                  {/* Name Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Product Name</label>
                  <input
                    type="text"
                    required
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />

                  {/* Category Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Category</label>
                  <select
                    id="category"
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.value !== category) {
                        // Reset subcategory and type when category changes
                        setSubcategory("");
                        setType("");
                      }
                      setCategory(e.target.value);
                    }}
                    value={category}
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* Subategory Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Subcategory</label>
                  <select
                    id="subcategory"
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.value !== subcategory) {
                        // Reset type when subcategory changes
                        setType("");
                      }
                      setSubcategory(e.target.value)
                    }}
                    value={category}
                  >
                    <option value="">Select Subcategory</option>
                    {/* Render subcategory options based on selected category */}
                    {category === "Liquor" ? liquorSubcategoryOptions.map((subcategory, index) => (
                      <option key={index} value={subcategory.name}>
                        {subcategory.name}
                      </option>
                    )) :
                      category === "Other_Wine" ? otherWineSubcategoryOptions.map((subcategory, index) => (
                        <option key={index} value={subcategory.name}>
                          {subcategory.name}
                        </option>
                      )) :
                        category === "Red_Wine" || category === "White_Wine" ?
                          wineSubcategoryOptions.map((subcategory, index) => (
                            <option key={index} value={subcategory.name}>
                              {subcategory.name}
                            </option>
                          )) :
                          category === "Sparkling_Wine" ? sparklingWineSubcategoryOptions.map((subcategory, index) => (
                            <option key={index} value={subcategory.name}>
                              {subcategory.name}
                            </option>
                          )) :
                            category === "Blush_Wine" ? blushWineSubcategoryOptions.map((subcategory, index) => (
                              <option key={index} value={subcategory.name}>
                                {subcategory.name}
                              </option>
                            )) :
                              <option value="">Select Subcategory</option>
                    }
                  </select>

                  {/* Type Field */}

                  {/* Price Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Price"
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    value={price}
                  />

                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Description</label>
                  <textarea
                    className="border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Product Description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  ></textarea>

                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-gray-600 bg-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {imageUrl && (
                    <div className="relative inline-block px-2">
                      <motion.button
                      whileHover={{ scale: 1.05 }}
                        onClick={handleRemoveImage}
                        className="relative text-red-600 hover:text-red-400 bg-white rounded-full"
                        aria-label="Remove image"
                      >
                        <IoIosCloseCircle size={30} />
                      </motion.button>
                      <Image
                        src={imageUrl}
                        width={200}
                        height={200}
                        alt="Uploaded image"
                        className="rounded-md"
                      />
                    </div>
                  )}

                  {/* TODO: Add loading spinner */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
                  >
                    Submit
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div >
        )}

      </AnimatePresence >

    </>
  );
}

export default EditProduct;