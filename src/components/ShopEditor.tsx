import React, { useState } from 'react';
import { validatePlusCode } from '../utils/plusCode';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Tag, 
  Package, 
  Layout, 
  Info,
  MapPin,
  Phone,
  Type,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Shop, Product, Offer } from '../types';

interface ShopEditorProps {
  shop: Shop;
  onSave: (updatedShop: Shop) => void;
  onBack: () => void;
}

export const ShopEditor = ({ shop: initialShop, onSave, onBack }: ShopEditorProps) => {
  const [shop, setShop] = useState<Shop>(initialShop);
  const [plusCodeError, setPlusCodeError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'basic' | 'banners' | 'gallery' | 'offers' | 'products'>('basic');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(shop);
      setIsSaving(false);
    }, 1000);
  };

  const addBanner = () => {
    const newBanner = `https://picsum.photos/seed/banner${Date.now()}/800/400`;
    setShop({ ...shop, banners: [...(shop.banners || []), newBanner] });
  };

  const removeBanner = (index: number) => {
    const newBanners = [...(shop.banners || [])];
    newBanners.splice(index, 1);
    setShop({ ...shop, banners: newBanners });
  };

  const addGalleryImage = () => {
    const newImg = `https://picsum.photos/seed/gallery${Date.now()}/400/400`;
    setShop({ ...shop, gallery: [...(shop.gallery || []), newImg] });
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...(shop.gallery || [])];
    newGallery.splice(index, 1);
    setShop({ ...shop, gallery: newGallery });
  };

  const addOffer = () => {
    const newOffer: Offer = {
      id: Date.now().toString(),
      code: 'NEWOFFER',
      description: 'Get 10% off on all products',
      discountType: 'percentage',
      value: 10
    };
    setShop({ ...shop, offers: [...(shop.offers || []), newOffer] });
  };

  const removeOffer = (id: string) => {
    setShop({ ...shop, offers: (shop.offers || []).filter(o => o.id !== id) });
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: 'New Product',
      price: 0,
      rating: 5,
      image: 'https://picsum.photos/seed/product/200/200',
      category: shop.category
    };
    setShop({ ...shop, products: [...(shop.products || []), newProduct] });
  };

  const removeProduct = (id: string) => {
    setShop({ ...shop, products: (shop.products || []).filter(p => p.id !== id) });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setShop({
      ...shop,
      products: (shop.products || []).map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  const updateOffer = (id: string, updates: Partial<Offer>) => {
    setShop({
      ...shop,
      offers: (shop.offers || []).map(o => o.id === id ? { ...o, ...updates } : o)
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-4 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Edit Shop</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#1DB954] text-white px-6 py-2 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-100 flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white px-6 py-2 flex gap-4 overflow-x-auto no-scrollbar border-b border-gray-100">
        {[
          { id: 'basic', icon: <Layout />, label: 'Basic' },
          { id: 'banners', icon: <ImageIcon />, label: 'Banners' },
          { id: 'gallery', icon: <ImageIcon />, label: 'Gallery' },
          { id: 'offers', icon: <Tag />, label: 'Offers' },
          { id: 'products', icon: <Package />, label: 'Products' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
              activeSection === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-400'
            }`}
          >
            {React.cloneElement(tab.icon as React.ReactElement<any>, { className: 'w-3 h-3' })}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-24">
        <AnimatePresence mode="wait">
          {activeSection === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 bg-gray-50 rounded-3xl overflow-hidden border-4 border-white shadow-xl relative group">
                    <img src={shop.logo || shop.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">Shop Logo</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shop Name</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <Type className="w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={shop.name}
                      onChange={(e) => setShop({ ...shop, name: e.target.value })}
                      className="bg-transparent border-none outline-none flex-1 font-bold text-gray-900"
                      placeholder="Enter Shop Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <Layout className="w-5 h-5 text-gray-400" />
                    <select 
                      value={shop.category}
                      onChange={(e) => setShop({ ...shop, category: e.target.value })}
                      className="bg-transparent border-none outline-none flex-1 font-bold text-gray-900 appearance-none"
                    >
                      <option value="Grocery">Grocery</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Food">Food</option>
                      <option value="Clothing">Clothing</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location / Address</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={shop.address || shop.location}
                      onChange={(e) => setShop({ ...shop, address: e.target.value })}
                      className="bg-transparent border-none outline-none flex-1 font-bold text-gray-900"
                      placeholder="Shop Address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Google Maps Plus Code <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <span className="text-[9px] text-[#1DB954] font-bold">100% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-transparent focus-within:border-[#1DB954]">
                    <span className="text-xs font-black text-[#1DB954]">📍</span>
                    <input 
                      type="text" 
                      value={shop.plusCode || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setShop({ ...shop, plusCode: val });
                        const res = validatePlusCode(val);
                        setPlusCodeError(res.isValid ? null : res.message || 'Invalid code');
                      }}
                      className="bg-transparent border-none outline-none flex-1 font-bold text-gray-900 text-xs"
                      placeholder="e.g. 7J4V+3M Mandla or 8FVC+7W"
                    />
                  </div>
                  {plusCodeError && (
                    <p className="text-[10px] text-rose-500 font-bold ml-1">{plusCodeError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={shop.phone}
                      onChange={(e) => setShop({ ...shop, phone: e.target.value })}
                      className="bg-transparent border-none outline-none flex-1 font-bold text-gray-900"
                      placeholder="Contact Number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl">
                    <Info className="w-5 h-5 text-gray-400 mt-1" />
                    <textarea 
                      value={shop.description}
                      onChange={(e) => setShop({ ...shop, description: e.target.value })}
                      className="bg-transparent border-none outline-none flex-1 font-bold text-gray-900 min-h-[100px] resize-none"
                      placeholder="Tell customers about your shop..."
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'banners' && (
            <motion.div
              key="banners"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Shop Banners</h3>
                <button 
                  onClick={addBanner}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {(shop.banners || []).map((banner, i) => (
                  <div key={i} className="relative aspect-video rounded-3xl overflow-hidden border border-gray-100 group">
                    <img src={banner} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => removeBanner(i)}
                        className="p-2 bg-red-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {(!shop.banners || shop.banners.length === 0) && (
                  <div className="py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-gray-100">
                    <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-400">No banners added yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Shop Gallery</h3>
                <button 
                  onClick={addGalleryImage}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(shop.gallery || []).map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-3xl overflow-hidden border border-gray-100 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!shop.gallery || shop.gallery.length === 0) && (
                  <div className="col-span-2 py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-gray-100">
                    <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-400">No gallery images added yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'offers' && (
            <motion.div
              key="offers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Shop Offers</h3>
                <button 
                  onClick={addOffer}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {(shop.offers || []).map((offer) => (
                  <div key={offer.id} className="bg-white p-6 rounded-[32px] border border-gray-100 relative group">
                    <button 
                      onClick={() => removeOffer(offer.id)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Offer Code</label>
                        <input 
                          type="text" 
                          value={offer.code}
                          onChange={(e) => updateOffer(offer.id, { code: e.target.value })}
                          className="w-full bg-gray-50 p-3 rounded-xl border-none outline-none font-black text-gray-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                        <input 
                          type="text" 
                          value={offer.description}
                          onChange={(e) => updateOffer(offer.id, { description: e.target.value })}
                          className="w-full bg-gray-50 p-3 rounded-xl border-none outline-none font-bold text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(!shop.offers || shop.offers.length === 0) && (
                  <div className="py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-gray-100">
                    <Tag className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-400">No offers created yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Shop Products</h3>
                <button 
                  onClick={addProduct}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {(shop.products || []).map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-[32px] border border-gray-100 flex items-center gap-4 relative group">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <input 
                        type="text" 
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                        className="w-full bg-transparent border-none outline-none font-bold text-gray-900"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">₹</span>
                        <input 
                          type="number" 
                          value={product.price}
                          onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })}
                          className="w-20 bg-transparent border-none outline-none font-black text-gray-900"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeProduct(product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!shop.products || shop.products.length === 0) && (
                  <div className="py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-gray-100">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-400">No products added yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
