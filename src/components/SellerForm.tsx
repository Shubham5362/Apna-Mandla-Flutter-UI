import React, { useState, useEffect } from 'react';
import { Store, ArrowLeft, CheckCircle, Clock, AlertCircle, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { validatePlusCode } from '../utils/plusCode';

interface ApplicationData {
  shopName: string;
  category: string;
  address: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  aadhaarPhoto?: string;
  panPhoto?: string;
  shopPhoto?: string;
}

export const SellerForm = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    shopName: '',
    category: 'Grocery',
    address: '',
    plusCode: '',
    phone: '',
    aadhaarPhoto: '',
    panPhoto: '',
    shopPhoto: '',
  });
  const [plusCodeError, setPlusCodeError] = useState<string | null>(null);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Mocking application check for now
    setLoading(false);
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (formData.phone.length !== 10) {
      console.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!formData.aadhaarPhoto || !formData.panPhoto || !formData.shopPhoto) {
      console.error('Aadhaar, PAN, and Shop photos are mandatory');
      return;
    }

    setSubmitting(true);
    try {
      // API call execution
      setApplication({
        ...formData,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const ImageInput = ({ label, field, value }: { label: string, field: string, value: string }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, field)}
          className="hidden"
          id={`file-${field}`}
        />
        <label
          htmlFor={`file-${field}`}
          className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
            value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-400'
          }`}
        >
          {value ? (
            <div className="relative w-full h-full p-2">
              <img src={value} alt={label} className="w-full h-full object-contain rounded-lg" />
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Camera className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-medium">Upload {label}</span>
            </div>
          )}
        </label>
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (application) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <button onClick={onBack} className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {application.status === 'pending' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Application Pending</h1>
            <p className="text-gray-500 max-w-xs mx-auto">
              Your application for <strong>{application.shopName}</strong> has been submitted. 
              Our admin team will review it shortly.
            </p>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-orange-700 text-sm font-medium">
              Status: PENDING FOR APPROVAL
            </div>
          </motion.div>
        )}

        {application.status === 'rejected' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Application Rejected</h1>
            <p className="text-gray-500 max-w-xs mx-auto">
              We're sorry, but your application was not approved at this time.
            </p>
            <button 
              onClick={() => setApplication(null)}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {application.status === 'approved' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Congratulations!</h1>
            <p className="text-gray-500">Your seller account is approved.</p>
            <p className="text-sm font-bold text-green-600">Please restart the app to see your Seller Dashboard.</p>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-24 no-scrollbar">
      <header className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Become a Seller</h1>
      </header>

      <div className="p-6">
        <div className="bg-green-600 p-8 rounded-3xl text-white mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Grow your business with Apna Mandla</h2>
            <p className="text-white/80 text-sm">Fill the form below to start selling your products locally.</p>
          </div>
          <Store className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Shop Name</label>
            <input
              required
              type="text"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Mandla Fresh Mart"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Grocery</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Food & Restaurant</option>
              <option>Services</option>
              <option>Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Shop Address</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[80px]"
              placeholder="Full address of your shop in Mandla..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 uppercase">Google Maps Plus Code (Optional)</label>
              <span className="text-[10px] text-green-600 font-bold">Pinpoint Location</span>
            </div>
            <input
              type="text"
              value={formData.plusCode}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, plusCode: val });
                const res = validatePlusCode(val);
                setPlusCodeError(res.isValid ? null : res.message || 'Invalid code');
              }}
              className={`w-full p-3 bg-gray-50 rounded-xl border ${
                plusCodeError ? 'border-red-500' : 'border-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold`}
              placeholder="e.g. 7J4V+3M Mandla or 8FVC+7W"
            />
            {plusCodeError && (
              <p className="text-[10px] text-red-500 font-bold">{plusCodeError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Contact Number</label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="10-digit mobile number"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <ImageInput label="Aadhaar Card Photo" field="aadhaarPhoto" value={formData.aadhaarPhoto} />
            <ImageInput label="PAN Card Photo" field="panPhoto" value={formData.panPhoto} />
            <ImageInput label="Shop Photo" field="shopPhoto" value={formData.shopPhoto} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-green-100 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};
