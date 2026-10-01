import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Product, ProductCategories, sanitize } from "@/components/global.utils";
import { editProduct } from "@/app/api/productapi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdModeEditOutline } from "react-icons/md";
import Image from "next/image";
import { IoIosCloseCircle } from "react-icons/io";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/ui/form/TextInput";
import DropdownSelect from "@/components/ui/form/DropdownSelect";
import NumInput from "@/components/ui/form/NumInput";
import TextArea from "@/components/ui/form/TextArea";

// This component is a button that opens a modal for adding a product
const EditProduct = ({ onEditProduct, product, products }: {
  onEditProduct: () => void;
  product: Product,
  products: Product[];
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // States for form fields
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState<number | undefined>(product.price || undefined);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [subcategory, setSubcategory] = useState(product.subcategory);
  const [type, setType] = useState(product.type);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");
  const [abv, setAbv] = useState<number | undefined>(product.abv || undefined);
  const [size, setSize] = useState(product.size);
  const [upc, setUpc] = useState<string>(product.upc || "");
  const [unitPrice, setUnitPrice] = useState<number | undefined>(product.unitPrice !== undefined ? product.unitPrice / 100 : undefined);
  const [unitCount, setUnitCount] = useState<number>(product.unitCount);
  const [unitsPerCase, setUnitsPerCase] = useState<number | undefined>(product.unitsPerCase);
  const [itemType, setItemType] = useState(product.itemType);

  // States for suggestions
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [sizeSuggestions, setSizeSuggestions] = useState<string[]>([]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
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
      setLoading(false);
      toast.success("Image uploaded successfully!");
      console.log('Image uploaded successfully:', uploadData.secure_url);
    } else {
      setLoading(false);
      toast.error("Image upload failed. Please try again.");
      console.error('Error uploading image:', uploadData.error);
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
      favorite: product.favorite,
      abv: abv,
      size: size,
      upc: upc,
      hidden: product.hidden,
      unitPrice: unitPrice !== undefined ? unitPrice * 100 : undefined,
      unitCount: unitCount,
      unitsPerCase: unitsPerCase,
      itemType: itemType,
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
        }).finally(() => {
          // Reset loading state
          setLoading(false);
        });
    } else {
      toast.error("Product ID is undefined.");
      setLoading(false);
    }
  };

  // Open the modal for adding a product
  const openEditModal = () => {
    setEdit(true);
  };

  // Close the modal for adding a product
  const closeEditModal = () => {
    setEdit(false);
  };

  // Close the modal when clicking outside of it
  const closeModalOnOutsideClick = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeEditModal();
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
    if (edit) {
      document.addEventListener('mousedown', closeModalOnOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', closeModalOnOutsideClick);
    };
  }, [closeModalOnOutsideClick, edit]);

  // Reset form fields when product changes
  useEffect(() => {
    setName(product.name);
    setPrice(product.price || undefined);
    setDescription(product.description);
    setCategory(product.category);
    setSubcategory(product.subcategory);
    setType(product.type);
    setImageUrl(product.imageUrl || "");
    setAbv(product.abv || undefined);
    setSize(product.size);
    setUpc(product.upc || "");
    setUnitPrice(product.unitPrice !== undefined ? product.unitPrice / 100 : undefined);
    setUnitCount(product.unitCount);
    setUnitsPerCase(product.unitsPerCase);
  }, [product]);

  return (
    <>
      {/* Edit event button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-xl text-blue-500 hover:text-blue-400 p-1"
        onClick={openEditModal}>
        <MdModeEditOutline size={35} />
      </motion.button>

      {/* Modal for editing event */}
      <Modal open={edit} title="Edit Product" onClose={closeEditModal} ref={modalRef} >
        {/* Form for editing event */}
        <div className="mt-6 w-full border-t border-zinc-500 text-sm sm:text-md p-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

            {/* Size Field */}
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

            {/* Unit Price Field */}
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

            <NumInput
              name="Units Per Case"
              step="1"
              value={unitsPerCase || "0"}
              onChange={(e) => {
                const value = e.target.value;
                setUnitsPerCase(parseInt(value));
              }}
            >
            </NumInput>

            <TextArea
              name="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* UPC Field */}
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
              className="w-full text-gray-600 bg-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
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

export default EditProduct;