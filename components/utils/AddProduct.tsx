import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { IoIosAdd, IoIosCloseCircle } from "react-icons/io";
import { Product, ProductCategories } from "@/components/global.utils";
import { createProduct } from "@/app/api/productapi";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";

// This component is a button that opens a modal for adding a product
const AddProduct = ({ onAddProduct }: { onAddProduct: (product: Product) => void; }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [add, setAdd] = useState(false);

  // States for form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [type, setType] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [abv, setAbv] = useState<number | undefined>(undefined);
  const [size, setSize] = useState("750mL");

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
    if (!name || !price || !category || !subcategory || !size) {
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
      favorite: false,
      abv: abv,
      size: size,
    };

    // Send the product data to the backend API to create a new product
    createProduct(productData)
      .then((response) => {
        onAddProduct({
          id: response.product.id,
          name: name,
          description: description,
          price: price,
          category: category,
          subcategory: subcategory,
          type: type,
          abv: abv,
          favorite: false,
          size: size,
        });
      }).then(() => {
        // Show success message
        toast.success(`Product ${name} added successfully!`);

        // Reset form fields after successful submission
        setName("");
        setPrice(0);
        setCategory("");
        setSubcategory("");
        setType("");
        setDescription("");
        setImageUrl("");
        setAbv(0);
        setSize("750mL");

        // Close the modal after submission
        setAdd(false);
      });
  };

  // Open the modal for adding a product
  const openEventModal = () => {
    setAdd(true);
  };

  // Close the modal for adding a product
  const closeEventModal = () => {
    setAdd(false);
  };

  // Close the modal when clicking outside of it
  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeEventModal();
    }
  }, []);

  // Add event listener for closing the modal when clicking outside of it
  useEffect(() => {
    if (add) {
      document.addEventListener('mousedown', closeModalOnOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', closeModalOnOutsideClick);
    };
  }, [closeModalOnOutsideClick, add]);

  return (
    <>
      {/* Add event button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-row text-md items-center text-blue-500 hover:text-blue-300 p-1"
        onClick={openEventModal}>
        <IoIosAdd size={25} />
        Add Product
      </motion.button>

      {/* Modal for adding event */}
      <AnimatePresence mode="wait">
        {add && (
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
              <h3 className="text-xl text-zinc-900 mb-4 mt-2 text-left">Add Product</h3>

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
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                  <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
                    i.e. {'\"'}Josh Red Blend{'\"'} or {'\"'}Recipe 21{'\"'}
                  </div>

                  <div className="text-lg font-semibold text-zinc-500 w-full text-left px-4">Classification</div>

                  {/* Category Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Category</label>
                  <select
                    id="category"
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
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
                    {ProductCategories.map((category, index) => (
                      <option key={index} value={category.value}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* Subategory Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Subcategory</label>
                  <select
                    id="subcategory"
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    onChange={(e) => {
                      if (e.target.value !== subcategory) {
                        // Reset type when subcategory changes
                        setType("");
                      }
                      setSubcategory(e.target.value)
                    }}
                    value={subcategory}
                  >
                    <option value="">Select Subcategory</option>
                    {/* Render subcategory options based on selected category */}
                    {category && (
                      ProductCategories.filter((cat) => cat.value === category)[0].subcategories
                        .map((subcategory, index) => (
                          <option key={index} value={subcategory.value}>
                            {subcategory.name}
                          </option>
                        )))
                    }
                  </select>

                  {/* Type Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Type</label>
                  <select
                    id="type"
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    onChange={(e) => {
                      setType(e.target.value)
                    }}
                    value={type}
                  >
                    <option value="">Select Type</option>
                    {(category && subcategory) &&
                      (ProductCategories.filter((cat) => cat.value === category)[0].subcategories
                        .filter((subcat) => subcat.value === subcategory)[0].types
                        .map((type, index) => (
                          <option key={index} value={type.value}>
                            {type.name}
                          </option>
                        )))}
                  </select>

                  <div className="text-lg font-semibold text-zinc-500 w-full text-left px-4">Details</div>

                  {/* Price Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    placeholder="Price"
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    value={price}
                  />
                  <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
                    i.e. {'\"'}19.99{'\"'} - No $ sign needed
                  </div>

                  {/* Size Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Size</label>
                  <input
                    type="text"
                    required
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    placeholder="Size"
                    onChange={(e) => setSize(e.target.value)}
                    value={size}
                  />
                  <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
                    i.e. {'\"'}750mL{'\"'} or {'\"'}1.5L{'\"'}
                  </div>

                  {/* ABV Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">ABV</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    placeholder="ABV"
                    onChange={(e) => {
                      const value = e.target.value;
                      setAbv(value === "" ? undefined : parseFloat(value));
                    }}
                    value={abv ?? ""}
                  />
                  <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
                    i.e. {'\"'}40{'\"'} - No % sign needed
                  </div>

                  {/* Description Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Description</label>
                  <textarea
                    className="border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    placeholder="Product Description"
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>

                  {/* Image Upload Field */}
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-gray-600 bg-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all duration-200 ease-in-out"
                  />
                  <label className="text-md font-semibold text-gray-600 w-full text-left px-2">Image Preview:</label>
                  <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">URL</label>
                  <input
                    type="text"
                    className="border border-zinc-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    placeholder="Size"
                    onChange={(e) => setImageUrl(e.target.value)}
                    value={imageUrl}
                  />
                  <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
                    Please use only use URL field for reused images from cloudinary. Preexisting URLs can be found under image in spreadsheet.
                    Duplicate image uploads get expensive quickly.
                  </div>
                  {imageUrl && (
                    <div className="relative inline-block px-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={handleRemoveImage}
                        className="relative text-red-600 hover:text-red-500 bg-white rounded-full"
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

export default AddProduct;