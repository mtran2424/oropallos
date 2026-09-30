import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { IoIosAdd, IoIosCloseCircle } from "react-icons/io";
import { Product, ProductCategories, sanitize } from "@/components/global.utils";
import { createProduct } from "@/app/api/productapi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/ui/form/TextInput";
import TextArea from "@/components/ui/form/TextArea";
import DropdownSelect from "@/components/ui/form/DropdownSelect";
import NumInput from "@/components/ui/form/NumInput";

// This component is a button that opens a modal for adding a product
const AddProduct = ({ onAddProduct, products }: {
  onAddProduct: () => void;
  products: Product[]
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [add, setAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  // States for form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [type, setType] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [abv, setAbv] = useState<number | undefined>(undefined);
  const [size, setSize] = useState("750mL");
  const [upc, setUpc] = useState("");
  const [unitPrice, setUnitPrice] = useState<number | undefined>(undefined);
  const [unitCount, setUnitCount] = useState<number>(0);
  const [itemType, setItemType] = useState("");

  // States for suggestions
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [sizeSuggestions, setSizeSuggestions] = useState<string[]>([]);

  // Function to handle image upload to Cloudinary
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    const file = e.target.files?.[0];
    if (!file) return;

    // Get the signature and timestamp from your API route
    const response = await fetch('/api/cloudinary-signature', {
      method: 'POST',
    });
    const data = await response.json();

    // Prepare the FormData for the image upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', data.apiKey); // Cloudinary API Key
    formData.append('signature', data.signature); // Signed signature
    formData.append('timestamp', data.timestamp.toString()); // Timestamp
    formData.append('upload_preset', 'ml_default'); // Your upload preset
    formData.append('folder', 'oropallos'); // Folder in Cloudinary

    // Upload the image to Cloudinary
    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const uploadData = await uploadRes.json();

    // Get the secure URL from Cloudinary and set it
    if (uploadData.secure_url) {
      setLoading(false);
      setImageUrl(uploadData.secure_url); // Cloudinary's public image URL
      console.log('Image uploaded successfully:', uploadData.secure_url);
      toast.success('Image uploaded successfully!');
    } else {
      setLoading(false);
      console.error('Error uploading image:', uploadData.error);
      toast.error('Error uploading image. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  // Upon form submission, validate the input and send it to the backend
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validate input fields
    if (!name || !price || !category || !subcategory || !size || !itemType) {
      toast.error(`Please fill in all required fields.`);
      setLoading(false);
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
      upc: upc,
      hidden: false,
      unitPrice: unitPrice !== undefined ? parseInt((unitPrice * 100).toFixed(0)) : undefined,
      unitCount: unitCount,
      itemType: itemType
    };

    // Send the product data to the backend API to create a new product
    createProduct(productData)
      .then(() => {
        onAddProduct();
        // Show success message
        toast.success(`Product ${name} added successfully!`);

        // Reset form fields after successful submission
        setName("");
        setPrice(undefined);
        setCategory("");
        setSubcategory("");
        setType("");
        setDescription("");
        setImageUrl("");
        setAbv(undefined);
        setSize("750mL");
        setUpc("");
        setUnitPrice(undefined);
        setUnitCount(0);

        // Close the modal after submission
        setAdd(false);
      }).finally(() => {
        setLoading(false);
      });
  };

  // Open the modal for adding a product
  const openAddModal = () => {
    setAdd(true);
  };

  // Close the modal for adding a product
  const closeAddModal = () => {
    setAdd(false);
  };

  // Close the modal when clicking outside of it
  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeAddModal();
    }
  }, []);

  // Effect to fetch product names for suggestions
  useEffect(() => {
    // If the name is less than 2 characters, clear suggestions
    if (name.length < 2) {
      setNameSuggestions([]);
      return;
    }

    // Unique array of product names
    const productNames = [...new Set(products.map((product) => product.name))];

    // Example local filtering. Replace with API fetch if needed.
    const matches = productNames.filter((product) =>
      sanitize(product).toLowerCase().includes(sanitize(name.toLowerCase()))
    );
    setNameSuggestions(matches);
  }, [name, products]);

  // Effect to fetch product names for suggestions
  useEffect(() => {
    // If the name is less than 2 characters, clear suggestions
    if (size.length < 2) {
      setSizeSuggestions([]);
      return;
    }

    // Unique array of product sizes
    const productSizes = [
      ...new Set(products.map((product) => product.size))
    ]

    // Example local filtering. Replace with API fetch if needed.
    const matches = productSizes.filter((product) =>
      product.toLowerCase().includes(size.toLowerCase())
    );

    setSizeSuggestions(matches);
  }, [size, products]);

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
        onClick={openAddModal}>
        <IoIosAdd size={25} />
        Add Product
      </motion.button>

      {/* Modal for adding products */}
      <Modal open={add} title="Add Product" onClose={closeAddModal} ref={modalRef} >
        {/* Form for adding products */}
        <div className="mt-6 w-full border-t border-zinc-500 text-sm sm:text-md p-4">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Name Field */}
            <TextInput
              required
              name="Product Name"
              value={name}
              setValue={setName}
              onChange={(e) => {
                setName(e.target.value)
              }}
              suggestions={nameSuggestions}
            >
              <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
                i.e. {'\"'}Tito{'\''}s Handmade Vodka{'\"'} or {'\"'}Rebellious Pinot Noir{'\"'}
              </div>
            </TextInput>

            <div className="text-lg font-semibold text-zinc-500 w-full text-left px-4">Classification</div>

            {/* Category Field */}
            <DropdownSelect
              id="category"
              name="Category"
              value={category}
              onChange={(e) => {
                if (e.target.value !== category) {
                  // Reset subcategory and type when category changes
                  setSubcategory("");
                  setType("");
                }
                setCategory(e.target.value);
              }}
            >
              <option value=""></option>
              {ProductCategories.map((category, index) => (
                <option key={index} value={category.value}>
                  {category.name}
                </option>
              ))}
            </DropdownSelect>

            {/* Subategory Field */}
            <DropdownSelect
              id="subcategory"
              name="Subcategory"
              value={subcategory}
              onChange={(e) => {
                if (e.target.value !== subcategory) {
                  // Reset type when subcategory changes
                  setType("");
                }
                setSubcategory(e.target.value)
              }}
            >
              <option value=""></option>
              {/* Render subcategory options based on selected category */}
              {category && (
                ProductCategories.filter((cat) => cat.value === category)[0].subcategories
                  .map((subcategory, index) => (
                    <option key={index} value={subcategory.value}>
                      {subcategory.name}
                    </option>
                  )))
              }
            </DropdownSelect>

            {/* Type Field */}
            <DropdownSelect
              id="type"
              name="Type"
              value={type}
              onChange={(e) => {
                setType(e.target.value)
              }}
            >
              <option value=""></option>
              {(category && subcategory) &&
                (ProductCategories.filter((cat) => cat.value === category)[0].subcategories
                  .filter((subcat) => subcat.value === subcategory)[0].types
                  .map((type, index) => (
                    <option key={index} value={type.value}>
                      {type.name}
                    </option>
                  )))}
            </DropdownSelect>

            <div className="text-lg font-semibold text-zinc-500 w-full text-left px-4">Details</div>

            {/* Price Field */}

            <NumInput
              name="Price"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={price || ""}
              onChange={(e) => {
                const value = e.target.value;
                setPrice(value === "" ? undefined : parseFloat(value));
              }}
            >
              <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
              i.e. {'\"'}19.99{'\"'} - No $ sign needed
            </div>
            </NumInput>

            <TextInput
              required
              name="Size"
              value={size}
              setValue={setSize}
              onChange={(e) => {
                setSize(e.target.value)
              }}
              suggestions={sizeSuggestions}
            >
              <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
                i.e. {'\"'}750mL{'\"'} or {'\"'}1.5L{'\"'}
              </div>
            </TextInput>

            {/* ABV Field */}
            <NumInput
              name="ABV"
              inputMode="decimal"
              step="0.1"
              min="0"
              value={abv || ""}
              onChange={(e) => {
                const value = e.target.value;
                setAbv(value === "" ? undefined : parseFloat(value));
              }}>
              <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
                i.e. {'\"'}40{'\"'} - No % sign needed
              </div>
            </NumInput>

            {/* Item Type Selection */}
            <DropdownSelect
              id="itemType"
              name="Item Type"
              value={itemType}
              onChange={(e) => {
                setItemType(e.target.value)
              }}
            >
              <option value=""></option>
              <option value={"Liquor"}>
                Liquor
              </option>
              <option value={"Wine"}>
                Wine
              </option>
            </DropdownSelect>

            <NumInput
              name="Unit Price"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={unitPrice || ""}
              onChange={(e) => {
                const value = e.target.value;
                setUnitPrice(value === "" ? undefined : parseFloat(value));
              }}
            >
              <div className="text-sm font-semibold text-zinc-500 w-full text-left px-4">
              i.e. {'\"'}19.99{'\"'} - No $ sign needed
            </div>
            </NumInput>

            <NumInput
              name="Unit Count"
              step="1"
              value={unitCount || "0"}
              onChange={(e) => {
                const value = e.target.value;
                setUnitCount(parseInt(value));
              }}
            >
            </NumInput>

            <TextArea
              name="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextInput
              required
              name="UPC"
              value={upc || ""}
              setValue={setUpc}
              onChange={(e) => {
                setUpc(e.target.value)
              }}
            >
            </TextInput>

            {/* Image Upload Field */}
            <label className="text-md font-semibold text-zinc-700 w-full text-left px-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-gray-600 bg-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all duration-200 ease-in-out"
            />
            <label className="text-md font-semibold text-gray-600 w-full text-left px-2">Image Preview:</label>
            <div className="text-md font-semibold text-zinc-500 w-full text-left px-4">or</div>
            <TextInput
              name="URL"
              value={imageUrl}
              setValue={setImageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value)
              }}
            >
              <div className="text-sm font-medium text-zinc-500 text-left px-4 wrap-break-word">
                Please only use the URL field for reused images from Cloudinary. Preexisting
                <br />
                URLs can be found under the image column in the spreadsheet. Duplicate
                <br />
                image uploads get expensive eventually.
                <br />
                Also, please paste URLs in. System does not work with manual entry
              </div>
            </TextInput>
            {imageUrl && (
              <div className="relative inline-block px-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  onClick={handleRemoveImage}
                  className="relative text-red-500 hover:text-red-400 bg-white rounded-full"
                  aria-label="Remove image"
                >
                  <IoIosCloseCircle size={30} />
                </motion.button>
                <Image
                  src={imageUrl}
                  width={400}
                  height={400}
                  alt="Uploaded image"
                  className="rounded-md"
                />
              </div>
            )}

            {loading ? (
              // Loading spinner
              <div className="flex justify-center items-center py-2">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              // Submit button
              <motion.button
                whileHover={{ scale: 1.02 }}
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
              >
                Submit
              </motion.button>
            )}
          </form>
        </div>
      </Modal>

    </>
  );
}

export default AddProduct;